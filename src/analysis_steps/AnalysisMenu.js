import React from "react";
import {Menu} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep} from "./BackendAnalysisSteps";

export default function AnalysisMenu(props) {
    const dispatch = useDispatch();

    const clickQualityControl = function (stepId, type) {
        console.log("click QualityControl", stepId, type)
        const stepObj = {stepId: stepId, type: type}
        dispatch(addAnalysisStep(stepObj))
    }

    return (
        <Menu>
            <Menu.Item onClick={() => clickQualityControl(props.stepId, "quality_control")} key={'quality_control'}>
                <span>Quality Control</span>
            </Menu.Item>
        </Menu>

    );
}
