import express, { Application } from 'express';
import { rateLimiterMiddleware } from './src/ratelimiterMiddleware';
import { RateLimiterConfig } from './src/entity/ratelimiterConfig';
import { RateLimitStrategy } from './src/enums/RateLimitStrategy';
import { RateLimitLevel } from './src/enums/RateLimitLevel';
import { startTokenRefill } from './src/services/userlevelRateLimiterService';

const app: Application = express();

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(20, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User);

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(10, 50, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.User);

// startTokenRefill(rateLimiterConfigForBurst);

app.get("/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ res: "Accepted" });
})

app.get("/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ res: "Accepted" });
})


app.listen(3000, () => console.warn("Server is listening on 3000"))