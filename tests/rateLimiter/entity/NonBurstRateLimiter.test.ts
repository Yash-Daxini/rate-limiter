import { NonBurstRateLimiter } from "../../../src/rateLimiter/entity/NonBurstRateLimiter";
import { RateLimitLevel } from "../../../src/rateLimiter/enums/RateLimitLevel";

const nonBurstRateLimiter: NonBurstRateLimiter = new NonBurstRateLimiter(10, RateLimitLevel.User);

describe('Entity test isRequestAvailable function', () => {
    test('Should return false when already achived max requests per second', () => {
        expect(nonBurstRateLimiter.isRequestAvailable(nonBurstRateLimiter.maxRequestPerSecond)).toBeFalsy();
    })
})

describe('Entity test isRequestAvailable function', () => {
    test('Should return true when not exceeded max request per second', () => {
        expect(nonBurstRateLimiter.isRequestAvailable(9)).toBeTruthy();
    })
})