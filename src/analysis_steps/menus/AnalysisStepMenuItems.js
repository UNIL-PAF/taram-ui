import React, {useEffect, useState} from "react";
import {Button, Menu, message, Modal, Popconfirm} from "antd";
import {useDispatch} from "react-redux";
import '../../analysis/analysis.css'
import {CloseOutlined} from "@ant-design/icons";
import {addAnalysisStep, deleteAnalysisStep, setStepParameters} from "../BackendAnalysisSteps";
import {clearTable} from "../../protein_table/proteinTableSlice";
import BoxPlotParams from "../boxplot/BoxPlotParams";
import FilterParams from "../filter/FilterParams";
import GroupFilterParams from "../group_filter/GroupFilterParams";
import TransformationParams from "../transformation/TransformationParams";
import TTestParams from "../t_test/TTestParams";
import VolcanoPlotParams from "../volcano_plot/VolcanoPlotParams";
import DownloadTableModal from "./DownloadTableModal"
import DownloadZipModal from "./DownloadZipModal"

export default function AnalysisStepMenuItems(props) {
    const [showModalName, setShowModalName] = useState()
    const [showStepParams, setShowStepParams] = useState(undefined)
    const [newStepParams, setNewStepParams] = useState(null)
    const [startDownload, setStartDownload] = useState(undefined)
    const dispatch = useDispatch();

    useEffect(() => {
        if(startDownload === false){
            setStartDownload(undefined)
            setShowModalName(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDownload])


    const handleOk = (name) => {
        switch (name) {
            case 'parameters':
                handleParamsOk()
                break;
            default: setStartDownload(true)
        }
    }

    const handleParamsOk = () => {
        dispatch(clearTable())
        setShowModalName(undefined)
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
        setShowModalName(undefined)
        setShowStepParams(undefined)
        setNewStepParams(null)
        dispatch(clearTable())
    };

    const confirmDelete = () => {
        dispatch(deleteAnalysisStep({stepId: props.stepId, resultId: props.resultId}))
        message.success('Delete ' + getType() + '.');
    };

    const showModal = (name) => {
        switch (name) {
            case 'parameters':
                return showStepParams ? analysisParamList(showStepParams, true) : analysisParamList(props.paramType, false)
            case 'download-table':
                return <DownloadTableModal
                    stepId={props.stepId}
                    setStartDownload={setStartDownload}
                    startDownload={startDownload}
                    tableNr={props.tableNr}
                    hasImputed={props.hasImputed}>
                </DownloadTableModal>
            case 'download-zip':
                return <DownloadZipModal
                    stepId={props.stepId}
                    type={props.type}
                    setStartDownload={setStartDownload}
                    startDownload={startDownload}
                    tableNr={props.tableNr}
                    hasPlot={props.hasPlot}
                    hasImputed={props.hasImputed}>
                ></DownloadZipModal>
            default: return null
        }
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
        setShowModalName('parameters')
    }

    const getModalTitle = function (name) {
        switch (name) {
            case 'parameters':
                return 'Parameters'
            case 'download-table':
                return 'Download table'
            case 'download-zip':
                return 'Download ZIP'
            default:
                return ''
        }
    }

    const getModalWidth = function(name){
        switch (name) {
            case 'download-table':
                return 300;
            default:
                return 1000;
        }
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
                {props.type && <Menu.Item onClick={() => setShowModalName('parameters')}
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
                <Menu.Item onClick={() => setShowModalName('download-zip')}
                           key={'zip'}
                >
                    <span>Download ZIP..</span>
                </Menu.Item>
                {props.tableNr && <Menu.Item onClick={() => setShowModalName('download-table')}
                           key={'table'}
                >
                    <span>Download table..</span>
                </Menu.Item>}
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
            <Modal title={getModalTitle(showModalName)} visible={showModalName} onOk={() => handleOk(showModalName)}
                   onCancel={() => handleCancel()}
                   width={getModalWidth(showModalName)}
            >
                {showModal(showModalName)}
            </Modal>
        </div>


    )
        ;
}