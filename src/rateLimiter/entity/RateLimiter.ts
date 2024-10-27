import { RateLimitLevel } from "../enums/RateLimitLevel";

export abstract class RateLimiter {
    maxRequestsPerSecond: number;
    rateLimitLevel: RateLimitLevel;
    constructor(maxRequestPerSecond: number, rateLimitLevel: RateLimitLevel) {
        this.maxRequestsPerSecond = maxRequestPerSecond;
        this.rateLimitLevel = rateLimitLevel;
    }
    public abstract isRequestAvailable(acceptedRequestCount: number): boolean;
}