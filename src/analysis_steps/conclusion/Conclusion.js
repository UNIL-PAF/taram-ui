import React from "react";
import {Card} from "antd";
import {getStepTitle} from "../CommonStepUtils";
import ConclusionComment from "./ConclusionComment";

export default function Conclusion(props) {
    return (
        <Card className={"analysis-step-card" }
              title={getStepTitle(null, "Conclusion")}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}}
        >
            <ConclusionComment analysisId={props.analysisId} conclusion={props.conclusion} resultId={props.resultId}></ConclusionComment>
        </Card>
    );
}