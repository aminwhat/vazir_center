use mongodb::{Client, Database};

pub async fn new(dbname: &str) -> mongodb::error::Result<Database> {
    // Create a new client and connect to the server
    let client = Client::with_uri_str(
        std::env::var("DB_CONNECTION_STRING").expect("Couldn't find the DB_CONNECTION_STRING"),
    )
    .await?;
    let database = client.database(dbname);
    Ok(database)
}

pub async fn new_hessab_db() -> mongodb::error::Result<Database> {
    new("hessab").await
}
