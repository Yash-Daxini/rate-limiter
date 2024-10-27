import { testRequestRateLimit } from "./backendServiceTestUtil";

const apiUrlForNonBurst: string = `http://localhost:3001/api/service2/nonBurst`;
const apiUrlForBurst: string = `http://localhost:3001/api/service2/burst`;
const headers: any = {
    'x-forwarded-for': '192.168.1.1'
}

describe('Non burst strategy test for service2 (IP Level testing)', () => {
    test('retruns true when request sent for 1 second', async () => {
        let response: number = await testRequestRateLimit(apiUrlForNonBurst, headers);
        expect(response).toEqual(10);
    })
})

describe('Burst strategy test for service2 (IP Level testing)', () => {
    test('retruns true when request sent for 1 second', async () => {
        let response: number = await testRequestRateLimit(apiUrlForBurst, headers);
        expect(response).toEqual(10);
    })
})