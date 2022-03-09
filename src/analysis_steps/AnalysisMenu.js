import React, {useState} from "react";
import {Button, Dropdown, Menu, Modal} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep} from "./BackendAnalysisSteps";
import {BarChartOutlined, PlusCircleOutlined, SettingOutlined} from "@ant-design/icons";

export default function AnalysisMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    console.log(props.stepId, props.status)

    const dispatch = useDispatch();

    const clickParams = function(){
        setIsModalVisible(true);
    }

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
        <>
            <Button type={"text"} icon={<SettingOutlined />} disabled={buttonsDisabled} onClick={() => clickParams()}></Button>
            <Button type={"text"} icon={<BarChartOutlined/>} disabled={buttonsDisabled}></Button>
            <Dropdown overlay={analysisMenuList} placement="bottomLeft"
                      arrow disabled={buttonsDisabled}>
                <Button type={"text"} icon={<PlusCircleOutlined/>}></Button>
            </Dropdown>
            <Modal title="Parameters" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {props.paramComponent}
            </Modal>
        </>


    );
}
