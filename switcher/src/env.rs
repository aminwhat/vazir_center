use dotenvy::dotenv;
use std::{env, ffi::OsStr};

pub struct Env;

impl Env {
    pub fn new() -> &'static Self {
        env_init();
        &Self
    }

    pub fn check_http1_server_port(&self) -> String {
        check_env_var_str("HTTP1_SERVER_PORT", Some("3001"))
    }

    pub fn check_http1_client_port(&self) -> String {
        check_env_var_str("HTTP1_CLIENT_PORT", Some("80"))
    }

    pub fn check_http2_server_port(&self) -> String {
        check_env_var_str("HTTP2_SERVER_PORT", Some("3000"))
    }

    pub fn check_http2_client_port(&self) -> String {
        check_env_var_str("HTTP2_CLIENT_PORT", Some("80"))
    }

    pub fn check_redis_url(&self) -> String {
        check_env_var_str("REDIS_URL", Some("redis://localhost:6379"))
    }
}

fn env_init() {
    dotenv().expect(".env file not found");
}

fn check_env_var_str<K: AsRef<OsStr> + std::fmt::Display>(key: K, default: Option<&str>) -> String {
    let mut val = env::var(&key);
    if val.is_err() {
        println!("{} Was not found!", &key);
        env::set_var(&key, default.unwrap_or(""));
        val = env::var(&key);
        println!("{} is now {}", &key, val.clone().unwrap());
    }

    val.unwrap()
}
