use crate::app::{router_init, socket_init};
use dotenv::dotenv;
use socketioxide::{SocketIo, TransportType};

mod app;
mod core;
mod g_hessab;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

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
