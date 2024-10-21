import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimiter } from "./RateLimiter";

export class NonBurstRateLimiter extends RateLimiter {
    constructor(maxRequestPerSecond: number, level: RateLimitLevel) {
        super(maxRequestPerSecond, level);
    }
    public isRequestAvailable = (acceptedRequestCount: number): boolean => {
        return acceptedRequestCount < this.maxRequestPerSecond;
    }
}