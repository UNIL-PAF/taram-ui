import React from "react";
import {Collapse} from 'antd';
import InitialResult from "./initial_result/InitialResult";

export default function AnalysisStep(props) {
    console.log(props)

    return (
        <div className={"analysis-col"}>
            <h3>Analysis #{props.data.idx + 1}</h3>
            <div>
                {
                    props.data.analysisSteps.map(step => {
                        switch(step.type){
                            case 'initial_result': return <InitialResult data={step} key={step.id}/>
                            break
                        }
                    })
                }
            </div>
        </div>

    );
}
