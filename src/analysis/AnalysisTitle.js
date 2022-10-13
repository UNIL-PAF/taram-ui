import React, {useEffect, useState} from "react";
import '../analysis_steps/AnalysisStep.css'
import {useDispatch} from "react-redux";
import {Button, Input, Space} from "antd";
import {setAnalysisName} from "./BackendAnalysis";

export default function AnalysisTitle(props) {
    const [isEditing, setIsEditing] = useState(false);
    // we add this tempName, to show new name before data from backend is loaded
    const [tempName, setTempName] = useState(undefined)
    const [name, setName] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.name) {
            setName(props.name)
        }
    }, [props.name])

    const save = () => {
        const analysisObj = {analysisId: props.id, analysisName: name, resultId: props.resultId}
        setIsEditing(!isEditing)
        dispatch(setAnalysisName(analysisObj))
        setTempName(name)
    }

    const cancel = () => {
        setIsEditing(!isEditing)
    }

    return (
        <>
            {!isEditing &&
                <span onClick={() => setIsEditing(true)}>{tempName || props.name || "Analysis #" + (props.idx + 1)}</span>
            }
            { isEditing &&
                <div>
                    <Space>
                        <Input
                            style={{ width: 200 }}
                            defaultValue={props.name}
                            onPressEnter={save}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={save}/>
                        <Button onClick={() => save()} size={"small"}>Save</Button>
                        <Button onClick={() => cancel()} size={"small"} danger>Cancel</Button>
                    </Space>
                </div>
            }
        </>
    );
}
