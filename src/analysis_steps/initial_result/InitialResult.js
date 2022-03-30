import React from "react";
import {Card} from 'antd';
import AnalysisMenu from "../AnalysisMenu"
import InitialResultParams from "./InitialResultParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch, useSelector} from "react-redux";

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)
    const dispatch = useDispatch();
    const paramsData = useSelector((state) => state.analysisStepParams.data)

    const onClickOk = () => {
        console.log("click OK")
        dispatch(setStepParameters({resultId: props.resultId, stepId: props.data.id, params: paramsData}))
    }

    return (
        <Card className={"analysis-step-card"} title={"Initial Result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                          onClickOk={onClickOk}
                          paramComponent={<InitialResultParams analysisIdx={props.analysisIdx}
                                                          data={props.data}></InitialResultParams>}/>
        }>
            {results.maxQuantParameters && <p>MaxQuant version: <strong>{results.maxQuantParameters.version}</strong></p>}
            <p>Protein groups: <strong>{results.nrProteinGroups}</strong></p>
        </Card>
    );
}
