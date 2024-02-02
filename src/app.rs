use axum::{routing::get, Router};
use socketioxide::{
    extract::{Data, SocketRef},
    layer::SocketIoLayer,
    SocketIo,
};

use crate::{core::gateway::Gateway, g_hessab::gateway::GHessab};

pub fn socket_init(io: &SocketIo) {
    io.ns("/", |s: SocketRef| {
        s.on("event", |s: SocketRef, Data::<String>(data)| {
            s.emit("event", "Hello World!").ok();
        });
    });

    GHessab::new(io);
}

pub fn router_init(layer: SocketIoLayer) -> Router {
    axum::Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .layer(layer)
}
