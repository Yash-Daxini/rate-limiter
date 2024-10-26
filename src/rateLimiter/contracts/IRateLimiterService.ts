import { RateLimiter } from "../entity/RateLimiter";

export interface IRateLimiterService {
    canAcceptRequest(rateLimiter: RateLimiter, key: string): Promise<boolean>;
}