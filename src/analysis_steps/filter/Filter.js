import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import FilterParams from "./FilterParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import StepComment from "../StepComment";

export default function Filter(props) {
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
        <Card className={'analysis-step-card'} title={"Filter"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status} errorMsg={props.data.error}
                              onClickOk={onClickOk} error={props.data.error}
                              paramComponent={<FilterParams analysisIdx={props.analysisIdx}
                                                                data={props.data}
                                                                localParams={localParams}
                                                                setLocalParams={setLocalParams}></FilterParams>}/>
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