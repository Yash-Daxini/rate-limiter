import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import { RateLimiterConfig } from "../entity/ratelimiterConfig";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";
import RedisClient from "./redisService";

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


    if (! await RedisClient.exists(key)) {
        await RedisClient.set(key, 1, 1);
        return true;
    }

    const acceptedRequestCount = new Number(await RedisClient.get(key));

    const canAcceptRequest = nonBurstRateLimiter.canAccectRequest(acceptedRequestCount as number);
    await RedisClient.increment(key);
    return canAcceptRequest;
}

const handleBurstRateLimiter = async (config: RateLimiterConfig, userId: string): Promise<boolean> => {
    const burstRateLimiter = new BurstRateLimiter(config.maxRequest, config.rateLimitLevel, config.burstCapacity as number);

    const currentSecond = Math.floor(Date.now() / 1000);
    const key = `rate_limit:${userId}:${currentSecond}`;

    if (! await RedisClient.exists(key)) {
        await RedisClient.set(key, burstRateLimiter.maxRequestPerSecond-1);
        return true;
    }

    setInterval(async () => {
        await RedisClient.incrementBy(key, burstRateLimiter.maxRequestPerSecond);
    }, 1000);

    const acceptedRequestCount = new Number(await RedisClient.get(key));

    const canAcceptRequest = burstRateLimiter.canAccectRequest(acceptedRequestCount as number);
    await RedisClient.decrement(key);
    return canAcceptRequest;
}