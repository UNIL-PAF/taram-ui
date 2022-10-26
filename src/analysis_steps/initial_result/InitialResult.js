import React from "react";
import {Card} from 'antd';
import AnalysisStepMenu from "../AnalysisStepMenu"
import StepComment from "../StepComment";

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)
    const colInfo = props.data.columnInfo
    const intCol = colInfo ? colInfo.columnMapping.intCol : null


    return (
        <Card className={"analysis-step-card"} title={"Initial result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              commonResult={props.data.commonResult} hideDeleteButton={true} hideSettingButton={true} hideZoomButton={true}
                              intCol={intCol} tableNr={props.data.tableNr}/>
        }>
            <p>Default intensity column: <strong>{intCol}</strong></p>
            {results && results.maxQuantParameters && <p>Match between runs: <strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}</strong></p>}
            <p>Protein groups: <strong>{results && results.nrProteinGroups}</strong></p>
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}
