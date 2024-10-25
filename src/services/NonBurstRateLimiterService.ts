import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import RedisClient from "./RedisService";

let redis = RedisClient.getInstance();

export class NonBurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(nonBurstRateLimiter: NonBurstRateLimiter, key: string): Promise<boolean> {

        const currentTime = Date.now();

        const windowStartTime = currentTime - 1000;

        const pipeline = redis.pipeline();

        pipeline.zremrangebyscore(key, "-inf", windowStartTime);

        pipeline.zcard(key);

        const results: Array<[Error | null, number]> = await pipeline.exec() as Array<[Error | null, number]>;

        const requestCount: number = results[1][1];

        const canAcceptRequest: boolean = nonBurstRateLimiter.isRequestAvailable(requestCount);

        if (canAcceptRequest) {
            await redis.zadd(key, currentTime, currentTime);
            await redis.expire(key, 1);
        }

        return canAcceptRequest;
    }
}