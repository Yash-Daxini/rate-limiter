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

    let startTime = performance.now();

    for (let i = 1; i <= seconds; i++) {
        let acceptedRequests = 0;
        let rejectedRequests = 0;
        let totalRequestsPerSecond = 0;
        let startTimeForCurrentSecond = performance.now();

        while (performance.now() - startTimeForCurrentSecond < 1000) {
            const statusCode = await makeRequest(apiUrl, headers);
            if (statusCode === 200) acceptedRequests++;
            else if (statusCode === 429) rejectedRequests++;
            totalRequestsPerSecond++;
        }

        responses.push({
            second: (performance.now() - startTimeForCurrentSecond) / 1000,
            totalRequestsPerSecond: totalRequestsPerSecond,
            acceptedRequests: acceptedRequests,
            rejectedRequests: rejectedRequests
        })
    }

    let totalTime = (performance.now() - startTime) / 1000;
    return { totalTime, responses };
}