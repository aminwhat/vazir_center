mod common;
mod env;
mod http1;
mod http2;

use crate::env::Env;
use http1::{http1_client, http1_server};
use http2::{http2_client, http2_server};
use std::thread;

#[tokio::main]
async fn main() {
    // TODO: Check About hyper, tokio and tower in rust
    // todo!("Check About hyper, tokio and tower in rust");

    //* Init */
    pretty_env_logger::init();
    Env::new();

    //* http2 */
    let server_http2 = thread::spawn(move || {
        // Configure a runtime for the server that runs everything on the current thread
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("build runtime");

        // Combine it with a `LocalSet,  which means it can spawn !Send futures...
        let local = tokio::task::LocalSet::new();
        local.block_on(&rt, http2_server()).unwrap();
    });

    let client_http2 = thread::spawn(move || {
        // Configure a runtime for the client that runs everything on the current thread
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("build runtime");

        // Combine it with a `LocalSet,  which means it can spawn !Send futures...
        let local = tokio::task::LocalSet::new();
        local
            .block_on(
                &rt,
                http2_client("http://localhost:3000".parse::<hyper::Uri>().unwrap()),
            )
            .unwrap();
    });

    //* http1 */
    let server_http1 = thread::spawn(move || {
        // Configure a runtime for the server that runs everything on the current thread
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("build runtime");

        // Combine it with a `LocalSet,  which means it can spawn !Send futures...
        let local = tokio::task::LocalSet::new();
        local.block_on(&rt, http1_server()).unwrap();
    });

    let client_http1 = thread::spawn(move || {
        // Configure a runtime for the client that runs everything on the current thread
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("build runtime");

        // Combine it with a `LocalSet,  which means it can spawn !Send futures...
        let local = tokio::task::LocalSet::new();
        local
            .block_on(
                &rt,
                http1_client("http://localhost:3001".parse::<hyper::Uri>().unwrap()),
            )
            .unwrap();
    });

    server_http2.join().unwrap();
    client_http2.join().unwrap();

    server_http1.join().unwrap();
    client_http1.join().unwrap();
}
