import { testRequestRateLimit } from "./backendServiceTestUtil";

const apiUrlForNonBurst: string = `http://localhost:3000/api/service1/nonBurst`;
const apiUrlForBurst: string = `http://localhost:3000/api/service1/burst`;
const headers: any = {
    'x-user-id': 'adfdsfsd'
}

describe('non burst strategy test for service1 (User Level testing)', () => {
    test('retruns true when request sent for 1 second', async () => {
        let response: number = await testRequestRateLimit(apiUrlForNonBurst, headers);
        expect(response).toEqual(10);
    })
})

describe('Burst strategy test for service1 (User Level testing)', () => {
    test('retruns true when request sent for 1 second', async () => {
        let response: number = await testRequestRateLimit(apiUrlForBurst, headers);
        expect(response).toEqual(10);
    })
})