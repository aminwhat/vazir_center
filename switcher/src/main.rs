mod env;

use crate::env::Env;
use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use pretty_env_logger;
use std::convert::Infallible;
use std::net::SocketAddr;
use tokio::net::{TcpListener, TcpStream};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // TODO: Check About hyper, tokio and tower in rust
    // todo!("Check About hyper, tokio and tower in rust");

    pretty_env_logger::init();

    let env = Env::new();

    let ok = async move {
        // We create a TcpListener and bind it to 127.0.0.1:PORT
        let listener = TcpListener::bind(format!("0.0.0.0:{}", &env.check_port())).await?;

        // We start a loop to continuously accept incoming connections
        loop {
            let (stream, _) = listener.accept().await?;
            // process(stream).await;
            println!("New connection from {} to", stream.peer_addr().unwrap(),);

            // Use an adapter to access something implementing `tokio::io` traits as if they implement
            // `hyper::rt` IO traits.
            let io = TokioIo::new(stream);

            let out_addr: SocketAddr = ([127, 0, 0, 1], 3779).into();

            // This is the `Service` that will handle the connection.
            // `service_fn` is a helper to convert a function that
            // returns a Response into a `Service`.
            let service = service_fn(move |mut req| {
                let uri_string = format!(
                    "http://{}{}",
                    out_addr,
                    req.uri()
                        .path_and_query()
                        .map(|x| x.as_str())
                        .unwrap_or("/")
                );

                let uri = uri_string.parse().unwrap();
                *req.uri_mut() = uri;

                let host = req.uri().host().expect("uri has no host");
                let port = req.uri().port_u16().unwrap_or(80);
                let addr = format!("{}:{}", host, port);

                async move {
                    let client_stream = TcpStream::connect(addr).await.unwrap();
                    let io = TokioIo::new(client_stream);

                    let (mut sender, conn) = hyper::client::conn::http1::handshake(io).await?;
                    tokio::task::spawn(async move {
                        if let Err(err) = conn.await {
                            println!("Connection failed: {:?}", err);
                        }
                    });

                    sender.send_request(req).await
                }
            });

            tokio::task::spawn(async move {
                if let Err(err) = http1::Builder::new().serve_connection(io, service).await {
                    println!("Failed to serve the connection: {:?}", err);
                }
            });
        }

        #[allow(unreachable_code)]
        Ok(())
    };

    println!("Listening on port: {}", &env.check_port());

    ok.await
}

async fn on_404(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, World!"))))
}
