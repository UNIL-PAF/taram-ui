import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import TTestParams from "./TTestParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import StepComment from "../StepComment";

export default function TTest(props) {
    const dispatch = useDispatch();
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    const onClickOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: localParams
        }))
    }

    return (
        <Card className={'analysis-step-card'} title={"t-test"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status} errorMsg={props.data.error}
                              onClickOk={onClickOk} error={props.data.error}
                              paramComponent={<TTestParams analysisIdx={props.analysisIdx}
                                                                 data={props.data}
                                                                 localParams={localParams}
                                                                 setLocalParams={setLocalParams}></TTestParams>}/>
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