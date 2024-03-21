package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"switcher/src/cache"
	env "switcher/src/env"
)

func init() {
	env.Init()
	cache.Init()
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
	fmt.Println("\nServer listening on port :" + env.GetHttp1Port())
	err = http.ListenAndServe(":"+env.GetHttp1Port(), nil)
	if err != nil {
		panic(err)
	}
}
