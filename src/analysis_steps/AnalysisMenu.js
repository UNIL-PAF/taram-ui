import React from "react";
import {Button, Dropdown, Menu} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep} from "./BackendAnalysisSteps";
import {BarChartOutlined, PlusCircleOutlined} from "@ant-design/icons";

export default function AnalysisMenu(props) {
    const dispatch = useDispatch();

    const clickQualityControl = function (stepId, type, resultId) {
        const stepObj = {stepId: stepId, resultId: resultId, newStep: {type: type}}
        dispatch(addAnalysisStep(stepObj))
    }

    const analysisMenuList = (
        <Menu>
            <Menu.Item onClick={() => clickQualityControl(props.stepId, "quality-control", props.resultId)}
                       key={'quality-control'}>
                <span>Quality Control</span>
            </Menu.Item>
        </Menu>
    )

    const buttonsDisabled = props.status != "done"

    return (

        <div>
            <Button type={"text"} icon={<BarChartOutlined/>} disabled={buttonsDisabled}></Button>
            <Dropdown overlay={analysisMenuList} placement="bottomLeft"
                      arrow disabled={buttonsDisabled}>
                <Button type={"text"} icon={<PlusCircleOutlined/>}></Button>
            </Dropdown>
        </div>


    );
}
