import { RateLimitLevel } from "../enums/RateLimitLevel";

export abstract class RateLimiter {
    maxRequestPerSecond: Number;
    expirySeconds: Number;
    level: RateLimitLevel;
    constructor(maxRequestPerSecond: Number, expirySeconds: Number, level: RateLimitLevel) {
        this.maxRequestPerSecond = maxRequestPerSecond;
        this.expirySeconds = expirySeconds;
        this.level = level;
    }

    isUserLevel = () => this.level == RateLimitLevel.User;
    isIPLevel = () => this.level == RateLimitLevel.IP;
    isServiceLevel = () => this.level == RateLimitLevel.Service;
}