import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimiter } from "./RateLimiter";

export class NonBurstRateLimiter extends RateLimiter {
    constructor(maxRequestPerSecond: number, rateLimitLevel: RateLimitLevel) {
        super(maxRequestPerSecond, rateLimitLevel);
    }
    public isRequestAvailable = (acceptedRequestCount: number): boolean => {
        return acceptedRequestCount < this.maxRequestPerSecond;
    }
}