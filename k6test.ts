import http from 'k6/http';
import { check } from 'k6';

export const options = {
    executor: 'constant-arrival-rate',
    timeUnit: '1s',
    duration: '300s',

}

export default () => {
    const params = { headers: { 'x-user-id': 'dd' } };
    const res = http.get("http://host.docker.internal:3000/api/service1/nonBurst", params);
    check(res, {
        '200': (r) => r.status === 200,
        '429': (r) => r.status === 429
    })
    // sleep(0.1);
}

