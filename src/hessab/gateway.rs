use serde::Deserialize;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};

#[derive(Debug, Deserialize)]
pub struct MyAuthData {
    pub token: String,
    pub version: String,
}

pub fn new(io: &SocketIo) {
    io.ns(
        "/hessab.v0",
        |s: SocketRef, Data(auth): Data<MyAuthData>| {
            if auth.token.is_empty() || auth.version.is_empty() {
                println!("Invalid token, disconnecting");
                s.disconnect().ok();
                return;
            }
            println!("g_hessab connect: {}", s.id);

            s.on("event", |s: SocketRef| {
                s.emit("event", "Hello World!").ok();
            });

            s.on_disconnect(|s: SocketRef| {
                println!("g_hessab disconnect: {}", s.id);
            });
        },
    );
}
