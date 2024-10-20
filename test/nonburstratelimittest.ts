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

let testLimit = async (endPoint: string) => {

    let acceptedRequests = 0;
    let rejectedRequests = 0;

    let startTime = Date.now();
    let totalCount = 0;
    while (Date.now() - startTime < 1000) {
        let x = await makeSyncRequest(endPoint);
        if (x == 200)
            acceptedRequests++;
        else
            rejectedRequests++
        totalCount++;
    }

    console.warn(`Total Requsts in 1 sec = ${totalCount} Accepted = ${acceptedRequests} Rejected = ${rejectedRequests}`);
}

// testLimit("nonBurst");
testLimit("burst");