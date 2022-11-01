import React, {useState} from "react";
import globalConfig from "../globalConfig";
import {Button, Menu, message, Modal, Popconfirm} from "antd";
import {useDispatch} from "react-redux";
import '../analysis/analysis.css'
import {CloseOutlined} from "@ant-design/icons";
import {addAnalysisStep, deleteAnalysisStep, setStepParameters} from "./BackendAnalysisSteps";
import {clearTable} from "../protein_table/proteinTableSlice";
import BoxPlotParams from "./boxplot/BoxPlotParams";
import FilterParams from "./filter/FilterParams";
import GroupFilterParams from "./group_filter/GroupFilterParams";
import TransformationParams from "./transformation/TransformationParams";
import TTestParams from "./t_test/TTestParams";
import VolcanoPlotParams from "./volcano_plot/VolcanoPlotParams";

export default function AnalysisStepMenuItems(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showStepParams, setShowStepParams] = useState(undefined)
    const [newStepParams, setNewStepParams] = useState(null)
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

    const confirmDelete = () => {
        dispatch(deleteAnalysisStep({stepId: props.stepId, resultId: props.resultId}))
        message.success('Delete ' + getType() + '.');
    };

    const clickParams = function () {
        setIsModalVisible(true);
    }

    const downloadPdf = () => {
        fetch(globalConfig.urlBackend + 'analysis/pdf/' + props.analysisId)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'analysis_' + props.analysisId + '.pdf';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }


    const showModal = () => {
        return showStepParams ? analysisParamList(showStepParams, true) : analysisParamList(props.paramType, false)
    }

    const closeMenu = () => {
        props.setMenuIsVisible(false)
    }

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
                                          params={isNew ? newStepParams : props.stepParams}
                                          setParams={isNew ? setNewStepParams : props.setStepParams}
                                          intCol={props.intCol}
                ></GroupFilterParams>
            case 'transformation':
                return <TransformationParams commonResult={props.commonResult}
                                             params={isNew ? newStepParams : props.stepParams}
                                             setParams={isNew ? setNewStepParams : props.setStepParams}
                                             intCol={props.intCol}
                ></TransformationParams>
            case 't-test':
                return <TTestParams commonResult={props.commonResult}
                                    params={isNew ? newStepParams : props.stepParams}
                                    setParams={isNew ? setNewStepParams : props.setStepParams}
                                    intCol={props.intCol}
                ></TTestParams>
            case 'volcano-plot':
                return <VolcanoPlotParams commonResult={props.commonResult}
                                          params={isNew ? newStepParams : props.stepParams}
                                          setParams={isNew ? setNewStepParams : props.setStepParams}
                ></VolcanoPlotParams>
        }
    }

    const getType = () => {
        if (props.type) {
            return props.type.charAt(0).toUpperCase() + props.type.slice(1)
        } else {
            return "Initial result"
        }
    }

    const clickAddStep = function (type) {
        setShowStepParams(type)
        setIsModalVisible(true)
    }

    return (
        <div align={"center"} className={"analysis-menu"} style={{minWidth: '200px'}}>
            <div><span className={"analysis-menu-title"}>{getType()} menu</span><Button
                className={"analysis-menu-close"}
                onClick={() => closeMenu()}
                type={"text"}
                icon={<CloseOutlined/>}></Button>
            </div>
            <Menu selectable={false} onClick={() => closeMenu()} style={{minWidth: "250px"}}>
                {props.type &&<Menu.Item onClick={() => clickParams()}
                           key={'params'}
                >
                    <span>Change parameters..</span>
                </Menu.Item>}
                <Menu.SubMenu key={"sub-0"} title={"Add a following step"}>
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
                </Menu.SubMenu>
                <Menu.Divider key={'divider-2'}></Menu.Divider>
                <Menu.Item onClick={() => downloadPdf()}
                           key={'zip'}
                >
                    <span>Download ZIP..</span>
                </Menu.Item>
                <Menu.Item onClick={() => downloadPdf()}
                           key={'table'}
                >
                    <span>Download table..</span>
                </Menu.Item>
                <Menu.Divider key={'divider-3'}></Menu.Divider>
                {props.type && <Menu.Item key={'delete-analysis'} danger={true}>
                    <Popconfirm
                        title={"Are you sure you want to delete this " + getType() + "?"}
                        onConfirm={() => confirmDelete()}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <span>Delete {getType()}</span>
                    </Popconfirm>
                </Menu.Item>}
            </Menu>
            <Modal title="Parameters" visible={isModalVisible} onOk={() => handleOk()} onCancel={() => handleCancel()}
                   width={1000}
            >
                {showModal()}
            </Modal>
        </div>


    )
        ;
}
