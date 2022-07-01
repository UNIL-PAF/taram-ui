import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import TransformationParams from "./TransformationParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import StepComment from "../StepComment";

export default function Transformation(props) {
    const dispatch = useDispatch();
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)

    const onClickOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: localParams
        }))
    }

    return (
        <Card className={'analysis-step-card'} title={"Transformation"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status} errorMsg={props.data.error}
                              onClickOk={onClickOk} error={props.data.error}
                              paramComponent={<TransformationParams analysisIdx={props.analysisIdx}
                                                                data={props.data}
                                                                localParams={localParams}
                                                                setLocalParams={setLocalParams}></TransformationParams>}/>
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {params &&
                <div>
                    <p>Transformation: <strong>{params.transformationType}</strong></p>
                    <p>Normalization: <strong>{params.normalizationType}</strong></p>
                    <p>Imputation: <strong>{params.imputationType}</strong></p>
                </div>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}