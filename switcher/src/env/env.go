package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	} else {
		log.Println("Loaded .env file")
	}
}

func GetHttp1Port() string {
	return os.Getenv("HTTP1_PORT")
}

func GetHttp2Port() string {
	return os.Getenv("HTTP2_PORT")
}

func GetRedisUrl() string {
	return os.Getenv("REDIS_URL")
}

func GetRedisAddr() string {
	url := GetRedisUrl()
	return url[8:]
}
