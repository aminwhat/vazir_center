use std::str::from_utf8;

use crate::{common::body::Body, core::asset::Asset};
use hyper::Response;

pub fn unkown_exception() -> Result<Response<Body>, ()> {
    let binding = Asset::new();
    let html = binding.unknown_error_html();
    let mut response = Response::builder()
        .status(520)
        .body(Body::from(String::from(from_utf8(html).unwrap())))
        .unwrap();

    response.headers_mut().insert(
        hyper::header::CONTENT_TYPE,
        hyper::header::HeaderValue::from_static("text/html; charset=utf-8"),
    );

    Ok(response)
}
