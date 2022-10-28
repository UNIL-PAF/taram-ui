import React, {useState} from "react";
import {Button, Dropdown, Modal, Tag} from 'antd';
import {useDispatch} from "react-redux";
import {addAnalysisStep, setStepParameters} from "./BackendAnalysisSteps";
import {clearTable} from "../protein_table/proteinTableSlice"
import {ClockCircleOutlined, EllipsisOutlined, SyncOutlined} from "@ant-design/icons";
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
//    const [showStepParams, setShowStepParams] = useState(undefined)
//    const [newStepParams, setNewStepParams] = useState(null)

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
                      overlay={<AnalysisStepMenuItems type={props.paramType} stepId={props.stepId}
                                                      setMenuIsVisible={setMenuIsVisible}
                                                      setIsModalVisible={setIsModalVisible}
                                                      commonResult={props.commonResult}
                                                      params={props.stepParams}
                                                      setParams={props.setStepParams}
                                                      intCol={props.intCol}
                                                      paramType={props.paramType}
                                                      prepareParams={props.prepareParams}
                                                      stepParams={props.stepParams}
                                                      setStepParams={props.setStepParams}
                                                      resultId={props.resultId}></AnalysisStepMenuItems>}
                      placement="bottomLeft"
                      arrow>
                <Button type={"default"} size="small" icon={<EllipsisOutlined/>}></Button>
            </Dropdown>

        </>


    );
}
