use redis::{ConnectionLike, JsonCommands, RedisResult, ToRedisArgs};

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

    pub fn get_user_connection(&mut self, token: String) -> String {
        let user_connection: &String = &self
            .conn
            .json_get(format!("Connection:{}", token), "$")
            .unwrap();

        user_connection.clone()
    }
}
