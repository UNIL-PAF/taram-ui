import React, {useEffect, useState} from "react";
import {Card} from 'antd';
import AnalysisStepMenu from "../AnalysisStepMenu"
import DefineGroupsParams from "./DefineGroupsParams";
import StepComment from "../StepComment";

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)
    //const [localParams, setLocalParams] = useState()


    return (
        <Card className={"analysis-step-card"} title={"Initial result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              commonResult={props.data.commonResult} hideDeleteButton={true} hideSettingButton={true} hideZoomButton={true}/>
        }>
            {results && results.maxQuantParameters && <p>Match between runs: <strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}</strong></p>}
            <p>Protein groups: <strong>{results && results.nrProteinGroups}</strong></p>
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}
