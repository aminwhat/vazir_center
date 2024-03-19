use dotenvy::dotenv;
use std::{env, ffi::OsStr};

pub struct Env;

impl Env {
    pub fn new() -> &'static Self {
        dotenv().expect(".env file not found");
        &Self
    }

    pub fn check_http1_port(&self) -> String {
        check_env_var_str("HTTP1_PORT", Some("3001"))
    }

    pub fn check_http2_port(&self) -> String {
        check_env_var_str("HTTP2_PORT", Some("3000"))
    }

    pub fn check_redis_url(&self) -> String {
        check_env_var_str("REDIS_URL", Some("redis://localhost:6379"))
    }
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
