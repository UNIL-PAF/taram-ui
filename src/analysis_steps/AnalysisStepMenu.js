import React, {useState} from "react";
import {Button, Dropdown, Menu, message, Modal, Popconfirm, Rate, Tag} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep, deleteAnalysisStep, setStepParameters} from "./BackendAnalysisSteps";
import {clearTable} from "../protein_table/proteinTableSlice"
import {
    ClockCircleOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    SyncOutlined,
    ZoomInOutlined
} from "@ant-design/icons";
import BoxPlotParams from "./boxplot/BoxPlotParams";
import FilterParams from "./filter/FilterParams";
import GroupFilterParams from "./group_filter/GroupFilterParams";
import TransformationParams from "./transformation/TransformationParams";
import TTestParams from "./t_test/TTestParams";
import VolcanoPlotParams from "./volcano_plot/VolcanoPlotParams";
import ReactECharts from "echarts-for-react";

export default function AnalysisStepMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showStepParams, setShowStepParams] = useState(undefined)
    const [newStepParams, setNewStepParams] = useState(null)
    const [showZoom, setShowZoom] = useState(null)

    const dispatch = useDispatch();

    const handleOk = () => {
        dispatch(clearTable())
        setIsModalVisible(false);
        // parameters for existing step
        if (!showStepParams) {
            const params = props.prepareParams ? props.prepareParams(props.stepParams) : props.stepParams

            dispatch(setStepParameters({
                resultId: props.resultId,
                stepId: props.stepId,
                params: params
            }))

            // parameters for new step
        } else {
            const stepObj = {
                stepId: props.stepId,
                resultId: props.resultId,
                newStep: {type: showStepParams, params: JSON.stringify(newStepParams)}
            }
            dispatch(addAnalysisStep(stepObj))
            setShowStepParams(undefined)
        }

    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setShowStepParams(undefined)
        setNewStepParams(null)
        dispatch(clearTable())
    };

    const confirmDelete = (stepId) => {
        dispatch(deleteAnalysisStep({stepId: stepId, resultId: props.resultId}))
        message.success('Delete step.');
    };

    const clickParams = function () {
        setIsModalVisible(true);
    }

    const clickAddStep = function (type) {
        setShowStepParams(type)
        setIsModalVisible(true)
    }

    const analysisMenuList = (
        <Menu>
            <Menu.Item onClick={() => clickAddStep("quality-control")}
                       key={'quality-control'} disabled={true}>
                <span>Quality control</span>
            </Menu.Item>
            <Menu.SubMenu key={"sub-1"} title={"Plots"}>
                <Menu.Item onClick={() => clickAddStep("boxplot")}
                           key={'boxplot'}>
                    <span>Boxplot</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickAddStep("volcano-plot")}
                           key={'volcano-plot'}>
                    <span>Volcano plot</span>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key={"sub-2"} title={"Filter & transform"}>
                <Menu.Item onClick={() => clickAddStep("transformation")}
                           key={'transformation'}>
                    <span>Transformation</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickAddStep("filter")}
                           key={'filter'}>
                    <span>Filter</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickAddStep("group-filter")}
                           key={'group-filter'}>
                    <span>Filter on valid</span>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key={"sub-3"} title={"Statistical tests"}>
                <Menu.Item onClick={() => clickAddStep("t-test")}
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

    const analysisParamList = (type, isNew) => {
        // eslint-disable-next-line
        switch (type) {
            case 'boxplot':
                return <BoxPlotParams commonResult={props.commonResult}
                                      params={isNew ? newStepParams : props.stepParams}
                                      setParams={isNew ? setNewStepParams : props.setStepParams}
                                      intCol={props.intCol}
                                      stepId={props.stepId}
                ></BoxPlotParams>
            case 'filter':
                return <FilterParams commonResult={props.commonResult}
                                     params={isNew ? newStepParams : props.stepParams}
                                     setParams={isNew ? setNewStepParams : props.setStepParams}
                                     intCol={props.intCol}
                ></FilterParams>
            case 'group-filter':
                return <GroupFilterParams commonResult={props.commonResult}
                                          params={isNew ? newStepParams: props.stepParams}
                                          setParams={isNew ? setNewStepParams: props.setStepParams}
                                          intCol={props.intCol}
                ></GroupFilterParams>
            case 'transformation':
                return <TransformationParams commonResult={props.commonResult}
                                             params={isNew ? newStepParams: props.stepParams}
                                             setParams={isNew ? setNewStepParams: props.setStepParams}
                                             intCol={props.intCol}
                ></TransformationParams>
            case 't-test':
                return <TTestParams commonResult={props.commonResult}
                                    params={isNew ? newStepParams: props.stepParams}
                                    setParams={isNew ? setNewStepParams: props.setStepParams}
                                    intCol={props.intCol}
                ></TTestParams>
            case 'volcano-plot':
                return <VolcanoPlotParams commonResult={props.commonResult}
                                          params={isNew ? newStepParams: props.stepParams}
                                          setParams={isNew ? setNewStepParams: props.setStepParams}
                ></VolcanoPlotParams>
        }
    }

    const showModal = () => {
        return showStepParams ? analysisParamList(showStepParams, true) : analysisParamList(props.paramType, false)
    }

    const showZoomModal = () => {
        return <>
            {props.echartOptions &&
                <div>
                    <ReactECharts
                        option={{
                            ...props.echartOptions, toolbox: {
                                feature: {
                                    dataZoom: {},
                                    saveAsImage: {
                                        name: props.paramType + "_" + props.stepId
                                    }
                                }
                            }
                        }}
                        style={{
                            height: '500px',
                            width: '100%',
                        }}
                    />
                </div>}
        </>
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
                <Button type={"text"} icon={<DeleteOutlined/>}
                        style={{visibility: `${props.hideDeleteButton !== undefined ? 'hidden' : 'visible'}`}}/>
            </Popconfirm>

            <Button onClick={() => setShowZoom(true)} type={"text"} icon={<ZoomInOutlined/>} disabled={buttonsDisabled}
                    style={{visibility: `${props.hideZoomButton !== undefined ? 'hidden' : 'visible'}`}}></Button>
            <Button type={"text"} icon={<SettingOutlined/>} disabled={buttonsDisabled}
                    style={{visibility: `${props.hideSettingButton !== undefined ? 'hidden' : 'visible'}`}}
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
            <Modal title="Plot" visible={showZoom} onOk={() => setShowZoom(false)} onCancel={() => setShowZoom(false)}
                   width={"95%"} height={"95%"}
            >
                {showZoomModal()}
            </Modal>
        </>


    );
}
