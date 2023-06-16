import React, {useEffect, useState} from "react";
import '../analysis_steps/AnalysisStep.css'
import {useDispatch} from "react-redux";
import {Button, Input} from "antd";
import {setAnalysisName} from "./BackendAnalysis";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {setStopMenuShortcut} from "./analysisSlice";

export default function AnalysisTitle(props) {
    const [isEditing, setIsEditing] = useState(false);
    // we add this tempName, to show new name before data from backend is loaded
    const [tempName, setTempName] = useState(undefined)
    const [name, setName] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if(isEditing){
            dispatch(setStopMenuShortcut(true))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing])

    useEffect(() => {
        if (props.name) {
            setName(props.name)
        }
    }, [props.name])

    const save = () => {
        const alObj = {analysisId: props.id, analysisName: name ? name : "", resultId: props.resultId}
        setIsEditing(!isEditing)
        dispatch(setAnalysisName(alObj))
        setTempName(name)
        dispatch(setStopMenuShortcut(false))
    }

    const cancel = () => {
        setIsEditing(!isEditing)
        dispatch(setStopMenuShortcut(false))
    }

    return (
        <>
            {!isEditing &&
                <span onClick={() => setIsEditing(true)}>{tempName || props.name || "Analysis #" + (props.idx + 1)}</span>
            }
            { isEditing &&
                <span>
                            <Input
                                style={{ width: 100 }}
                                defaultValue={tempName || props.name || "Analysis #" + (props.idx + 1)}
                                onPressEnter={save}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={save}/>
                                <Button shape="circle" icon={<CheckOutlined style={{fontSize: '10px'}}/>} onClick={() => save()} size={"small"}></Button>
                                <Button shape="circle" icon={<CloseOutlined style={{fontSize: '10px'}}/>} onClick={() => cancel()} size={"small"} danger></Button>
                </span>
            }
        </>
    );
}
