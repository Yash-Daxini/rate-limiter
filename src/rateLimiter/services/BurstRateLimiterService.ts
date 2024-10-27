import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import RedisClient from "./RedisService";

let redis = RedisClient.getInstance();

export class BurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(burstRateLimiter: BurstRateLimiter, key: string): Promise<boolean> {
        
        if (!await redis.exists(key)) {
            await redis.set(key, JSON.stringify({
                burstCapacity: burstRateLimiter.maxRequestsPerSecond - 1,
                lastRequestTimeStamp: Date.now()
            }), 'EX', burstRateLimiter.burstCapacityExpiryInSeconds);
            return true;
        }

        let value = JSON.parse(await redis.get(key) as string);

        let currentBurstCapacity: number = new Number(value.burstCapacity) as number;

        currentBurstCapacity += Math.floor((Date.now() - value.lastRequestTimeStamp) / 1000) * burstRateLimiter.maxRequestsPerSecond;

        currentBurstCapacity = Math.min(currentBurstCapacity, burstRateLimiter.burstCapacity);

        const canAcceptRequest = burstRateLimiter.isRequestAvailable(currentBurstCapacity);

        if (canAcceptRequest) {
            await redis.set(key, JSON.stringify({
                burstCapacity: currentBurstCapacity - 1,
                lastRequestTimeStamp: Date.now()
            }), 'EX', burstRateLimiter.burstCapacityExpiryInSeconds);
        }

        return canAcceptRequest;
    }
}