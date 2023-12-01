import React from "react";
import {Card, Spin} from 'antd';
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu"

export default function QualityControl(props) {
    return (
        <Card className={'analysis-step-card'} title={<span>Quality Control {props.data.status === 'running' && <Spin style={{paddingLeft: "50px"}}/>}</span>} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <span>
                <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
            </span>
        }>
            <p>Something</p>
        </Card>
    );
}
