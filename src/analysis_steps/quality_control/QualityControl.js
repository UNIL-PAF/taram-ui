import React from "react";
import {Card, Spin} from 'antd';
import AnalysisMenu from "../AnalysisMenu"

export default function QualityControl(props) {
    return (
        <Card title={<span>Quality Control {props.data.status == 'running' && <Spin style={{paddingLeft: "50px"}}/>}</span>} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <span>
                <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
            </span>
        }>
            <p>Something</p>
        </Card>
    );
}
