import React, {useEffect, useState} from "react";
import {Button, Col, Input, Row, Space} from 'antd';
import {updateComment} from "./BackendAnalysisSteps";
import {setStopMenuShortcut} from "../analysis/analysisSlice"
import {useDispatch} from "react-redux";
import {CloseCircleOutlined} from "@ant-design/icons";
import './AnalysisStep.css'

const {TextArea} = Input;

export default function StepComment(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState(null)
    const [mouseOver, setMouseOver] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if(isEditing){
            dispatch(setStopMenuShortcut(true))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing])

    useEffect(() => {
        if (props.comment) {
            setCommentText(props.comment)
        }
    }, [props.comment])

    const save = () => {
        const stepObj = {stepId: props.stepId, resultId: props.resultId, comment: commentText}
        setIsEditing(!isEditing)
        dispatch(updateComment(stepObj))
        dispatch(setStopMenuShortcut(false))
    }

    const deleteComment = () => {
        const stepObj = {stepId: props.stepId, resultId: props.resultId, comment: null}
        dispatch(updateComment(stepObj))
        dispatch(setStopMenuShortcut(false))
    }

    const cancel = () => {
        setIsEditing(!isEditing)
        dispatch(setStopMenuShortcut(false))
    }

    return (
        <>
            {!isEditing &&
                <Row onMouseEnter={() => setMouseOver(true)}
                     onMouseLeave={() => setMouseOver(false)}
                     align="top"
                     className={"comment-box"}
                >
                    <Col span={23}>
                        {props.comment && <p style={{
                            whiteSpace: 'pre-wrap',
                            /*backgroundColor: "yellow",*/
                            color: "#006d75",
                            paddingLeft: "5px"
                        }} onClick={() => setIsEditing(true)}>{props.comment}</p>}
                        {!props.comment && <div><Button onClick={() => setIsEditing(true)} size={"small"} type={"primary"}>Add comment</Button></div>}
                    </Col>
                    <Col span={1}>
                        {props.comment && mouseOver && <div>
                            <Button className={"comment-button"} type={"text"} icon={<CloseCircleOutlined/>}
                                    onClick={() => deleteComment()}></Button>
                        </div>}
                    </Col>
                </Row>
            }
            {isEditing &&
                <div>
                    <TextArea rows={3} style={{marginBottom: 8, width: '80%'}}
                              onChange={(e) => setCommentText(e.target.value)}
                              defaultValue={commentText}
                    ></TextArea>
                    <Space>
                        <Button onClick={() => save()} size={"small"} style={{marginLeft: '10px'}}>Save</Button>
                        <Button onClick={() => cancel()} size={"small"} danger>Cancel</Button>
                    </Space>
                </div>
            }

        </>


    );
}
