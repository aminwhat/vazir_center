use crate::g_hessab;
use axum::{routing::get, Router};
use dotenv::dotenv;
use socketioxide::{layer::SocketIoLayer, SocketIo};

pub fn before_server_init() {
    dotenv().ok();
}

pub fn socket_init(io: &SocketIo) {
    g_hessab::gateway::new(io);
}

pub fn router_init(layer: SocketIoLayer) -> Router {
    axum::Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .layer(layer)
}
