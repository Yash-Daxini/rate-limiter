let makeRequest = async (apiUrl: string, headers: any) => {
    let res = await fetch(apiUrl, {
        headers: headers
    });
    return res.status;
}

export let testRequestRateLimit = async (apiUrl: string, headers: any) => {
    let acceptedRequests = 0;
    let rejectedRequests = 0;
    let totalRequests = 0;

    let startTime = Date.now();

    while (Date.now() - startTime <= 1000) {
        let statusCode = await makeRequest(apiUrl, headers);
        if (statusCode === 200) acceptedRequests++;
        else if (statusCode === 429) rejectedRequests++;
        totalRequests++;
    }
    let totalTime = (Date.now() - startTime) / 1000;
    return acceptedRequests;
}

export let testRequestBurst = async (endPoint: string, requestIntervalInSeconds: number, headers: any) => {
    let acceptedRequests = await makeRequest(endPoint, headers);
    console.warn(`Burst come after ${requestIntervalInSeconds} seconds ...`)
    setTimeout(async () => {
        acceptedRequests += await testRequestRateLimit(endPoint, headers);
        return acceptedRequests;
    }, requestIntervalInSeconds * 1000);
    console.warn(acceptedRequests);
    return acceptedRequests;
}