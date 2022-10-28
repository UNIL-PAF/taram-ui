import React, {useState} from "react";
import {Button, Dropdown, Menu, Modal, Tag} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep, setStepParameters} from "./BackendAnalysisSteps";
import {clearTable} from "../protein_table/proteinTableSlice"
import {
    ClockCircleOutlined,
    EllipsisOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    SyncOutlined
} from "@ant-design/icons";
import BoxPlotParams from "./boxplot/BoxPlotParams";
import FilterParams from "./filter/FilterParams";
import GroupFilterParams from "./group_filter/GroupFilterParams";
import TransformationParams from "./transformation/TransformationParams";
import TTestParams from "./t_test/TTestParams";
import VolcanoPlotParams from "./volcano_plot/VolcanoPlotParams";
import globalConfig from "../globalConfig";
import AnalysisStepMenuItems from "./AnalysisStepMenuItems";

export default function AnalysisStepMenu(props) {
    const [menuIsVisible, setMenuIsVisible] = useState(false)
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

    const clickParams = function () {
        setIsModalVisible(true);
    }

    const clickAddStep = function (type) {
        setShowStepParams(type)
        setIsModalVisible(true)
    }

    const analysisMenuList = (
        <Menu>
            <div style={{paddingLeft: '10px'}}>
                <span className={"analysis-menu-title"}>Add a following step</span>
            </div>
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

    const showModal = () => {
        return showStepParams ? analysisParamList(showStepParams, true) : analysisParamList(props.paramType, false)
    }

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis-step/table/' + props.stepId)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'M' + props.tableNr + '.txt';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    return (
        <>
            {props.status === 'done' && props.tableNr && <span style={{marginRight: "70px"}}><Button
                type="dashed" size="small" onClick={downloadTable}>{'M' + props.tableNr}</Button></span>}
            <span style={{marginRight: "35px"}}>{statusTag()}</span>
            <Dropdown visible={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                      overlay={<AnalysisStepMenuItems type={props.paramType} stepId={props.stepId} setMenuIsVisible={setMenuIsVisible}
                                             resultId={props.resultId}></AnalysisStepMenuItems>}
                      placement="bottomLeft"
                      arrow>
                <Button type={"text"} icon={<EllipsisOutlined/>}></Button>
            </Dropdown>
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
        </>


    );
}
