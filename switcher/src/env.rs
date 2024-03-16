use dotenvy::dotenv;
use std::env;

pub struct Env;

impl Env {
    pub fn new() -> &'static Self {
        env_init();
        &Self
    }

    pub fn check_port(&self) -> String {
        let mut port = env::var("PORT");
        if port.is_err() {
            println!("PORT Was not found!");
            env::set_var("PORT", "3779");
            port = env::var("PORT");
            println!("PORT is now {}", port.clone().unwrap());
        }

        port.unwrap()
    }
}

fn env_init() {
    dotenv().expect(".env file not found");
}
