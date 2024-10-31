import '../styles/style.css';
import Accordion from './Accordion';

const DisplayAPI = () => {
    return (
        <div className='main'>
            <h4>Rate Limiter Test UI</h4>
            <Accordion key={1} title='User Level Rate Limiter (Service 1)'
                url1='http://localhost:3000/api/service1/nonBurst'
                url2='http://localhost:3000/api/service1/burst'
                level='user' />
            <Accordion key={2} title='IP Level Rate Limiter (Service 2)' url1='http://localhost:3001/api/service2/nonBurst'
                url2='http://localhost:3001/api/service2/burst'
                level='ip' />
            <Accordion key={3} title='Service Level Rate Limiter (Service 3)' url1='http://localhost:3000/api/service1/nonBurst/callservice3'
                url2='http://localhost:3000/api/service1/burst/callservice3'
                level='service' />
        </div>
    )
}

export default DisplayAPI
