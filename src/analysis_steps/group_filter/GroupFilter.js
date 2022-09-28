import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import GroupFilterParams from "./GroupFilterParams";
import StepComment from "../StepComment";

export default function GroupFilter(props) {
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    return (
        <Card className={'analysis-step-card'} title={"Filter on valid"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status} error={props.data.error}
                              paramType={"group-filter"} commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              paramComponent={<GroupFilterParams analysisIdx={props.analysisIdx}
                                                                 params={localParams}
                                                                 commonResult={props.data.commonResult}
                                                                 setParams={setLocalParams}></GroupFilterParams>}/>
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