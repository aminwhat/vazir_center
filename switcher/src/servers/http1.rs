use http_body_util::BodyExt;
use hyper::service::service_fn;
use hyper::Request;
use hyper::{Error, Response};
use hyper_util::rt::TokioIo;
use std::cell::Cell;
use std::net::SocketAddr;
use std::rc::Rc;
use tokio::io::{self, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::net::TcpStream;

use crate::common::body::Body;
use crate::common::io_type::IOTypeNotSend;
use crate::core::env::Env;

pub async fn http1_server(env: &Env) -> Result<(), Box<dyn std::error::Error>> {
    let addr = SocketAddr::from((
        [0, 0, 0, 0],
        env.check_http1_port().parse::<u16>().unwrap_or(2999),
    ));

    let listener = TcpListener::bind(addr).await?;

    // For each connection, clone the counter to use in our service...
    let counter = Rc::new(Cell::new(0));

    println!("Listening http1 on http://{}", addr);

    loop {
        let (stream, _) = listener.accept().await?;

        let io = IOTypeNotSend::new(TokioIo::new(stream));

        let cnt = counter.clone();

        let service = service_fn(move |_| {
            let prev = cnt.get();
            cnt.set(prev + 1);
            let value = cnt.get();
            async move { Ok::<_, Error>(Response::new(Body::from(format!("Request #{}", value)))) }
        });

        tokio::task::spawn_local(async move {
            if let Err(err) = hyper::server::conn::http1::Builder::new()
                .serve_connection(io, service)
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}

pub async fn http1_client(url: hyper::Uri) -> Result<(), Box<dyn std::error::Error>> {
    let host = url.host().expect("uri has no host");
    let port = url.port_u16().unwrap_or(80);
    let addr = format!("{}:{}", host, port);
    let stream = TcpStream::connect(addr).await?;

    let io = IOTypeNotSend::new(TokioIo::new(stream));

    let (mut sender, conn) = hyper::client::conn::http1::handshake(io).await?;

    tokio::task::spawn_local(async move {
        if let Err(err) = conn.await {
            let mut stdout = io::stdout();
            stdout
                .write_all(format!("Connection failed: {:?}", err).as_bytes())
                .await
                .unwrap();
            stdout.flush().await.unwrap();
        }
    });

    let authority = url.authority().unwrap().clone();

    // Make 4 requests
    for _ in 0..4 {
        let req = Request::builder()
            .uri(url.clone())
            .header(hyper::header::HOST, authority.as_str())
            .body(Body::from("test".to_string()))?;

        let mut res = sender.send_request(req).await?;

        let mut stdout = io::stdout();
        stdout
            .write_all(format!("Response: {}\n", res.status()).as_bytes())
            .await
            .unwrap();
        stdout
            .write_all(format!("Headers: {:#?}\n", res.headers()).as_bytes())
            .await
            .unwrap();
        stdout.flush().await.unwrap();

        // Print the response body
        while let Some(next) = res.frame().await {
            let frame = next?;
            if let Some(chunk) = frame.data_ref() {
                stdout.write_all(&chunk).await.unwrap();
            }
        }
        stdout.write_all(b"\n-----------------\n").await.unwrap();
        stdout.flush().await.unwrap();
    }
    Ok(())
}
