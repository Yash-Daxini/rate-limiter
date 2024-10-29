import { useState } from "react";
import { testRequestRateLimit } from "../utils/ratelimittest";

interface APICallPageProps {
    service: string,
    url1: string,
    url2: string,
    headers: any
}

interface RateLimitTestingResponse {
    second: number,
    totalRequestsPerSecond: number,
    acceptedRequests: number,
    rejectedRequests: number
}

const APICallPage: React.FC<APICallPageProps> = ({ service, url1, url2, headers }: APICallPageProps) => {

    const [url, setUrl] = useState<string>(url1);
    const [responseList, setResponseList] = useState<RateLimitTestingResponse[]>([]);
    const [requestSeconds, setRequestSeconds] = useState<number>(1);
    const [isResponsePending, setIsResponsePending] = useState(false);
    const [totalTimeToProcessRequestTest, setTotalTimeToProcessRequestTest] = useState<number>(0);

    let responseTableColumns = responseList.map((response) => {
        return (
            <tr>
                <td scope="row">{response.second}</td>
                <td>{response.totalRequestsPerSecond}</td>
                <td>{response.acceptedRequests}</td>
                <td>{response.rejectedRequests}</td>
            </tr>
        )
    })

    let testRateLimit = async () => {
        setIsResponsePending(true);
        let response: { totalTime: number, responses: RateLimitTestingResponse[] } = await testRequestRateLimit(url, headers, requestSeconds);
        setIsResponsePending(false);
        setTotalTimeToProcessRequestTest(response.totalTime);
        setResponseList(response.responses);
    }


    return (
        <div>
            <div>
                <div className="d-flex justify-content-center gap-5">
                    <div className="form-check my-3">
                        <input className="form-check-input border-dark" type="radio" name={`flexRadioDefault${service}`} id="flexRadioDefault1" checked={url === url1} onChange={(e) => {
                            if (e.target.checked)
                                setUrl(url1);
                        }} />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Non burst strategy
                        </label>
                    </div>
                    <div className="form-check my-3">
                        <input className="form-check-input border-dark" type="radio" name={`flexRadioDefault${service}`} id="flexRadioDefault2" checked={url === url2} onChange={(e) => {
                            if (e.target.checked)
                                setUrl(url2);
                        }} />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Burst Strategy
                        </label>
                    </div>
                </div>
                <div>
                    <label htmlFor="customRange3" className="form-label">Till how many seconds you want to make requests ? <br /> <strong>{requestSeconds} seconds</strong> </label>
                    <input type="range" value={requestSeconds} className="form-range" min="1" max="60" step="1" id="customRange3" onChange={(e) => {
                        setRequestSeconds(+e.target.value);
                    }} />
                </div>

                <div>
                    <button type="button" onClick={async () => {
                        await testRateLimit()
                    }} className="btn btn-success" disabled={isResponsePending}>Send Requests</button>
                    <button className="btn border-0">
                        {isResponsePending ?
                            "Process is running, please wait ..." : totalTimeToProcessRequestTest === 0 ? "" : `Time taken to complete process ${totalTimeToProcessRequestTest}`}
                    </button>
                </div>
            </div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Second</th>
                            <th scope="col">Total Request Sent</th>
                            <th scope="col">Accepted Requests</th>
                            <th scope="col">Rejected Requests</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isResponsePending ?
                            <>
                            </> : responseTableColumns}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default APICallPage
