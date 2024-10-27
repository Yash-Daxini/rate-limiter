import express, { Application, Request } from 'express';
import { RateLimiterConfig } from '../../rateLimiter/entity/RatelimiterConfig';
import { RateLimitLevel } from '../../rateLimiter/enums/RateLimitLevel';
import { RateLimitStrategy } from '../../rateLimiter/enums/RateLimitStrategy';
import { rateLimiterMiddleware } from '../../rateLimiter/middlewares/ratelimiterMiddleware';
import cors from 'cors';

const app: Application = express();
const port: Number = 3001;

app.use(cors<Request>());

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.IP); //config

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.IP, 100, 60); //config

app.get("/api/service2/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.get("/api/service2/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})
