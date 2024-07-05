import React, {useEffect, useState} from "react";
import {Button, Col, Input, Row, Space} from 'antd';
import {setConclusion} from "../../analysis/BackendAnalysis";
import {useDispatch} from "react-redux";
import {CloseCircleOutlined} from "@ant-design/icons";
import '../AnalysisStep.css'

const {TextArea} = Input;

export default function ConclusionComment(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [conclusionText, setConclusionText] = useState(null)
    const [mouseOver, setMouseOver] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.conclusion) {
            setConclusionText(props.conclusion)
        }
    }, [props.conclusion])

    const save = () => {
        const stepObj = {analysisId: props.analysisId, conclusion: conclusionText, resultId: props.resultId}
        setIsEditing(!isEditing)
        dispatch(setConclusion(stepObj))
    }

    const deleteComment = () => {
        const stepObj = {analysisId: props.analysisId, conclusion: null, resultId: props.resultId}
        dispatch(setConclusion(stepObj))
    }

    const cancel = () => {
        setIsEditing(!isEditing)
    }

    return (
        <>
            {!isEditing &&
                <Row onMouseEnter={() => {if(!props.isLocked) setMouseOver(true)}}
                     onMouseLeave={() => setMouseOver(false)}
                     align="top"
                     className={"comment-box"}
                >
                    <Col span={23}>
                        {props.conclusion && <p style={{
                            whiteSpace: 'pre-wrap',
                            /*backgroundColor: "yellow",*/
                            color: "#006d75",
                            paddingLeft: "5px"
                        }} onClick={() => {if(!props.isLocked) setIsEditing(true)}}>{props.conclusion}</p>}
                        {!props.conclusion && <div><Button onClick={() => setIsEditing(true)} size={"small"} danger={true} type={"primary"} disabled={props.isLocked}>Add conclusion</Button></div>}
                    </Col>
                    <Col span={1}>
                        {props.conclusion && mouseOver && <div>
                            <Button className={"comment-button"} type={"text"} icon={<CloseCircleOutlined/>}
                                    onClick={() => deleteComment()}></Button>
                        </div>}
                    </Col>
                </Row>
            }
            {isEditing &&
                <div>
                    <TextArea rows={3} style={{marginBottom: 8, width: '80%'}}
                              onChange={(e) => setConclusionText(e.target.value)}
                              defaultValue={conclusionText}
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
