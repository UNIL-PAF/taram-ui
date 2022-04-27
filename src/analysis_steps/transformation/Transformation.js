import React from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";
import TransformationParams from "./TransformationParams";

export default function Transformation(props) {


    const onClickOk = () => {
        console.log("click OK")
    }

    return (
        <Card className={'analysis-step-card'} title={"Transformation"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                          onClickOk={onClickOk}
                          paramComponent={<TransformationParams analysisIdx={props.analysisIdx}
                                                         data={props.data}></TransformationParams>}/>
        }>
            <p>Coucou</p>
        </Card>
    );
}