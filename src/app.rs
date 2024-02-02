use axum::{routing::get, Router};
use socketioxide::{
    extract::{Data, SocketRef},
    layer::SocketIoLayer,
    SocketIo,
};

pub fn socket_init(io: &SocketIo) {
    io.ns("/", |s: SocketRef| {
        s.on("event", |s: SocketRef, Data::<String>(data)| {
            s.emit("event", "Hello World!").ok();
        });
    });
}

pub fn router_init(layer: SocketIoLayer) -> Router {
    axum::Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .layer(layer)
}
