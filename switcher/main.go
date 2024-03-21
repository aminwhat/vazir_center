package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"switcher/src/cache"
	env "switcher/src/env"

	"github.com/gorilla/websocket"
)

func init() {
	env.Init()
	cache.Init()
}

func proxyHandler(w http.ResponseWriter, r *http.Request) {

	// Replace "localhost:3000" with your actual Socket.IO server address
	target := "ws://localhost:3779/nokteh.v0"

	// Upgrade connection to websocket
	upgrader := &websocket.Upgrader{Subprotocols: r.Header["Sec-Websocket-Protocol"]}
	conn, err := upgrader.Upgrade(w, r, http.Header{"Sec-Websocket-Protocol": r.Header["Sec-Websocket-Protocol"]})
	if err != nil {
		fmt.Println("Upgrade:", err)
		return
	}

	// Create a new websocket connection to the target server
	targetConn, _, err := websocket.DefaultDialer.Dial(target, r.Header)
	if err != nil {
		fmt.Println("Dial:", err)
		conn.Close()
		return
	}

	// Proxy messages between client and target server
	go func() {
		defer conn.Close()
		defer targetConn.Close()
		for {
			messageType, message, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("Read:", err)
				break
			}
			err = targetConn.WriteMessage(messageType, message)
			if err != nil {
				fmt.Println("Write:", err)
				break
			}
		}
	}()

	go func() {
		defer conn.Close()
		defer targetConn.Close()
		for {
			messageType, message, err := targetConn.ReadMessage()
			if err != nil {
				fmt.Println("Read:", err)
				break
			}
			err = conn.WriteMessage(messageType, message)
			if err != nil {
				fmt.Println("Write:", err)
				break
			}
		}
	}()
}

func main() {
	remote, err := url.Parse("https://google.com")
	if err != nil {
		panic(err)
	}

	handler := func(p *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			log.Println(r.URL)
			r.Host = remote.Host
			w.Header().Set("X-Ben", "Rad")
			p.ServeHTTP(w, r)
		}
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	http.HandleFunc("/", handler(proxy))
	http.HandleFunc("/ws", proxyHandler)
	fmt.Println("\nServer listening on port :" + env.GetHttp1Port())
	err = http.ListenAndServe(":"+env.GetHttp1Port(), nil)
	if err != nil {
		panic(err)
	}
}
