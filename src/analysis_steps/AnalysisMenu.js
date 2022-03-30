import React, {useState} from "react";
import {Button, Dropdown, Menu, Modal, Rate} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep} from "./BackendAnalysisSteps";
import {BarChartOutlined, PlusCircleOutlined, SettingOutlined} from "@ant-design/icons";

export default function AnalysisMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setIsModalVisible(false);
        props.onClickOk()
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const dispatch = useDispatch();

    const clickParams = function () {
        setIsModalVisible(true);
    }

    const clickAddStep = function (stepId, type, resultId) {
        const stepObj = {stepId: stepId, resultId: resultId, newStep: {type: type}}
        dispatch(addAnalysisStep(stepObj))
    }

    const analysisMenuList = (
        <Menu>
            <Menu.Item onClick={() => clickAddStep(props.stepId, "quality-control", props.resultId)}
                       key={'quality-control'}>
                <span>Quality control</span>
            </Menu.Item>
            <Menu.Item onClick={() => clickAddStep(props.stepId, "boxplot", props.resultId)}
                       key={'boxplot'}>
                <span>Boxplot</span>
            </Menu.Item>
        </Menu>
    )

    const buttonsDisabled = props.status !== "done"

    return (
        <>
            <Rate count={1}/>
            <Button type={"text"} icon={<SettingOutlined/>} disabled={buttonsDisabled}
                    onClick={() => clickParams()}></Button>
            <Button type={"text"} icon={<BarChartOutlined/>} disabled={buttonsDisabled}></Button>
            <Dropdown overlay={analysisMenuList} placement="bottomLeft"
                      arrow disabled={buttonsDisabled}>
                <Button type={"text"} icon={<PlusCircleOutlined/>}></Button>
            </Dropdown>
            <Modal title="Parameters" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1000}
            >
                {props.paramComponent}
            </Modal>
        </>


    );
}
