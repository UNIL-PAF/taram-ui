import React, {useState} from "react";
import {Button, Dropdown, Menu, message, Modal, Popconfirm, Rate} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep, deleteAnalysisStep} from "./BackendAnalysisSteps";
import {DeleteOutlined, PlusCircleOutlined, SettingOutlined, ZoomInOutlined} from "@ant-design/icons";

export default function AnalysisStepMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setIsModalVisible(false);
        props.onClickOk()
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const confirmDelete = (stepId) => {
        deleteAnalysisStep(stepId)
        message.success('Delete step.');
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
            <Menu.Item onClick={() => clickAddStep(props.stepId, "transformation", props.resultId)}
                       key={'transformation'}>
                <span>Transformation</span>
            </Menu.Item>
        </Menu>
    )

    const buttonsDisabled = props.status !== "done"

    return (
        <>
            <span>{props.status}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Rate count={1}/>
            <Popconfirm
                title="Are you sure to delete this step?"
                onConfirm={() => confirmDelete(props.stepId)}
                okText="Yes"
                cancelText="Cancel"
            >
                <Button type={"text"} icon={<DeleteOutlined/>} disabled={buttonsDisabled}></Button>
            </Popconfirm>

            <Button type={"text"} icon={<ZoomInOutlined/>} disabled={buttonsDisabled}></Button>
            <Button type={"text"} icon={<SettingOutlined/>} disabled={buttonsDisabled}
                    onClick={() => clickParams()}></Button>
            <Dropdown overlay={analysisMenuList} placement="bottomLeft"
                      arrow disabled={buttonsDisabled}>
                <Button type={"text"} icon={<PlusCircleOutlined/>}></Button>
            </Dropdown>
            <Modal title="Parameters" visible={isModalVisible} onOk={() => handleOk()} onCancel={() => handleCancel()} width={1000}
            >
                {props.paramComponent}
            </Modal>
        </>


    );
}
