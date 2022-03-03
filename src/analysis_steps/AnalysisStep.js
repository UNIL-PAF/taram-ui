import React from "react";
import InitialResult from "./initial_result/InitialResult";
import QualityControl from "./quality_control/QualityControl";

export default function AnalysisStep(props) {
    return (
        <div className={"analysis-col"}>
            <h3>Analysis #{props.data.idx + 1}</h3>
            <div>
                {
                    props.data.analysisSteps && props.data.analysisSteps.map(step => {
                        switch (step.type) {
                            case 'initial-result':
                                return <InitialResult resultId={props.data.resultId} data={step} key={step.id}/>
                            case 'quality-control':
                                return <QualityControl resultId={props.data.resultId} data={step} key={step.id}/>
                            default:
                                return null
                        }
                    })
                }
            </div>
        </div>

    );
}
