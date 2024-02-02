use crate::core::gateway::Gateway;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};

pub struct GHessab;

impl Gateway for GHessab {
    fn new(io: &SocketIo) {
        io.ns("/hessab.v0", |s: SocketRef| {
            s.on("event", |s: SocketRef, Data::<String>(data)| {
                s.emit("event", "Hello World!").ok();
            });
        });
    }

    fn handle_connection() {
        todo!()
    }

    fn handle_disconnect() {
        todo!()
    }
}
