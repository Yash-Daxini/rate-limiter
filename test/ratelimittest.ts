import http from 'http';

let makeSyncRequest = (endPoint: string) => {
    const urlObj = new URL(`http://localhost:3000/${endPoint}`);
    const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'ddfdd4'
        },
        port: 3000
    };
    return new Promise((resolve, reject) => {
        const req = http.get(options, (res) => {
            res.on('data', () => { });
            res.on('end', () => {
                resolve(res.statusCode);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });
    });
}

let testLimit = async (endPoint: string, seconds: number, requestPerSeconds: number) => {

    let acceptedRequests = 0;
    let rejectedRequests = 0;

    let startTime = Date.now();
    console.warn("starttime ", startTime);
    let totalCount = 0;
    for (let i = 1; i <= seconds; i++) {
        let requestPerSecond = 0;
        while (Date.now() - startTime < i * 999)
            while (Date.now() - startTime < i * 1000 && requestPerSecond < requestPerSeconds) {
                let x = await makeSyncRequest(endPoint);
                if (x == 200)
                    acceptedRequests++;
                else
                    rejectedRequests++
                requestPerSecond++;

                // console.warn(`Request no = ${requestPerSecond} at ${i} sec with timestamp ${Date.now()}`)
            }
        totalCount += requestPerSecond;
        console.warn(`${i} ${totalCount} ${acceptedRequests}`)
        // console.warn((Date.now() - startTime) / 1000);
    }

    // console.warn((Date.now() - startTime) / 1000)

    console.warn(`Total Requsts in ${seconds} sec = ${totalCount} Accepted = ${acceptedRequests} Rejected = ${rejectedRequests}`);
}

testLimit("nonBurst", 3, 20);
// testLimit("burst", 10, 20); 