import { IRateLimiterService } from "../contracts/IRateLimiterService";
import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import RedisClient from "./RedisService";

export class BurstRateLimiterService implements IRateLimiterService {
    async canAcceptRequest(burstRateLimiter: BurstRateLimiter, key: string): Promise<boolean> {
        if (!await RedisClient.exists(key)) {
            await RedisClient.set(key, JSON.stringify({
                burstCapacity: burstRateLimiter.maxRequestPerSecond - 1,
                lastRequestTimeStamp: Date.now()
            }));
            return true;
        }

        let value = JSON.parse(await RedisClient.get(key) as string);

        let currentBurstCapacity: number = new Number(value.burstCapacity) as number;

        currentBurstCapacity += Math.floor((Date.now() - value.lastRequestTimeStamp) / 1000) * burstRateLimiter.maxRequestPerSecond;

        currentBurstCapacity = Math.min(currentBurstCapacity, burstRateLimiter.burstCapacity);

        const canAcceptRequest = burstRateLimiter.isRequestAvailable(currentBurstCapacity);

        if (canAcceptRequest) {
            await RedisClient.set(key, JSON.stringify({
                burstCapacity: currentBurstCapacity - 1,
                lastRequestTimeStamp: Date.now()
            }));
        }

        return canAcceptRequest;
    }
}