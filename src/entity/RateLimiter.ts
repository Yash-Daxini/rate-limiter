import { RateLimitLevel } from "../enums/RateLimitLevel";

export abstract class RateLimiter {
    maxRequestPerSecond: number;
    level: RateLimitLevel;
    constructor(maxRequestPerSecond: number, level: RateLimitLevel) {
        this.maxRequestPerSecond = maxRequestPerSecond;
        this.level = level;
    }

    public isUserLevel = (): boolean => this.level == RateLimitLevel.User;
    public isIPLevel = (): boolean => this.level == RateLimitLevel.IP;
    public isServiceLevel = (): boolean => this.level == RateLimitLevel.Service;
    public canAccectRequest = (acceptedRequestCount: number): boolean => {
        return acceptedRequestCount < this.maxRequestPerSecond;
    }
}