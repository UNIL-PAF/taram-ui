import React from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";

export default function BoxPlot(props) {
    const results = JSON.parse(props.data.results)

    return (
        <Card title={"Boxplot"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
        }>
            <p>Boxplot</p>
        </Card>
    );
}