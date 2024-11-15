import '../styles/style.css';
import Accordion from './Accordion';
const env = import.meta.env;

const DisplayAPI = () => {
    return (
        <div className='main'>
            <h4>Rate Limiter Test UI</h4>
            <Accordion key={1} title='User Level Rate Limiter (Service 1)'
                url1={env.VITE_SEVICE1_NONBURST_URL}
                url2={env.VITE_SEVICE1_BURST_URL}
                level='user' />
            <Accordion key={2} title='IP Level Rate Limiter (Service 2)' url1={env.VITE_SEVICE2_NONBURST_URL}
                url2={env.VITE_SEVICE2_BURST_URL}
                level='ip' />
            <Accordion key={3} title='Service Level Rate Limiter (Service 3)' url1={env.VITE_SEVICE3_NONBURST_URL}
                url2={env.VITE_SEVICE3_BURST_URL}
                level='service' />
        </div>
    )
}

export default DisplayAPI
