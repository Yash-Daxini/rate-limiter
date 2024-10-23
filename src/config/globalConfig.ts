import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";

export const defaultUserLevelConfig: RateLimiterConfig = new RateLimiterConfig(10, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User, 0);

export const defaultIPLevelConfig: RateLimiterConfig = new RateLimiterConfig(10, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.IP, 0);

export const defaultServcieLevelConfig: RateLimiterConfig = new RateLimiterConfig(10, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.Service, 0);