FROM rust:1.76

WORKDIR /usr/src/switcher
COPY . .

RUN cargo install --path .

RUN mv .env.production .env

LABEL org.opencontainers.image.source = "https://github.com/aminwhat/vazir_switcher"

CMD ["switcher"]