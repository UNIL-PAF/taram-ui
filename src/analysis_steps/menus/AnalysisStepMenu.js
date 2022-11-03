import React, {useState} from "react";
import {Button, Dropdown, Modal, Tag} from 'antd';
import {ClockCircleOutlined, EllipsisOutlined, SyncOutlined} from "@ant-design/icons";
import AnalysisStepMenuItems from "./AnalysisStepMenuItems";

export default function AnalysisStepMenu(props) {
    const [menuIsVisible, setMenuIsVisible] = useState(false)

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
            {props.status === 'done' && props.tableNr &&
                <span style={{marginRight: "160px"}}><Tag>{'Table: M' + props.tableNr}</Tag></span>}
            <span style={{marginRight: "35px"}}>{statusTag()}</span>
            <Dropdown visible={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                      overlay={<AnalysisStepMenuItems type={props.paramType} stepId={props.stepId}
                                                      tableNr={props.tableNr}
                                                      setMenuIsVisible={setMenuIsVisible}
                                                      commonResult={props.commonResult}
                                                      params={props.stepParams}
                                                      setParams={props.setStepParams}
                                                      intCol={props.intCol}
                                                      paramType={props.paramType}
                                                      prepareParams={props.prepareParams}
                                                      stepParams={props.stepParams}
                                                      setStepParams={props.setStepParams}
                                                      hasImputed={props.hasImputed}
                                                      resultId={props.resultId}></AnalysisStepMenuItems>}
                      placement="bottomLeft"
                      arrow>
                <Button type={"default"} size="small" icon={<EllipsisOutlined/>}></Button>
            </Dropdown>

        </>


    );
}
