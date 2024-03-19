# syntax=docker/dockerfile:1

FROM golang:1.22

# Set destination for COPY
WORKDIR /switcher

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/reference/dockerfile/#copy
COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /vazir_switcher

# Optional:
# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can document in the Dockerfile what ports
# the application is going to listen on by default.
# https://docs.docker.com/reference/dockerfile/#expose
EXPOSE 8080


LABEL org.opencontainers.image.source = "https://github.com/aminwhat/vazir_switcher"

RUN mv .env.production .env

# Run
CMD ["/vazir_switcher"]