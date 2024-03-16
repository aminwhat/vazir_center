mod env;

use std::borrow::Borrow;
use std::convert::Infallible;
use std::net::SocketAddr;

use crate::env::Env;
use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use mini_redis::{Connection, Frame};
use tokio::net::{TcpListener, TcpStream};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // TODO: Check About hyper, tokio and tower in rust
    // todo!("Check About hyper, tokio and tower in rust");

    let env = Env::new();
    let ok = async move {
        // We create a TcpListener and bind it to 127.0.0.1:PORT
        let listener = TcpListener::bind(format!("0.0.0.0:{}", &env.check_port())).await?;

        // We start a loop to continuously accept incoming connections
        loop {
            let (stream, _) = listener.accept().await?;
            println!("New connection from {} to ", stream.peer_addr()?);
            // process(stream).await;

            // Use an adapter to access something implementing `tokio::io` traits as if they implement
            // `hyper::rt` IO traits.
            let io = TokioIo::new(stream);

            // Spawn a tokio task to serve multiple connections concurrently
            tokio::task::spawn(async move {
                // Finally, we bind the incoming connection to our `hello` service
                if let Err(err) = http1::Builder::new()
                    // `service_fn` converts our function in a `Service`
                    .serve_connection(io, service_fn(on_404))
                    .await
                {
                    println!("Error serving connection: {:?}", err);
                }
            });
        }

        #[allow(unreachable_code)]
        Ok(())
    };

    println!("Listening on port: {}", &env.check_port());

    ok.await
}

async fn process(stream: TcpStream) {
    // The `Connection` lets us read/write redis **frames** instead of
    // byte streams. The `Connection` type is defined by mini-redis.
    let mut connection = Connection::new(stream);

    if let Some(frame) = connection.read_frame().await.unwrap() {
        println!("GOT: {:?}", frame);

        // Respond with an error
        let response = Frame::Error("unimplemented".to_string());
        connection.write_frame(&response).await.unwrap();
    }
}

async fn on_404(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, World!"))))
}
