import RedisClient from "./src/rateLimiter/services/RedisService";

let redis = RedisClient.getInstance();
redis.set("testKey", 0, 'EX', 10);

const luascript = `
                    local key = KEYS[1]
                    redis.call("INCR",key)
                    return redis.call("GET",key)
`

setTimeout(async () => {
    // operationWithoutLua(1);
    // operationWithLua(1);
    let res = await fetch("http://localhost:3000/api/service1/burst", {
        headers: {
            "x-user-id": "dd"
        }
    });
    console.warn("First :- " + res.status);
}, 1000);

setTimeout(async () => {
    // operationWithoutLua(2);
    // operationWithLua(2);
    let res = await fetch("http://localhost:3000/api/service1/burst", {
        headers: {
            "x-user-id": "dd"
        }
    });
    console.warn("Second :- " + res.status);
}, 1000);

let operationWithoutLua = async (operationCount: number) => {
    console.warn(`Get operation before ${operationCount} :- ` + await redis.get("testKey"));
    await redis.incr("testKey");
    console.warn(`Get operation after ${operationCount} :- ` + await redis.get("testKey"));
}

let operationWithLua = async (operationCount: number) => {
    let r = await redis.eval(luascript, 1, "testKey");
    console.warn(`Get Operation ${operationCount} ` + r);
}