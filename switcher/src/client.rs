use futures_util::future::FutureExt;
use rust_socketio::{
    client::{Client, ClientBuilder},
    Event, Payload, RawClient,
};
use std::time::Duration;

pub struct ClientSwitcher<T, F, E, D>
where
    T: Into<String>,
    F: FnMut(Payload, RawClient) + 'static + Send,
    E: Into<Event>,
    D: Into<Payload>,
{
    socket: Client,
    _t: std::marker::PhantomData<T>,
    _f: std::marker::PhantomData<F>,
    _e: std::marker::PhantomData<E>,
    _d: std::marker::PhantomData<D>,
}

impl<T, F, E, D> ClientSwitcher<T, F, E, D>
where
    T: Into<String>,
    F: FnMut(Payload, RawClient) + 'static + Send,
    E: Into<Event>,
    D: Into<Payload>,
{
    pub fn new(address: T, namespace: T) -> Self {
        // get a socket that is connected to the admin namespace
        let socket = ClientBuilder::new(address)
            .namespace(namespace)
            .on("error", |err, _| {
                async move { eprintln!("Error: {:#?}", err) }.boxed();
            })
            .connect()
            .expect("Connection failed");

        Self {
            socket,
            _t: std::marker::PhantomData,
            _e: std::marker::PhantomData,
            _d: std::marker::PhantomData,
            _f: std::marker::PhantomData,
        }
    }

    pub fn new_with_error(address: T, namespace: T, on_error: F) -> Self {
        // get a socket that is connected to the admin namespace
        let socket = ClientBuilder::new(address)
            .namespace(namespace)
            .on("error", on_error)
            .connect()
            .expect("Connection failed");

        Self {
            socket,
            _t: std::marker::PhantomData,
            _e: std::marker::PhantomData,
            _d: std::marker::PhantomData,
            _f: std::marker::PhantomData,
        }
    }

    pub fn emit(&self, event: E, data: D) -> Result<(), ()> {
        &self.socket.emit(event, data).expect("Server unreachable");
        Ok(())
    }

    pub fn emit_with_ack(&self, event: E, data: D, callback: F) -> Result<(), ()> {
        &self
            .socket
            .emit_with_ack(event, data, Duration::from_secs(3), callback)
            .expect("Server unreachable");

        Ok(())
    }

    pub fn disconnect(&self) -> Result<(), ()> {
        &self.socket.disconnect().expect("Disconnect failed");
        Ok(())
    }
}
