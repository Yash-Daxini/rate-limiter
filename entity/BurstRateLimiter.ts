import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimiter } from "./RateLimiter";

class BurstRateLimiter extends RateLimiter {
    burstCapacity: Number;
    constructor(maxRequestPerSecond: Number, expirySeconds: Number, level: RateLimitLevel, burstCapacity: Number) {
        super(maxRequestPerSecond, expirySeconds, level);
        this.burstCapacity = burstCapacity;
    }
}