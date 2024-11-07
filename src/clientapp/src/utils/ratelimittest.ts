import axios from "axios";

let makeRequest = async (apiUrl: string, headers: any) => {
    const instance = axios.create({
        headers: headers
    });
    let res = await instance.get(apiUrl, { validateStatus: () => true });
    return res.status;
}

export let testRequestRateLimit = async (apiUrl: string, headers: any, seconds: number) => {
    let responses = [];

    let startTime = Date.now();

    const REQUESTS_PER_SECOND = 50;
    const INTERVAL_MS = 1000;

    for (let i = 1; i <= seconds; i++) {
        let acceptedRequests = 0;
        let rejectedRequests = 0;
        let startTimeForCurrentSecond = Date.now();

        const requests = Array.from({ length: REQUESTS_PER_SECOND }).map(async () => {
            const statusCode = await makeRequest(apiUrl, headers);
            if (statusCode === 200) acceptedRequests++;
            else if (statusCode === 429) rejectedRequests++;
        });

        await Promise.all(requests);
        await new Promise(resolve => setTimeout(resolve, Math.min(INTERVAL_MS - (Date.now() - startTimeForCurrentSecond), 0)));

        responses.push({
            second: (Date.now() - startTimeForCurrentSecond) / 1000,
            totalRequestsPerSecond: REQUESTS_PER_SECOND,
            acceptedRequests: acceptedRequests,
            rejectedRequests: rejectedRequests
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    let totalTime = (Date.now() - startTime) / 1000;
    return { totalTime, responses };
}