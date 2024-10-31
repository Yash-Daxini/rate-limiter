import { BurstRateLimiter } from "../entity/BurstRateLimiter";
import { NonBurstRateLimiter } from "../entity/NonBurstRateLimiter";
import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";
import { BurstRateLimiterService } from "./BurstRateLimiterService";
import { NonBurstRateLimiterService } from "./NonBurstRateLimiterService";
import priorityConfig from '../config/priorityConfig.json'
import { RateLimitLevel } from "../enums/RateLimitLevel";

export const RateLimiterService = async (config: RateLimiterConfig, key: string | undefined): Promise<boolean> => {
    if (!key)
        return false;

    config = setPriorityConfig(config, key);

    if (config.rateLimitStrategy === RateLimitStrategy.BurstRateLimiter)
        return await handleBurstRateLimiter(config, key);
    else if (config.rateLimitStrategy === RateLimitStrategy.NonBurstRateLimiter)
        return await handleNonBurstRateLimiter(config, key);
    else
        return false;
}

const handleNonBurstRateLimiter = async (config: RateLimiterConfig, key: string): Promise<boolean> => {
    const nonBurstRateLimiter = new NonBurstRateLimiter(config.maxRequestsPerSecond, config.rateLimitLevel);

    const redisKey = `rate_limit_nonBurst:${key}`;

    return await new NonBurstRateLimiterService().canAcceptRequest(nonBurstRateLimiter, redisKey);

}

const handleBurstRateLimiter = async (config: RateLimiterConfig, key: string): Promise<boolean> => {
    const burstRateLimiter = new BurstRateLimiter(config.maxRequestsPerSecond, config.rateLimitLevel, config?.burstCapacity as number, config?.burstCapacityExpiryInSeconds as number);

    const redisKey = `rate_limit_burst:${key}`;

    return await new BurstRateLimiterService().canAcceptRequest(burstRateLimiter, redisKey);
};

const setPriorityConfig = (config: RateLimiterConfig, key: string): RateLimiterConfig => {
    let specificPriorityConfig = getPriorityConfig(config, key);

    if (specificPriorityConfig) {
        return new RateLimiterConfig(specificPriorityConfig.maxRequestsPerSecond, config.rateLimitStrategy, config.rateLimitLevel, specificPriorityConfig.burstCapacity, config.burstCapacityExpiryInSeconds as number);
    }

    return config;
}

const getPriorityConfig = (config: RateLimiterConfig, key: string): any => {
    let specificPriorityConfig;
    if (config.rateLimitLevel === RateLimitLevel.User) {
        specificPriorityConfig = priorityConfig.User.filter(user => user.user === key)[0];
    }
    else if (config.rateLimitLevel === RateLimitLevel.IP) {
        specificPriorityConfig = priorityConfig.IP.filter(ip => ip.ip === key)[0];
    }
    else if (config.rateLimitLevel === RateLimitLevel.Service) {
        specificPriorityConfig = priorityConfig.Service.filter(service => service.service === key)[0];
    }

    return specificPriorityConfig;
}