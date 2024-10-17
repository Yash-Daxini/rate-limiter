import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import { RateLimiterConfig } from "../entity/ratelimiterConfig";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";
import { RedisDataStore } from "./redisService";

const redis = new RedisDataStore();

export const userLevelRateLimiterService = async (config: RateLimiterConfig, userId: string | undefined): Promise<boolean> => {

    if (!userId)
        return false;

    if (config.rateLimitStrategy === RateLimitStrategy.BurstRateLimiter)
        return await handleBurstRateLimiter(config, userId);
    else if (config.rateLimitStrategy === RateLimitStrategy.NonBurstRateLimiter)
        return await handleNonBurstRateLimiter(config, userId);
    else
        return false;
}

const handleNonBurstRateLimiter = async (config: RateLimiterConfig, userId: string): Promise<boolean> => {
    const nonBurstRateLimiter = new NonBurstRateLimiter(config.maxRequest, config.rateLimitLevel);

    const currentSecond = Math.floor(Date.now() / 1000);
    const key = `rate_limit:${userId}:${currentSecond}`;

    redis.connect();

    if (! await redis.exists(key)) {
        await redis.set(key, nonBurstRateLimiter.maxRequestPerSecond, 1);
        return true;
    }

    const acceptedRequestCount = +redis.get(userId);

    const canAcceptRequest = nonBurstRateLimiter.canAccectRequest(acceptedRequestCount);

    await redis.increment(userId);

    await redis.disconnect();

    return canAcceptRequest;

}

const handleBurstRateLimiter = (config: RateLimiterConfig, userId: string): boolean => {
    const burstRateLimiter = new BurstRateLimiter(config.maxRequest, config.rateLimitLevel, config.burstCapacity as number);
    return false;
}