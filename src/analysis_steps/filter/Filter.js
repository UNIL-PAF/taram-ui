import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import FilterParams from "./FilterParams";
import StepComment from "../StepComment";

export default function Filter(props) {
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    return (
        <Card className={'analysis-step-card'} title={"Filter"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              error={props.data.error} paramType={"filter"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              paramComponent={<FilterParams analysisIdx={props.analysisIdx}
                                                             params={props.data.parameters} commonResult={props.data.commonResult}
                                                             setParams={setLocalParams}
                              ></FilterParams>}/>
            }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            { results &&
                <div>
                    <p>Protein groups: <strong>{results.nrRows}</strong></p>
                    <p>Removed: <strong>{results.nrRowsRemoved}</strong></p>
                </div>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}