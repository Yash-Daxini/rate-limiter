import { RateLimitLevel } from "../enums/RateLimitLevel"
import { RateLimitStrategy } from "../enums/RateLimitStrategy";

export class RateLimiterConfig {
    maxRequest: number;
    rateLimitStrategy: RateLimitStrategy
    rateLimitLevel: RateLimitLevel;
    burstCapacity?: number | null;
    burstCapacityExpiryInSeconds?: number | null;
    constructor(maxRequest: number, rateLimitStrategy: RateLimitStrategy, rateLimiterLevel: RateLimitLevel, burstCapacity?: number, burstCapacityExpiryInSeconds?: number) {
        this.maxRequest = maxRequest;
        this.burstCapacity = burstCapacity;
        this.rateLimitStrategy = rateLimitStrategy
        this.rateLimitLevel = rateLimiterLevel;
        this.burstCapacityExpiryInSeconds = burstCapacityExpiryInSeconds;
    }
}