import React from "react";
import {Button, Card} from "antd";
import {getStepTitle} from "../CommonStepUtils";
import ConclusionComment from "./ConclusionComment";
import {useState} from "react";

export default function Conclusion(props) {
    const [isEditing, setIsEditing] = useState(false);

    const getConclusion = () => {
        return (
            <Card className={"analysis-step-card"}
                  title={getStepTitle(null, "Conclusion")}
                  headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
                  bodyStyle={{textAlign: 'left'}}
            >
                <ConclusionComment analysisId={props.analysisId} conclusion={props.conclusion}
                                   isEditing={isEditing} setIsEditing={setIsEditing}
                                   resultId={props.resultId}></ConclusionComment>
            </Card>
        )
    }

    const getButton = () => {
        return (
            <Card className={"analysis-step-card"}
                  title={<Button onClick={() => setIsEditing(true)} size={"small"} danger={true} type={"primary"}
                                 disabled={props.isLocked}>Add conclusion</Button>}
                  headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
                  bodyStyle={{display: "none"}}
            >
            </Card>
        )
    }

    return (
        <>
            {(props.conclusion || isEditing) && getConclusion()}
            {!(props.conclusion || isEditing) && getButton()}
        </>
    );
}