import * as dotenv from "dotenv";
import Redis from 'ioredis';
dotenv.config({ path: __dirname + '/.env' });

export default class RedisClient {
    private static instance: Redis | null = null;

    private constructor() { }

    public static getInstance(): Redis {
        if (!this.instance) {
            this.instance = new Redis({
                // host: 'localhost',
                // port: 6379
            });

            this.instance.on("error", (err) => {
                console.error("Redis error: ", err);
            });
        }
        return this.instance;
    }
}
