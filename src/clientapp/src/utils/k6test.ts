import http from 'k6/http';
import { check, sleep } from 'k6';
// import { Rate } from 'k6/metrics';

export const options = {
    vus: 1,
    duration: '1s'
    // stages: [
        // { duration: '1s', target: 200 },
        // { duration: '10s', target: 200 },
        // { duration: '10s', target: 200 },
    // ]
}

export default () => {
    const params = { headers: { 'x-user-id': 'abc' } };
    const res = http.get("http://host.docker.internal:3000/api/service1/nonBurst", params);
    check(res, { '200': (r) => r.status === 200,
                 '429': (r) => r.status === 429 
    })
    // sleep(1);
}

