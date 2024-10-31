import APICallPage from "./APICallPage"

interface AccordionProps {
    key: number
    title: string,
    url1: string,
    url2: string,
    level: string
}

const Accordion: React.FC<AccordionProps> = ({ title, url1, url2, level: level }: AccordionProps) => {
    return (
        <div>
            <div className="accordion accordion-flush" id={`accordionExample${level}`}>
                <div className="accordion-item">
                    <h2 className="accordion-header bg-dark">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${level}`} aria-expanded="false" aria-controls={`collapse${level}`} >
                            {title}
                        </button>
                    </h2>
                    <div id={`collapse${level}`} className="accordion-collapse collapse" data-bs-parent={`accordionExample${level}`}>
                        <div className="accordion-body">
                            <APICallPage level={level} url1={url1} url2={url2} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Accordion
