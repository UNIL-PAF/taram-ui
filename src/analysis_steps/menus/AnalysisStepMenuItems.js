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
import DownloadZipModal from "./DownloadZipModal"
import RemoveImputedParams from "../remove_imputed/RemoveImputedParams"
import RemoveColumnsParams from "../remove_columns/RemoveColumnsParams"
import PcaPlotParams from "../pca/PcaPlotParams";
import ScatterPlotParams from "../scatter_plot/ScatterPlotParams";

export default function AnalysisStepMenuItems(props) {
    const [showModalName, setShowModalName] = useState()
    const [showStepParams, setShowStepParams] = useState(undefined)
    const [newStepParams, setNewStepParams] = useState(null)
    const [startDownload, setStartDownload] = useState(undefined)
    const dispatch = useDispatch();

    useEffect(() => {
        if (startDownload === false) {
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
            default:
                setStartDownload(true)
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
            default:
                return null
        }
    }

    const closeMenu = () => {
        props.setMenuIsVisible(false)
    }

    const analysisParamList = (type, isNew) => {
        // eslint-disable-next-line
        switch (type) {
            case 'remove-columns':
                return <RemoveColumnsParams commonResult={props.commonResult}
                                            params={isNew ? newStepParams : props.stepParams}
                                            setParams={isNew ? setNewStepParams : props.setStepParams}
                                            intCol={props.intCol}
                                            stepId={props.stepId}
                ></RemoveColumnsParams>
            case 'remove-imputed':
                return <RemoveImputedParams commonResult={props.commonResult}
                                            params={isNew ? newStepParams : props.stepParams}
                                            setParams={isNew ? setNewStepParams : props.setStepParams}
                                            intCol={props.intCol}
                                            stepId={props.stepId}
                ></RemoveImputedParams>
            case 'boxplot':
                return <BoxPlotParams commonResult={props.commonResult}
                                      params={isNew ? newStepParams : props.stepParams}
                                      setParams={isNew ? setNewStepParams : props.setStepParams}
                                      intCol={props.intCol}
                                      stepId={props.stepId}
                ></BoxPlotParams>
            case 'pca':
                return <PcaPlotParams commonResult={props.commonResult}
                                      params={isNew ? newStepParams : props.stepParams}
                                      setParams={isNew ? setNewStepParams : props.setStepParams}
                                      intCol={props.intCol}
                                      stepId={props.stepId}
                ></PcaPlotParams>
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
                                    experimentDetails={props.experimentDetails}
                                    intCol={props.intCol}
                ></TTestParams>
            case 'volcano-plot':
                return <VolcanoPlotParams commonResult={props.commonResult}
                                          params={isNew ? newStepParams : props.stepParams}
                                          setParams={isNew ? setNewStepParams : props.setStepParams}
                ></VolcanoPlotParams>
            case 'scatter-plot':
                return <ScatterPlotParams commonResult={props.commonResult}
                                          params={isNew ? newStepParams : props.stepParams}
                                          setParams={isNew ? setNewStepParams : props.setStepParams}
                                          intCol={props.intCol}
                ></ScatterPlotParams>
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

    const getModalWidth = function (name) {
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
                    <Menu.SubMenu key={"sub-2"} title={"Filter & transform"}>
                        <Menu.Item onClick={() => clickAddStep("remove-columns")}
                                   className="narrow-menu"
                                   key={'remove-columns'}>
                            <span>Remove columns</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("transformation")}
                                   className="narrow-menu"
                                   key={'transformation'}>
                            <span>Transformation</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("filter")}
                                   className="narrow-menu"
                                   key={'filter'}>
                            <span>Filter</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("group-filter")}
                                   className="narrow-menu"
                                   key={'group-filter'}>
                            <span>Filter on valid</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("remove-imputed")}
                                   className="narrow-menu"
                                   key={'remove-imputed'}>
                            <span>Remove imputed values</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"sub-1"} title={"Plots"} >
                        <Menu.Item onClick={() => clickAddStep("scatter-plot")}
                                   className="narrow-menu"
                                   key={'scatter-plot'}>
                            <span>Scatter plot</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("boxplot")}
                                   className="narrow-menu"
                                   key={'boxplot'}>
                            <span>Boxplot</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("pca")}
                                   className="narrow-menu"
                                   key={'pca'}>
                            <span>PCA</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("volcano-plot")}
                                   className="narrow-menu"
                                   key={'volcano-plot'}>
                            <span>Volcano plot</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"sub-3"} title={"Statistical tests"}>
                        <Menu.Item onClick={() => clickAddStep("t-test")}
                                   className="narrow-menu"
                                   key={'t-test'}>
                            <span>t-test</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu.SubMenu>
                {(props.type === 'boxplot' || props.type === 'volcano-plot') &&
                    <div><Menu.Divider key={'divider-2'}></Menu.Divider>
                        <Menu.Item onClick={() => setShowModalName('download-zip')}
                                   key={'zip'}
                        >
                            <span>Download ZIP..</span>
                        </Menu.Item></div>}
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
