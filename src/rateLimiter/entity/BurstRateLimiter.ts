import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimiter } from "./RateLimiter";

export class BurstRateLimiter extends RateLimiter {
    burstCapacity: number;
    burstCapacityExpiryInSeconds: number;
    constructor(maxRequestPerSecond: number, rateLimitLevel: RateLimitLevel, burstCapacity: number, burstCapacityExpiryInSeconds: number) {
        super(maxRequestPerSecond, rateLimitLevel);
        this.burstCapacity = burstCapacity;
        this.burstCapacityExpiryInSeconds = burstCapacityExpiryInSeconds;
    }
    public isRequestAvailable = (currentBurstCapacity: number): boolean => {
        return currentBurstCapacity > 0;
    }
}