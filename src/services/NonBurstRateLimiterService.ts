import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import RedisClient from "./RedisService";

let redis = RedisClient.getInstance();

export class NonBurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(nonBurstRateLimiter: NonBurstRateLimiter, key: string): Promise<boolean> {

        const currentTime = Date.now();

        const windowStartTime = currentTime - 1000;

        await redis.zremrangebyscore(key, 0, windowStartTime);

        const requestCount = await redis.zcard(key);

        const canAcceptRequest: boolean = nonBurstRateLimiter.isRequestAvailable(requestCount);

        if (canAcceptRequest)
            await redis.zadd(key, currentTime, currentTime);

        return canAcceptRequest;

    }
}