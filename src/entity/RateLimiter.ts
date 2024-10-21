import { RateLimitLevel } from "../enums/RateLimitLevel";

export abstract class RateLimiter {
    maxRequestPerSecond: number;
    level: RateLimitLevel;
    constructor(maxRequestPerSecond: number, rateLimitLevel: RateLimitLevel) {
        this.maxRequestPerSecond = maxRequestPerSecond;
        this.level = rateLimitLevel;
    }

    public isUserLevel = (): boolean => this.level == RateLimitLevel.User;
    public isIPLevel = (): boolean => this.level == RateLimitLevel.IP;
    public isServiceLevel = (): boolean => this.level == RateLimitLevel.Service;
    public abstract isRequestAvailable(acceptedRequestCount: number): boolean;
}