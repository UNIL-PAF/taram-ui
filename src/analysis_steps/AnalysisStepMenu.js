import React, {useState} from "react";
import {Button, Dropdown, Menu, message, Modal, Popconfirm, Rate, Tag} from 'antd';
import {useDispatch} from "react-redux";
import {deleteAnalysisStep, setStepParameters, addAnalysisStep} from "./BackendAnalysisSteps";
import {
    ClockCircleOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    SyncOutlined,
    ZoomInOutlined
} from "@ant-design/icons";
import BoxPlotParams from "./boxplot/BoxPlotParams";

export default function AnalysisStepMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showStepParams, setShowStepParams] = useState(undefined)
    const [newStepParams, setNewStepParams] = useState(null)
    const dispatch = useDispatch();

    const handleOk = () => {
        setIsModalVisible(false);
        if (!showStepParams) {
            dispatch(setStepParameters({
                resultId: props.resultId,
                stepId: props.stepId,
                params: {newStepParams}
            }))
        } else {
            const stepObj = {
                stepId: props.stepId,
                resultId: props.resultId,
                newStep: {type: showStepParams.type, params: JSON.stringify(newStepParams)}
            }
            console.log(stepObj)
            dispatch(addAnalysisStep(stepObj))
        }

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const confirmDelete = (stepId) => {
        dispatch(deleteAnalysisStep({stepId: stepId, resultId: props.resultId}))
        message.success('Delete step.');
    };

    const clickParams = function () {
        setIsModalVisible(true);
    }

    const clickAddStep = function (stepId, type, resultId) {
        const stepObj = {stepId: stepId, resultId: resultId, newStep: {type: type}}
        console.log(type)
        setShowStepParams(analysisParamList(type))
        setIsModalVisible(true)
    }

    const analysisMenuList = (
        <Menu>
            <Menu.Item onClick={() => clickAddStep(props.stepId, "quality-control", props.resultId)}
                       key={'quality-control'} disabled={true}>
                <span>Quality control</span>
            </Menu.Item>
            <Menu.SubMenu key={"sub-1"} title={"Plots"}>
                <Menu.Item onClick={() => clickAddStep(props.stepId, "boxplot", props.resultId)}
                           key={'boxplot'}>
                    <span>Boxplot</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickAddStep(props.stepId, "volcano-plot", props.resultId)}
                           key={'volcano-plot'}>
                    <span>Volcano plot</span>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key={"sub-2"} title={"Filter & transform"}>
                <Menu.Item onClick={() => clickAddStep(props.stepId, "transformation", props.resultId)}
                           key={'transformation'}>
                    <span>Transformation</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickAddStep(props.stepId, "filter", props.resultId)}
                           key={'filter'}>
                    <span>Filter</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickAddStep(props.stepId, "group-filter", props.resultId)}
                           key={'group-filter'}>
                    <span>Filter on valid</span>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key={"sub-3"} title={"Statistical tests"}>
                <Menu.Item onClick={() => clickAddStep(props.stepId, "t-test", props.resultId)}
                           key={'t-test'}>
                    <span>t-test</span>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    )

    const buttonsDisabled = (props.status === "running" || props.status === "idle")

    const statusTag = () => {
        if (props.status === "idle") {
            return <Tag icon={<ClockCircleOutlined/>} color="warning">
                Waiting
            </Tag>
        } else if (props.status === "error") {
            return <Tag onClick={error} color="error" style={{cursor: "pointer"}}>
                Error
            </Tag>
        } else if (props.status === "running") {
            return <Tag icon={<SyncOutlined spin/>} color="processing">
                Running
            </Tag>
        } else return null
    }

    const error = () => {
        Modal.error({
            title: 'Error message',
            content: props.error,
        });
    };

    const analysisParamList = (type) => {
        return {
            type: type, render: <BoxPlotParams analysisIdx={props.analysisIdx}
                                               params={props.params} commonResult={props.commonResult}
                                               setParams={setNewStepParams}
            ></BoxPlotParams>
        }
    }

    const showModal = () => {
        return showStepParams ? showStepParams.render : props.paramComponent
    }

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
            <Modal title="Parameters" visible={isModalVisible} onOk={() => handleOk()} onCancel={() => handleCancel()}
                   width={1000}
            >
                {showModal()}
            </Modal>
        </>


    );
}
