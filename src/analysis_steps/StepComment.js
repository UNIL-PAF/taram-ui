import React, {useEffect, useState} from "react";
import {Button, Input, Space} from 'antd';
import {updateComment} from "./BackendAnalysisSteps";
import {useDispatch} from "react-redux";

const {TextArea} = Input;

export default function StepComment(props) {

    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.comment) {
            console.log("set comment", props.comment)
            setCommentText(props.comment)
        }
    }, [props])

    const addOrEdit = () => {
        setIsEditing(!isEditing)
    };

    const save = () => {
        const stepObj = {stepId: props.stepId, resultId: props.resultId, comment: commentText}
        console.log("save", stepObj)
        dispatch(updateComment(stepObj))
        setIsEditing(!isEditing)
    }

    const cancel = () => {
        setIsEditing(!isEditing)
    }


    return (
        <>
            {!isEditing &&
                <div style={{whiteSpace: 'pre-wrap'}}>
                    {props.comment && <p>{props.comment}</p>}
                    <Button onClick={addOrEdit} size={"small"}>{(props.comment ? "Edit" : "Add") + " comment"}</Button>
                </div>
            }
            {isEditing &&
                <div>
                    <TextArea rows={3} style={{marginBottom: 8}}
                              onChange={(e) => setCommentText(e.target.value)}
                              defaultValue={commentText}
                    ></TextArea>
                    <Space>
                        <Button onClick={save}>Save</Button>
                        <Button onClick={cancel} danger>Cancel</Button>
                    </Space>
                </div>
            }

        </>


    );
}
