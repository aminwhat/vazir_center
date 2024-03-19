FROM rust:1.67

WORKDIR /usr/src/switcher
COPY . .

RUN cargo install --path .

CMD ["switcher"]