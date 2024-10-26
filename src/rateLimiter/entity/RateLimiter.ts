import { RateLimitLevel } from "../enums/RateLimitLevel";

export abstract class RateLimiter {
    maxRequestPerSecond: number;
    rateLimitLevel: RateLimitLevel;
    constructor(maxRequestPerSecond: number, rateLimitLevel: RateLimitLevel) {
        this.maxRequestPerSecond = maxRequestPerSecond;
        this.rateLimitLevel = rateLimitLevel;
    }
    public abstract isRequestAvailable(acceptedRequestCount: number): boolean;
}