import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimiter } from "./RateLimiter";

export class BurstRateLimiter extends RateLimiter {
    burstCapacity: number;
    constructor(maxRequestPerSecond: number, level: RateLimitLevel, burstCapacity: number) {
        super(maxRequestPerSecond, level);
        this.burstCapacity = burstCapacity;
    }
}