import { RateLimitLevel } from "../enums/RateLimitLevel"
import { RateLimitStrategy } from "../enums/RateLimitStrategy";

export class RateLimiterConfig {
    maxRequest: number;
    burstCapacity: number | null;
    rateLimitStrategy: RateLimitStrategy
    rateLimitLevel: RateLimitLevel;
    burstCapacityExpiryInSeconds: number | null;
    constructor(maxRequest: number, burstCapacity: number, rateLimitStrategy: RateLimitStrategy, rateLimiterLevel: RateLimitLevel, burstCapacityExpiryInSeconds: number) {
        this.maxRequest = maxRequest;
        this.burstCapacity = burstCapacity;
        this.rateLimitStrategy = rateLimitStrategy
        this.rateLimitLevel = rateLimiterLevel;
        this.burstCapacityExpiryInSeconds = burstCapacityExpiryInSeconds;
    }
}