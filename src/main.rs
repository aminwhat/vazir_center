use crate::config::init::{before_server_init, router_init, socket_init};
use socketioxide::{SocketIo, TransportType};

mod config;
mod db;
mod hessab;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    before_server_init().await;

    println!("Starting server");

    let (layer, io) = SocketIo::builder()
        .transports([TransportType::Websocket])
        .build_layer();

    socket_init(&io);

    let app = router_init(layer);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3779").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
