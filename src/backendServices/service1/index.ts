import express, { Application, Request } from 'express';
import { RateLimiterConfig } from '../../rateLimiter/entity/RatelimiterConfig';
import { RateLimitStrategy } from '../../rateLimiter/enums/RateLimitStrategy';
import { RateLimitLevel } from '../../rateLimiter/enums/RateLimitLevel';
import { rateLimiterMiddleware } from '../../rateLimiter/middlewares/ratelimiterMiddleware';
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const port: Number = 3000;

app.use(cors<Request>());

const rateLimiterConfigForNonBurst: RateLimiterConfig = new RateLimiterConfig(1, RateLimitStrategy.NonBurstRateLimiter, RateLimitLevel.User); //config

const rateLimiterConfigForBurst: RateLimiterConfig = new RateLimiterConfig(1, RateLimitStrategy.BurstRateLimiter, RateLimitLevel.User, 100, 60); //config

app.get("/api/service1/nonBurst", rateLimiterMiddleware(rateLimiterConfigForNonBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.get("/api/service1/burst", rateLimiterMiddleware(rateLimiterConfigForBurst), (req, res) => {
    res.send({ message: "Accepted" });
})

app.get("/api/service1/nonBurst/callservice3", async (req, res) => {
    let service3_domain = process.env.Service3_Domain || "localhost";
    let response = await fetch(`http://${service3_domain}:3002/api/service3/nonBurst`, {
        headers: {
            'x-service-name': 'service1'
        }
    });
    let responseMessage = await response.json();
    res.status(response.status);
    res.send(responseMessage);
})

app.get("/api/service1/burst/callservice3", async (req, res) => {
    let service3_domain = process.env.Service3_Domain || "localhost";
    let response = await fetch(`http://${service3_domain}:3002/api/service3/burst`, {
        headers: {
            'x-service-name': 'service1'
        }
    });
    let responseMessage = await response.json();
    res.status(response.status);
    res.send(responseMessage);
})

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`)
})