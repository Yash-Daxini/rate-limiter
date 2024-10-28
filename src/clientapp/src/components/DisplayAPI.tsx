import '../styles/style.css';
import Accordion from './Accordion';

const DisplayAPI = () => {
    return (
        <div className='main'>
            <h4>Rate Limiter Test UI</h4>
            <Accordion key={1} title='User Level Rate Limiter (Service 1)'
                url1='http://localhost:3000/api/service1/nonBurst'
                url2='http://localhost:3000/api/service1/burst'
                service='user'
                headers={{
                    "x-user-id": "dfsfsf"
                }} />
            <Accordion key={2} title='IP Level Rate Limiter (Service 2)' url1='http://localhost:3001/api/service2/nonBurst'
                url2='http://localhost:3001/api/service2/burst'
                service='ip'
                headers={{
                    "x-forwarded-for": "193.168.1.1"
                }} />
            <Accordion key={3} title='Service Level Rate Limiter (Service 3)' url1='http://localhost:3000/api/service1/nonBurst/callservice3'
                url2='http://localhost:3000/api/service1/burst/callservice3'
                service='service'
                headers={{
                    "x-service-name": "service1"
                }} />
        </div>
    )
}

export default DisplayAPI
