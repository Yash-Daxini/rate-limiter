import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import RedisClient from "./RedisService";

let redis = RedisClient.getInstance();

export class NonBurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(nonBurstRateLimiter: NonBurstRateLimiter, key: string): Promise<boolean> {
        if (! await redis.exists(key)) {
            await redis.set(key, 1, 'EX', 1);
            return true;
        }

        const acceptedRequestCount = new Number(await redis.get(key));

        const canAcceptRequest = nonBurstRateLimiter.isRequestAvailable(acceptedRequestCount as number);

        if (canAcceptRequest) {
            await redis.incr(key);
        }

        return canAcceptRequest;
    }
}