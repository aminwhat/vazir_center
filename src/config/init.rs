use crate::db;
use crate::hessab;
use axum::{routing::get, Router};
use bson::Document;
use dotenv::dotenv;
use mongodb::options::ListCollectionsOptions;
use socketioxide::{layer::SocketIoLayer, SocketIo};

pub async fn before_server_init() {
    dotenv().ok();

    let hessab_db = db::new::new_hessab_db().await.unwrap();
    hessab_db
        .list_collections(Document::default(), ListCollectionsOptions::default())
        .await
        .expect("Unable to Connect to the Database");
}

pub fn socket_init(io: &SocketIo) {
    hessab::gateway::new(io);
}

pub fn router_init(layer: SocketIoLayer) -> Router {
    axum::Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .layer(layer)
}
