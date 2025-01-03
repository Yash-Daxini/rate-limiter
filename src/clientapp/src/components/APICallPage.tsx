import { useState } from "react";
import { testRequestRateLimit } from "../utils/ratelimittest";
import { IpHeader, IpPriorityHeader, ServiceHeader, ServicePriorityHeader, UserHeader, UserPriorityHeader } from "../constants/HeaderConstants";

interface APICallPageProps {
    level: string,
    url1: string,
    url2: string
}

interface RateLimitTestingResponse {
    second: number,
    totalRequestsPerSecond: number,
    acceptedRequests: number,
    rejectedRequests: number
}

const APICallPage: React.FC<APICallPageProps> = ({ level: level, url1, url2 }: APICallPageProps) => {

    const [url, setUrl] = useState<string>(url1);
    const [responseList, setResponseList] = useState<RateLimitTestingResponse[]>([]);
    const [requestSeconds, setRequestSeconds] = useState<number>(1);
    const [isResponsePending, setIsResponsePending] = useState(false);
    const [totalTimeToProcessRequestTest, setTotalTimeToProcessRequestTest] = useState<number>(0);
    const [isPriority, setIsPriority] = useState<boolean>(false);

    let responseTableColumns = responseList.map((response,index) => {
        return (
            <tr>
                <td>{index+1}</td>
                <td scope="row">{response.second}</td>
                <td>{response.totalRequestsPerSecond}</td>
                <td>{response.acceptedRequests}</td>
                <td>{response.rejectedRequests}</td>
            </tr>
        )
    })
    let testRateLimit = async () => {
        setIsResponsePending(true);
        setResponseList([]);
        setTotalTimeToProcessRequestTest(0);
        let response: { totalTime: number, responses: RateLimitTestingResponse[] } = await testRequestRateLimit(url, getHeader(), requestSeconds);
        setIsResponsePending(false);
        setTotalTimeToProcessRequestTest(response.totalTime);
        setResponseList(response.responses);
    }

    const getHeader = (): any => {
        if (isPriority) return getPriorityHeader();
        if (level === 'user')
            return UserHeader;
        else if (level === 'ip')
            return IpHeader;
        else if (level === 'service')
            return ServiceHeader;
    }

    const getPriorityHeader = () => {
        if (level === 'user')
            return UserPriorityHeader;
        else if (level === 'ip')
            return IpPriorityHeader;
        else if (level === 'service')
            return ServicePriorityHeader;
    }

    const getTotalRequestsSent = (): number => {
        return responseList.reduce((accumulator, currentValue) => accumulator + currentValue.totalRequestsPerSecond, 0);
    }

    const getTotalAcceptedRequests = (): number => {
        return responseList.reduce((accumulator, currentValue) => accumulator + currentValue.acceptedRequests, 0);
    }

    const getTotalRejectedRequest = (): number => {
        return responseList.reduce((accumulator, currentValue) => accumulator + currentValue.rejectedRequests, 0);
    }

    return (
        <div>
            <div>
                <div className="d-flex justify-content-center gap-5">
                    <div className="form-check my-3">
                        <input className="form-check-input border-dark" type="radio" name={`flexRadioDefault${level}`} id={`flexRadioDefault${level}1`} checked={url === url1} onChange={(e) => {
                            if (e.target.checked)
                                setUrl(url1);
                        }} />
                        <label className="form-check-label" htmlFor={`flexRadioDefault${level}1`}>
                            Non burst strategy
                        </label>
                    </div>
                    <div className="form-check my-3">
                        <input className="form-check-input border-dark" type="radio" name={`flexRadioDefault${level}`} id={`flexRadioDefault${level}2`} checked={url === url2} onChange={(e) => {
                            if (e.target.checked)
                                setUrl(url2);
                        }} />
                        <label className="form-check-label" htmlFor={`flexRadioDefault${level}2`}>
                            Burst Strategy
                        </label>
                    </div>
                    <div className="form-check my-3">
                        <input className="form-check-input border-dark" type="checkbox" onChange={(e) => {
                            if (e.target.checked)
                                setIsPriority(true);
                            else
                                setIsPriority(false);
                        }} />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Want to do requests with priority ?
                        </label>
                    </div>
                </div>
                <div>
                    <label htmlFor="customRange3" className="form-label">Till how many seconds you want to make requests ? <br /> <strong>{requestSeconds} seconds</strong> </label>
                    <input type="range" value={requestSeconds} className="form-range" min="1" max="120" step="1" id="customRange3" onChange={(e) => {
                        setRequestSeconds(+e.target.value);
                    }} />
                </div>

                <div>
                    <button type="button" onClick={async () => {
                        await testRateLimit()
                    }} className="btn btn-success" disabled={isResponsePending}>Send Requests</button>
                    <button className="btn border-0">
                        {isResponsePending ?
                            <b>Process is running, please wait ...</b> : totalTimeToProcessRequestTest === 0 ? "" : <></>}
                    </button>
                </div>
            </div>
            <div>
                {totalTimeToProcessRequestTest === 0 ? <></> :
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Sr No.</th>
                                <th scope="col">Second
                                    <strong> ({totalTimeToProcessRequestTest})</strong>
                                </th>
                                <th scope="col">Total Request Sent
                                    <strong> ({getTotalRequestsSent()})</strong>
                                </th>
                                <th scope="col">Accepted Requests
                                    <strong> ({getTotalAcceptedRequests()})</strong>
                                </th>
                                <th scope="col">Rejected Requests
                                    <strong> ({getTotalRejectedRequest()})</strong>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isResponsePending ?
                                <>
                                </> : responseTableColumns}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default APICallPage
