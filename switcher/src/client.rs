use futures_util::future::FutureExt;
use rust_socketio::{client::ClientBuilder, Payload, RawClient};
use serde_json::json;
use std::time::Duration;

// #[tokio::main]
async fn client() {
    //! was main
    // define a callback which is called when a payload is received
    // this callback gets the payload as well as an instance of the
    // socket to communicate with the server
    let callback = |payload: Payload, socket: RawClient| {
        async move {
            match payload {
                Payload::String(str) => println!("Received: {}", str),
                Payload::Binary(bin_data) => println!("Received bytes: {:#?}", bin_data),
            }
            socket
                .emit("test", json!({"got ack": true}))
                .expect("Server unreachable");
        }
        .boxed()
    };

    // get a socket that is connected to the admin namespace
    let socket = ClientBuilder::new("http://localhost:4200/")
        .namespace("/admin")
        .on("test", move |payload: Payload, client: RawClient| {
            callback(payload, client);
        })
        .on("error", |err, _| {
            async move { eprintln!("Error: {:#?}", err) }.boxed();
        })
        .connect()
        .expect("Connection failed");

    // emit to the "foo" event
    let json_payload = json!({"token": 123});
    socket
        .emit("foo", json_payload)
        .expect("Server unreachable");

    // define a callback, that's executed when the ack got acked
    let ack_callback = |message: Payload, _: RawClient| {
        async move {
            println!("Yehaa! My ack got acked?");
            println!("Ack data: {:#?}", message);
        }
        .boxed();
    };

    let json_payload = json!({"myAckData": 123});
    // emit with an ack
    socket
        .emit_with_ack("test", json_payload, Duration::from_secs(2), ack_callback)
        .expect("Server unreachable");

    socket.disconnect().expect("Disconnect failed");
}
