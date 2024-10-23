import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";
import { BurstRateLimiterService } from "./BurstRateLimiterService";
import { NonBurstRateLimiterService } from "./NonBurstRateLimiterService";

export const RateLimiterService = async (config: RateLimiterConfig, key: string | undefined): Promise<boolean> => {
    if (!key)
        return false;

    if (config.rateLimitStrategy === RateLimitStrategy.BurstRateLimiter)
        return await handleBurstRateLimiter(config, key);
    else if (config.rateLimitStrategy === RateLimitStrategy.NonBurstRateLimiter)
        return await handleNonBurstRateLimiter(config, key);
    else
        return false;
}

const handleNonBurstRateLimiter = async (config: RateLimiterConfig, key: string): Promise<boolean> => {
    const nonBurstRateLimiter = new NonBurstRateLimiter(config.maxRequest, config.rateLimitLevel);

    const redisKey = `rate_limit_nonBurst:${key}`;

    return await new NonBurstRateLimiterService().canAcceptRequest(nonBurstRateLimiter, redisKey);

}

const handleBurstRateLimiter = async (config: RateLimiterConfig, key: string): Promise<boolean> => {
    const burstRateLimiter = new BurstRateLimiter(config.maxRequest, config.rateLimitLevel, config.burstCapacity as number, config.burstCapacityExpiryInSeconds as number);

    const redisKey = `rate_limit_burst:${key}`;

    return await new BurstRateLimiterService().canAcceptRequest(burstRateLimiter, redisKey);
};