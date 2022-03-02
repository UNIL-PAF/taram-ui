import React from "react";
import {Menu} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep} from "./BackendAnalysisSteps";

export default function AnalysisMenu(props) {
    const dispatch = useDispatch();

    const clickQualityControl = function (stepId, type) {
        const stepObj = {stepId: stepId, newStep:  {type: type}}
        dispatch(addAnalysisStep(stepObj))
    }

    return (
        <Menu>
            <Menu.Item onClick={() => clickQualityControl(props.stepId, "quality-control")} key={'quality-control'}>
                <span>Quality Control</span>
            </Menu.Item>
        </Menu>

    );
}
