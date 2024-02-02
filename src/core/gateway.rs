use socketioxide::SocketIo;

pub trait Gateway {
    fn new(io: &SocketIo);

    fn handle_connection();

    fn handle_disconnect();
}
