import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";
import { BurstRateLimiterService } from "./BurstRateLimiterService";
import { NonBurstRateLimiterService } from "./NonBurstRateLimiterService";

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

    return await new NonBurstRateLimiterService().canAcceptRequest(nonBurstRateLimiter, key);

}

const handleBurstRateLimiter = async (config: RateLimiterConfig, userId: string): Promise<boolean> => {
    const burstRateLimiter = new BurstRateLimiter(config.maxRequest, config.rateLimitLevel, config.burstCapacity as number);

    const key = `rate_limit_burst:${userId}`;

    return await new BurstRateLimiterService().canAcceptRequest(burstRateLimiter, key);
};