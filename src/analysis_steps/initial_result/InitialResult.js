import React from "react";
import {Card} from 'antd';
import AnalysisMenu from "../AnalysisMenu"

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)
    return (
        <Card title={"Initial Result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
                <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
        }>
            <p key={results.id}>version {results.maxQuantParameters.version}</p>
        </Card>
    );
}
