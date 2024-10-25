let makeRequest = async (endPoint: string) => {
    let res = await fetch(`http://localhost:3000/${endPoint}`, {
        headers: {
            'x-user-id': 'ddfdd4'
        },
    });
    return res.status;
}

let testLimit = async (endPoint: string, seconds: number, requestsPerSecond: number) => {

    let acceptedRequests = 0;
    let rejectedRequests = 0;
    let totalCount = 0;

    let startTime = Date.now();

    for (let i = 1; i <= seconds; i++) {
        const interval = 1000 / requestsPerSecond;

        const requests: Promise<number>[] = [];

        for (let j = 1; j <= requestsPerSecond; j++) {
            requests.push(
                new Promise((resolve) =>
                    setTimeout(async () => {
                        const statusCode = await makeRequest(endPoint);
                        resolve(statusCode);
                    }, j * interval)
                )
            );
        }

        const results = await Promise.all(requests);

        results.forEach((statusCode) => {
            if (statusCode === 200) acceptedRequests++;
            else if (statusCode === 429) rejectedRequests++;
        });

        totalCount += requestsPerSecond;
        console.warn(`${i} ${requestsPerSecond} ${acceptedRequests}`);
    }
    let totalTime = (Date.now() - startTime) / 1000;
    console.warn(`Total Requests Sent: ${totalCount}, Accepted: ${acceptedRequests}, Rejected: ${rejectedRequests} Total Time : ${totalTime}`);
}

testLimit("nonBurst", 10, 20);
// testLimit("burst", 10, 20); 