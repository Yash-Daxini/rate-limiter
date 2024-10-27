import express, { Application, Request } from 'express';
import { RateLimiterConfig } from '../../rateLimiter/entity/RatelimiterConfig';
import { RateLimitLevel } from '../../rateLimiter/enums/RateLimitLevel';
import { rateLimiterMiddleware } from '../../rateLimiter/middlewares/ratelimiterMiddleware';
import { RateLimitStrategy } from '../../rateLimiter/enums/RateLimitStrategy';
import cors from 'cors';

const app: Application = express();
const port: Number = 3002;

app.use(cors<Request>());

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.Service); //config

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.Service, 100, 60); //config

app.get("/api/service3/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.get("/api/service3/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})
