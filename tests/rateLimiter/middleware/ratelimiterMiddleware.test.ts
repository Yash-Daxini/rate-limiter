import express, { Application } from 'express';
import request from 'supertest'
import { rateLimiterMiddleware } from '../../../src/rateLimiter/middlewares/ratelimiterMiddleware';
import { RateLimiterConfig } from '../../../src/rateLimiter/entity/RatelimiterConfig';
import { RateLimitStrategy } from '../../../src/rateLimiter/enums/RateLimitStrategy';
import { RateLimitLevel } from '../../../src/rateLimiter/enums/RateLimitLevel';

const appWithDefaultConfig: Application = express();
const appWithCustomConfig: Application = express();

const rateLimiterConfig: RateLimiterConfig = new RateLimiterConfig(10, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.User);

appWithDefaultConfig.use(rateLimiterMiddleware(undefined));

appWithCustomConfig.use(rateLimiterMiddleware(rateLimiterConfig));

appWithDefaultConfig.get("/", (req, res) => {
    res.send({ message: "Accepted" });
});

appWithCustomConfig.get("/", (req, res) => {
    res.send({ message: "Accepted" });
});

describe('Middleware test rateLimiterMiddleware with default config', () => {
    test('reqeust should accepted', async () => {
        const response = await request(appWithDefaultConfig).get('/').set('x-user-id', 'fdsfasd');
        expect(response.status).toBe(200);
    })
})

describe('Middleware test rateLimiterMiddleware with default config', () => {
    test('reqeust should rejected', async () => {
        const response = await request(appWithDefaultConfig).get('/');
        expect(response.status).toBe(429);
    })
})

describe('Middleware test rateLimiterMiddleware with custom config', () => {
    test('reqeust should rejected', async () => {
        const response = await request(appWithCustomConfig).get('/');
        expect(response.status).toBe(429);
    })
})
