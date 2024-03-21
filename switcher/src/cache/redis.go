package cache

import (
	"context"
	"fmt"
	"switcher/src/env"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

var rdb *redis.Client

func Init() {
	rdb = redis.NewClient(&redis.Options{Addr: env.GetRedisAddr(), Password: "", DB: 0})
	keys, err := rdb.Keys(ctx, "*").Result()
	if err == redis.Nil {
		fmt.Println("redis is empty")
	} else if err != nil {
		panic(err)
	}

	if len(keys) == 0 {
		fmt.Println("redis is empty")
	} else {
		fmt.Println(keys)
	}
}

func exampleClient() {
	err := rdb.Set(ctx, "key", "value", 0).Err()
	if err != nil {
		panic(err)
	}

	val, err := rdb.Get(ctx, "key").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("key", val)

	val2, err := rdb.Get(ctx, "key2").Result()
	if err == redis.Nil {
		fmt.Println("key2 does not exist")
	} else if err != nil {
		panic(err)
	} else {
		fmt.Println("key2", val2)
	}
	// Output: key value
	// key2 does not exist
}
