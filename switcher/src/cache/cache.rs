use redis::ConnectionLike;

use crate::core::env::Env;

pub struct Cache {
    client: redis::Client,
    conn: redis::Connection,
}

impl Cache {
    pub fn new() -> Self {
        let redis_url = Env::new().check_redis_url();
        let client = redis::Client::open(redis_url).unwrap();
        let conn = client.get_connection().unwrap();
        println!("Cache is Connected: {}", conn.get_db());
        Self { client, conn }
    }
}
