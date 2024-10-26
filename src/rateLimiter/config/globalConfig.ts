import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimitStrategy } from "../enums/RateLimitStrategy";

export const defaultUserLevelConfig: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User);

export const defaultIPLevelConfig: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.IP);

export const defaultServcieLevelConfig: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.Service);