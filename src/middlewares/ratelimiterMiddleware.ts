import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitLevel } from "../enums/RateLimitLevel";
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from "../services/RateLimiterService";
import { HEADER_IP_ADDRESS, HEADER_SERVICE_NAME, HEADER_USER_ID } from "../constants/HeaderConstants";

export const rateLimiterMiddleware = (config: RateLimiterConfig): any => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let canAcceptRequest: Boolean = false;

        switch (config.rateLimitLevel) {
            case RateLimitLevel.User:
                canAcceptRequest = await RateLimiterService(config, req.headers[HEADER_USER_ID]?.toString());
                break;
            case RateLimitLevel.IP:
                const ip = req.headers[HEADER_IP_ADDRESS] || req.socket.remoteAddress;
                canAcceptRequest = await RateLimiterService(config, ip?.toLocaleString());
                break;

            case RateLimitLevel.Service:
                const serviceName = req.headers[HEADER_SERVICE_NAME];
                canAcceptRequest = await RateLimiterService(config, serviceName?.toLocaleString());
                break;
        }
        if (!canAcceptRequest)
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });

        next();
    };
}