import APICallPage from "./APICallPage"

interface AccordionProps {
    key: number
    title: string,
    url1: string,
    url2: string,
    service: string,
    headers: any
}

const Accordion: React.FC<AccordionProps> = ({ title, url1, url2, service, headers }: AccordionProps) => {
    return (
        <div>
            <div className="accordion accordion-flush" id={`accordionExample${service}`}>
                <div className="accordion-item">
                    <h2 className="accordion-header bg-dark">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${service}`} aria-expanded="false" aria-controls={`collapse${service}`} >
                            {title}
                        </button>
                    </h2>
                    <div id={`collapse${service}`} className="accordion-collapse collapse" data-bs-parent={`accordionExample${service}`}>
                        <div className="accordion-body">
                            <APICallPage service={service} url1={url1} url2={url2}
                                headers={headers} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Accordion
