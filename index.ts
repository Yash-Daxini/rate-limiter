import express, { Application } from 'express';
import { rateLimiterMiddleware } from './src/rateLimiter/middlewares/ratelimiterMiddleware';
import { RateLimiterConfig } from './src/rateLimiter/entity/RatelimiterConfig';
import { RateLimitStrategy } from './src/rateLimiter/enums/RateLimitStrategy';
import { RateLimitLevel } from './src/rateLimiter/enums/RateLimitLevel';

const app: Application = express();

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(10, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.IP, 0);

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(10, 100, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.IP, 60);

app.get("/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ res: "Accepted" });
})

app.get("/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ res: "Accepted" });
})

app.listen({ port: 3000, host: '0.0.0.0' }, () => console.warn("Server is listening on 3000"))