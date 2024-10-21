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

    const key = `rate_limit_nonBurst:${userId}`;


    if (! await RedisClient.exists(key)) {
        await RedisClient.set(key, 1, 1);
        return true;
    }

    const acceptedRequestCount = new Number(await RedisClient.get(key));

    const canAcceptRequest = nonBurstRateLimiter.canAccectRequest(acceptedRequestCount as number);

    if (canAcceptRequest) {
        await RedisClient.increment(key);
    }

    return canAcceptRequest;
}

const handleBurstRateLimiter = async (config: RateLimiterConfig, userId: string): Promise<boolean> => {
    const burstRateLimiter = new BurstRateLimiter(config.maxRequest, config.rateLimitLevel, config.burstCapacity as number);

    const key = `rate_limit_burst:${userId}`;

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

    const canAcceptRequest = burstRateLimiter.canAccectRequest(currentBurstCapacity);

    if (canAcceptRequest) {
        await RedisClient.set(key, JSON.stringify({
            burstCapacity: currentBurstCapacity - 1,
            lastRequestTimeStamp: Date.now()
        }));
    }

    return canAcceptRequest;
};

export const startTokenRefill = (config: RateLimiterConfig) => {
    setInterval(async () => {
        const keys = await RedisClient.keys('rate_limit_burst:*');
        for (const key of keys) {
            const burstRateLimiter = new BurstRateLimiter(config.maxRequest, config.rateLimitLevel, config.burstCapacity as number);
            let currentBurst = new Number(await RedisClient.get(key)) as number;

            const newTokens = Math.min(burstRateLimiter.burstCapacity, currentBurst + burstRateLimiter.maxRequestPerSecond);
            await RedisClient.set(key, newTokens);
        }
    }, 1000);
};