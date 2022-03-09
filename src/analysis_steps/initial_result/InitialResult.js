import React from "react";
import {Card} from 'antd';
import AnalysisMenu from "../AnalysisMenu"
import GroupSelection from "./GroupSelection";

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)

    return (
        <Card title={"Initial Result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                          paramComponent={<GroupSelection analysisIdx={props.analysisIdx}
                                                          data={props.data}></GroupSelection>}/>
        }>
            <p>MaxQuant version: <strong>{results.maxQuantParameters.version}</strong></p>
            <p>Protein groups: <strong>{results.nrProteinGroups}</strong></p>
        </Card>
    );
}
