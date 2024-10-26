import express, { Application } from 'express';
import { RateLimiterConfig } from '../../rateLimiter/entity/RatelimiterConfig';
import { RateLimitStrategy } from '../../rateLimiter/enums/RateLimitStrategy';
import { RateLimitLevel } from '../../rateLimiter/enums/RateLimitLevel';
import { rateLimiterMiddleware } from '../../rateLimiter/middlewares/ratelimiterMiddleware';

const app: Application = express();
const port: Number = 3000;

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User); //config

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.User, 100, 60); //config

app.get("/api/service1/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.get("/api/service1/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})  