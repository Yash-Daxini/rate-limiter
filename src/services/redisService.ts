import * as dotenv from "dotenv";
import Redis from 'ioredis';
dotenv.config({ path: __dirname + '/.env' });

export default class RedisClient {
    private static instance: Redis | null = null;

    private constructor() { }

    private static getInstance(): Redis {
        if (!this.instance) {
            this.instance = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            });

            this.instance.on("error", (err) => {
                console.error("Redis error: ", err);
            });
        }
        return this.instance;
    }

    public static async connect(): Promise<void> {
        const redis = this.getInstance();
        await redis.connect();
    }

    public static async get(key: string): Promise<string | null> {
        const redis = this.getInstance();
        return await redis.get(key);
    }

    public static async increment(key: string): Promise<void> {
        const redis = this.getInstance();
        await redis.incr(key);
    }

    public static async set(key: string, value: number | string, expirationInSeconds?: number): Promise<void> {
        const redis = this.getInstance();
        if (expirationInSeconds) {
            await redis.set(key, value, 'EX', expirationInSeconds);
        } else {
            await redis.set(key, value);
        }
    }

    public static async delete(key: string): Promise<void> {
        const redis = this.getInstance();
        await redis.del(key);
    }

    public static async exists(key: string): Promise<boolean> {
        const redis = this.getInstance();
        const result = await redis.exists(key);
        return result === 1;
    }

    public static async disconnect(): Promise<void> {
        const redis = this.getInstance();
        if (redis) {
            await redis.quit();
            redis.disconnect();
            this.instance = null;
        }
    }
}
