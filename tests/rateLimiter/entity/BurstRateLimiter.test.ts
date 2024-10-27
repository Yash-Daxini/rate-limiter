import { BurstRateLimiter } from '../../../src/rateLimiter/entity/BurstRateLimiter';
import { RateLimitLevel } from '../../../src/rateLimiter/enums/RateLimitLevel';

const burstRateLimiter: BurstRateLimiter = new BurstRateLimiter(10, RateLimitLevel.User, 100, 60);

describe('Entity test isRequestAvailable function', () => {
    test('Should return false when no requests available in burst capacity', () => {
        expect(burstRateLimiter.isRequestAvailable(0)).toBeFalsy();
    })
})

describe('Entity test isRequestAvailable function', () => {
    test('Should return true when requests available in burst capacity', () => {
        expect(burstRateLimiter.isRequestAvailable(1)).toBeTruthy();
    })
})