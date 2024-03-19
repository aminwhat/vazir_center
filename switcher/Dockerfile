FROM rust:1.76-alpine

WORKDIR /usr/src/switcher
COPY . .

RUN cargo install --path .

CMD ["switcher"]