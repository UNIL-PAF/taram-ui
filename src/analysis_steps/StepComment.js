import React, {useEffect, useState} from "react";
import {Button, Col, Input, Row, Space} from 'antd';
import {updateComment} from "./BackendAnalysisSteps";
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
        if (props.comment) {
            setCommentText(props.comment)
        }
    }, [props.comment])

    const save = () => {
        const stepObj = {stepId: props.stepId, resultId: props.resultId, comment: commentText}
        setIsEditing(!isEditing)
        dispatch(updateComment(stepObj))
    }

    const deleteComment = () => {
        const stepObj = {stepId: props.stepId, resultId: props.resultId, comment: null}
        dispatch(updateComment(stepObj))
    }

    const cancel = () => {
        setIsEditing(!isEditing)
    }

    return (
        <>
            {!isEditing &&
                <Row onMouseEnter={() => setMouseOver(true)}
                     onMouseLeave={() => setMouseOver(false)}
                     align="top"
                >
                    <Col span={21}>
                        {props.comment && <p style={{whiteSpace: 'pre-wrap'}} onClick={() => setIsEditing(true)}>{props.comment}</p>}
                        {!props.comment && <div><Button onClick={() => setIsEditing(true)} size={"small"}>Add comment</Button></div>}
                    </Col>
                    <Col span={3}>
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
