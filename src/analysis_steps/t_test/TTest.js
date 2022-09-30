import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import TTestParams from "./TTestParams";
import StepComment from "../StepComment";

export default function TTest(props) {
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    return (
        <Card className={'analysis-step-card'} title={"t-test"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              error={props.data.error}
                              paramType={"t-test"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              paramComponent={<TTestParams analysisIdx={props.analysisIdx}
                                                           params={localParams} commonResult={props.data.commonResult}
                                                           setParams={setLocalParams}
                                                           intCol={props.data.columnInfo.columnMapping.intCol}
                                            ></TTestParams>}/>
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            { results &&
                <div>
                    <p>Nr of significant results: <strong>{results.numberOfSignificant}</strong></p>
                </div>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}