import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import RedisClient from "./RedisService";

export class NonBurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(nonBurstRateLimiter: NonBurstRateLimiter, key: string): Promise<boolean> {
        if (! await RedisClient.exists(key)) {
            await RedisClient.set(key, 1, 1);
            return true;
        }

        const acceptedRequestCount = new Number(await RedisClient.get(key));

        const canAcceptRequest = nonBurstRateLimiter.isRequestAvailable(acceptedRequestCount as number);

        if (canAcceptRequest) {
            await RedisClient.increment(key);
        }

        return canAcceptRequest;
    }
}