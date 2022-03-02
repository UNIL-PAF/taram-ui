import React from "react";
import {Menu} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep} from "./BackendAnalysisSteps";

export default function AnalysisMenu(props) {
    const dispatch = useDispatch();

    const clickQualityControl = function (stepId, type, resultId) {
        const stepObj = {stepId: stepId, resultId: resultId, newStep: {type: type}}
        dispatch(addAnalysisStep(stepObj))
    }

    return (
        <Menu>
            <Menu.Item onClick={() => clickQualityControl(props.stepId, "quality-control", props.resultId)}
                       key={'quality-control'}>
                <span>Quality Control</span>
            </Menu.Item>
        </Menu>

    );
}
