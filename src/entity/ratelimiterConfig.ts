import { RateLimitLevel } from "../enums/RateLimitLevel"
import { RateLimitStrategy } from "../enums/RateLimitStrategy";

export class RateLimiterConfig {
    maxRequest: number;
    burstCapacity: number | null;
    rateLimitStrategy: RateLimitStrategy
    rateLimitLevel: RateLimitLevel;
    constructor(maxRequest: number, burstCapacity: number, rateLimitStrategy: RateLimitStrategy, rateLimiterLevel: RateLimitLevel) {
        this.maxRequest = maxRequest;
        this.burstCapacity = burstCapacity;
        this.rateLimitStrategy = rateLimitStrategy
        this.rateLimitLevel = rateLimiterLevel;
    }
}