import express, { Application } from 'express';
import { rateLimiterMiddleware } from './src/ratelimiterMiddleware';
import { RateLimiterConfig } from './src/entity/ratelimiterConfig';
import { RateLimitStrategy } from './src/enums/RateLimitStrategy';
import { RateLimitLevel } from './src/enums/RateLimitLevel';

const app: Application = express();

const rateLimiterConfig: RateLimiterConfig = new RateLimiterConfig(10, 0, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User);

app.use(rateLimiterMiddleware(rateLimiterConfig));

app.get("/", (req, res) => {
    res.send("Hey");
})

app.listen(3000, () => console.warn("Server is listening on 3000"))