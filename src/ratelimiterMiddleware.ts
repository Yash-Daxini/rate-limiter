import { RateLimiterConfig } from "./entity/ratelimiterConfig";
import { RateLimitLevel } from "./enums/RateLimitLevel";
import { Request, Response, NextFunction } from 'express';
import { userLevelRateLimiterService } from "./services/userlevelRateLimiterService";
import { HEADER_USER_ID } from "./constants/headerConstants";

export const rateLimiterMiddleware = (config: RateLimiterConfig): any => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let canAcceptRequest: Boolean = false;
        switch (config.rateLimitLevel) {
            case RateLimitLevel.User:
                canAcceptRequest = await userLevelRateLimiterService(config, req.headers[HEADER_USER_ID]?.toString());
                break;
            case RateLimitLevel.IP:
                break;

            case RateLimitLevel.Service:
                break;
        }
        if (!canAcceptRequest)
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });

        next();
    };
}