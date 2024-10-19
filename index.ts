import express, { Application } from 'express';
import { rateLimiterMiddleware } from './src/ratelimiterMiddleware';
import { RateLimiterConfig } from './src/entity/ratelimiterConfig';
import { RateLimitStrategy } from './src/enums/RateLimitStrategy';
import { RateLimitLevel } from './src/enums/RateLimitLevel';
import { startTokenRefill } from './src/services/userlevelRateLimiterService';

const app: Application = express();

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(10, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User);

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(2, 5, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.User);

// app.use(rateLimiterMiddleware(rateLimiterConfigForBurst));

app.get("/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send("Hey");
})

app.get("/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send("Hey");
})

startTokenRefill(rateLimiterConfigForBurst);

app.listen(3000, () => console.warn("Server is listening on 3000"))