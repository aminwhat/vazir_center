use include_assets::{include_dir, NamedArchive};

pub struct Asset {
    archive: NamedArchive,
}

impl Asset {
    pub fn new() -> Self {
        let archive = NamedArchive::load(include_dir!("public"));
        println!("{} assets were included", archive.number_of_assets());
        Self { archive }
    }

    pub fn unknown_error_html(&self) {
        let html = &self.archive.get("unkown_error.html").unwrap();
    }
}
