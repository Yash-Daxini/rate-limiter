import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export class RedisDataStore {
    private client: RedisClientType;
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });
        this.client.on('error', (err: unknown) => {
            console.error('Redis Client Error', err);
        });
    }

    public async connect(): Promise<void> {
        await this.client.connect();
    }

    public async get(key: string): Promise<string | null> {

        return await this.client.get(key);
    }

    public async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
        if (expirationInSeconds) {
            await this.client.set(key, value, { EX: expirationInSeconds });
        } else {
            await this.client.set(key, value);
        }
    }

    public async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    public async disconnect(): Promise<void> {
        await this.client.disconnect();
    }
}