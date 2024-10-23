import express, { Application } from 'express';
import { rateLimiterMiddleware } from './src/middlewares/ratelimiterMiddleware';
import { RateLimiterConfig } from './src/entity/RatelimiterConfig';
import { RateLimitStrategy } from './src/enums/RateLimitStrategy';
import { RateLimitLevel } from './src/enums/RateLimitLevel';

const app: Application = express();

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(20, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.IP, 0);

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(10, 500, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.IP, 60);

app.get("/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ res: "Accepted" });
})

app.get("/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ res: "Accepted" });
})

app.listen({ port: 3000, host: '0.0.0.0' }, () => console.warn("Server is listening on 3000"))