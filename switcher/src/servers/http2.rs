use http_body_util::BodyExt;
use hyper::server::conn::http2;
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

pub async fn http2_server(env: &Env) -> Result<(), Box<dyn std::error::Error>> {
    let mut stdout = io::stdout();

    let addr: SocketAddr = (
        [127, 0, 0, 1],
        env.check_http2_port().parse::<u16>().unwrap(),
    )
        .into();
    // Using a !Send request counter is fine on 1 thread...
    let counter = Rc::new(Cell::new(0));

    let listener = TcpListener::bind(addr).await?;

    stdout
        .write_all(format!("Listening http2 on http://{}\n", addr).as_bytes())
        .await
        .unwrap();
    stdout.flush().await.unwrap();

    loop {
        let (stream, _) = listener.accept().await?;
        let io = IOTypeNotSend::new(TokioIo::new(stream));

        // For each connection, clone the counter to use in our service...
        let cnt = counter.clone();

        let service = service_fn(move |_| {
            let prev = cnt.get();
            cnt.set(prev + 1);
            let value = cnt.get();
            async move { Ok::<_, Error>(Response::new(Body::from(format!("Request #{}", value)))) }
        });

        tokio::task::spawn_local(async move {
            if let Err(err) = http2::Builder::new(LocalExec)
                .serve_connection(io, service)
                .await
            {
                let mut stdout = io::stdout();
                stdout
                    .write_all(format!("Error serving connection: {:?}\n", err).as_bytes())
                    .await
                    .unwrap();
                stdout.flush().await.unwrap();
            }
        });
    }
}

pub async fn http2_client(url: hyper::Uri) -> Result<(), Box<dyn std::error::Error>> {
    let host = url.host().expect("uri has no host");
    let port = url.port_u16().unwrap_or(80);
    let addr = format!("{}:{}", host, port);
    let stream = TcpStream::connect(addr).await?;

    let stream = IOTypeNotSend::new(TokioIo::new(stream));

    let (mut sender, conn) = hyper::client::conn::http2::handshake(LocalExec, stream).await?;

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

// NOTE: This part is only needed for HTTP/2. HTTP/1 doesn't need an executor.
//
// Since the Server needs to spawn some background tasks, we needed
// to configure an Executor that can spawn !Send futures...
#[derive(Clone, Copy, Debug)]
struct LocalExec;

impl<F> hyper::rt::Executor<F> for LocalExec
where
    F: std::future::Future + 'static, // not requiring `Send`
{
    fn execute(&self, fut: F) {
        // This will spawn into the currently running `LocalSet`.
        tokio::task::spawn_local(fut);
    }
}
