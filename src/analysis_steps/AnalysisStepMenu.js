import React, {useState} from "react";
import {Button, Dropdown, Menu, message, Modal, Popconfirm, Rate, Tag} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep, deleteAnalysisStep} from "./BackendAnalysisSteps";
import {DeleteOutlined, PlusCircleOutlined, SettingOutlined, ZoomInOutlined, ClockCircleOutlined, SyncOutlined} from "@ant-design/icons";

export default function AnalysisStepMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useDispatch();

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

    const buttonsDisabled = (props.status === "running" || props.status === "idle")

    const statusTag = () => {
        if(props.status === "idle"){
            return  <Tag icon={<ClockCircleOutlined />} color="warning">
                waiting
            </Tag>
        }else if(props.status === "error"){
            return  <Tag onClick={error} color="error" style={{cursor: "pointer"}}>
                Error
            </Tag>
        }else if (props.status === "running"){
            return <Tag icon={<SyncOutlined spin />} color="processing">
                Running
            </Tag>
        }else return null
    }

    const error = () => {
        Modal.error({
            title: 'Error message',
            content: props.error,
        });
    };

    return (
        <>
            <span style={{marginRight: "35px"}}>{statusTag()}</span>
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
