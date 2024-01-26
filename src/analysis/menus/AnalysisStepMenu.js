import React, {useState} from "react";
import {Button, Dropdown, Modal, Tag} from 'antd';
import {ClockCircleOutlined, SyncOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import AnalysisStepMenuItems from "./AnalysisStepMenuItems";

export default function AnalysisStepMenu(props) {
    const [menuIsVisible, setMenuIsVisible] = useState(false)
    const [showMenuItem, setShowMenuItem] = useState()

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

    return (
        <>
            {props.status !== 'done' && <span style={{marginRight: "180px"}}>{statusTag()}</span>}

            <Dropdown open={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                      overlay={<AnalysisStepMenuItems
                                                      type={props.paramType}
                                                      showMenuItem={showMenuItem}
                                                      setShowMenuItem={setShowMenuItem}
                                                      stepId={props.stepId}
                                                      tableNr={props.tableNr}
                                                      setMenuIsVisible={setMenuIsVisible}
                                                      commonResult={props.commonResult}
                                                      commonResBefore={props.commonResBefore}
                                                      params={props.stepParams}
                                                      setParams={props.setStepParams}
                                                      intCol={props.intCol}
                                                      paramType={props.paramType}
                                                      prepareParams={props.prepareParams}
                                                      stepParams={props.stepParams}
                                                      setStepParams={props.setStepParams}
                                                      hasImputed={props.hasImputed}
                                                      hasPlot={props.hasPlot}
                                                      experimentDetails={props.experimentDetails}
                                                      resType={props.resType}
                                                      isLocked={props.isLocked}
                                                      resultId={props.resultId}></AnalysisStepMenuItems>}
                      placement="bottomLeft"
                      arrow>
                <Button type={"primary"} icon={<MenuUnfoldOutlined />}></Button>
            </Dropdown>
        </>


    );
}
