let makeRequest = async (apiUrl: string, headers: any) => {
    let res = await fetch(apiUrl, {
        headers: headers
    });
    return res.status;
}

export let testRequestRateLimit = async (apiUrl: string, headers: any, seconds: number) => {
    let responses = [];

    let startTime = Date.now();

    for (let i = 1; i <= seconds; i++) {
        let acceptedRequests = 0;
        let rejectedRequests = 0;
        let totalRequestsPerSecond = 0;
        while (Date.now() - startTime <= i * 1000) {
            let statusCode = await makeRequest(apiUrl, headers);
            if (statusCode === 200) acceptedRequests++;
            else if (statusCode === 429) rejectedRequests++;
            totalRequestsPerSecond++;
        }
        responses.push({
            second: i,
            totalRequestsPerSecond: totalRequestsPerSecond,
            acceptedRequests: acceptedRequests,
            rejectedRequests: rejectedRequests
        })
    }

    let totalTime = (Date.now() - startTime) / 1000;
    return { totalTime, responses };
}