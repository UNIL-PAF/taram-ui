import React, {useState} from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";
import TransformationParams from "./TransformationParams";

export default function Transformation(props) {
    const params = JSON.parse(props.data.parameters)

    const [localParams, setLocalParams] = useState(params)

    const onClickOk = () => {
        console.log("click OK", localParams)
    }

    return (
        <Card className={'analysis-step-card'} title={"Transformation"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                          onClickOk={onClickOk}
                          paramComponent={<TransformationParams analysisIdx={props.analysisIdx}
                                                                data={props.data}
                                                                localParams={localParams}
                                                                setLocalParams={setLocalParams}></TransformationParams>}/>
        }>
            {params &&
                <div>
                    <p>Transformation: <strong>{params.transformationType}</strong></p>
                    <p>Normalization: <strong>{params.normalizationType}</strong></p>
                    <p>Imputation: <strong>{params.imputationType}</strong></p>
                </div>
            }
        </Card>
    );
}