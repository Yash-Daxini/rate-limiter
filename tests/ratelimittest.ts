let makeRequest = async (endPoint: string) => {
    let res = await fetch(`http://localhost:3000/${endPoint}`, {
        headers: {
            'x-user-id': 'ddfdd4'
        },
    });
    return res.status;
}

let testLimit = async (endPoint: string, seconds: number) => {

    let acceptedRequests = 0;
    let rejectedRequests = 0;
    let totalCount = 0;

    let startTime = Date.now();

    for (let i = 1; i <= seconds; i++) {
        let totalRequestSendInSecond = 0;
        let acceptedInCurrentSecond = 0;

        while (Date.now() - startTime <= i * 1000) {
            let statusCode = await makeRequest(endPoint);
            if (statusCode === 200) acceptedInCurrentSecond++;
            else if (statusCode === 429) rejectedRequests++;
            totalRequestSendInSecond++;
        }

        totalCount += totalRequestSendInSecond;
        acceptedRequests += acceptedInCurrentSecond
        console.warn(`${i} ${totalRequestSendInSecond} ${acceptedInCurrentSecond}`);
    }
    let totalTime = (Date.now() - startTime) / 1000;
    console.warn(`Total Requests Sent: ${totalCount}, Accepted: ${acceptedRequests}, Rejected: ${rejectedRequests} Total Time : ${totalTime}`);
}

// testLimit("nonBurst", 10);
// testLimit("burst", 10);

let checkBurst = async (requestIntervalInSeconds: number) => {
    await testLimit("burst", 1);
    console.warn(`Burst come after ${requestIntervalInSeconds} seconds ...`)
    setTimeout(() => {
        testLimit("burst", 1);
    }, requestIntervalInSeconds * 1000);
}

checkBurst(10);