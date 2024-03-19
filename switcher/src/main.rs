mod cache;
mod common;
mod core;
mod errors;
mod servers;

use crate::core::env::Env;
use cache::cache::Cache;
use core::asset::Asset;
use servers::{
    http1::{http1_client, http1_server},
    http2::{http2_client, http2_server},
};
use std::thread;

// TODO: Check About hyper, tokio and tower in rust
// todo!("Check About hyper, tokio and tower in rust");

#[tokio::main]
async fn main() {
    //* Init */
    pretty_env_logger::init();
    let env = Env::new();
    Asset::new();
    Cache::new();

    //* http2 */
    let server_http2 = thread::spawn(move || {
        // Configure a runtime for the server that runs everything on the current thread
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("build runtime");

        // Combine it with a `LocalSet,  which means it can spawn !Send futures...
        let local = tokio::task::LocalSet::new();
        local.block_on(&rt, http2_server(env)).unwrap();
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
                http2_client(
                    format!("http://localhost:{}", env.check_http2_port())
                        .parse::<hyper::Uri>()
                        .unwrap(),
                ),
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
        local.block_on(&rt, http1_server(env)).unwrap();
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
                http1_client(
                    format!("http://localhost:{}", env.check_http1_port())
                        .parse::<hyper::Uri>()
                        .unwrap(),
                ),
            )
            .unwrap();
    });

    server_http2.join().unwrap();
    client_http2.join().unwrap();

    server_http1.join().unwrap();
    client_http1.join().unwrap();
}
