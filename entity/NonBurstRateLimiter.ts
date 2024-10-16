import { RateLimitLevel } from "../enums/RateLimitLevel";
import { RateLimiter } from "./RateLimiter";

class NonBurstRateLimiter extends RateLimiter {
    constructor(maxRequestPerSecond: Number, expirySeconds: Number, level: RateLimitLevel) {
        super(maxRequestPerSecond, expirySeconds, level);
    }
}