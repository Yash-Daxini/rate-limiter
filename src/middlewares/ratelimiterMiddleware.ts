import { RateLimiterConfig } from "../entity/RatelimiterConfig";
import { RateLimitLevel } from "../enums/RateLimitLevel";
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from "../services/RateLimiterService";
import { HEADER_IP_ADDRESS, HEADER_SERVICE_NAME, HEADER_USER_ID } from "../constants/HeaderConstants";
import { defaultIPLevelConfig, defaultServcieLevelConfig, defaultUserLevelConfig } from "../config/globalConfig";

export const rateLimiterMiddleware = (config?: RateLimiterConfig | null): any => {
    return async (req: Request, res: Response, next: NextFunction) => {

        if (config === undefined) {
            config = getDefaultConfiguration(req);
        }

        if (config === null)
            return false;

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

const getDefaultConfiguration = (req: Request): RateLimiterConfig | null => {
    if (req.headers[HEADER_USER_ID])
        return defaultUserLevelConfig;
    else if (req.headers[HEADER_IP_ADDRESS])
        return defaultIPLevelConfig
    else if (req.headers[HEADER_SERVICE_NAME])
        return defaultServcieLevelConfig;
    else
        return null;

}
