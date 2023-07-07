import React, {useEffect, useState} from "react";
import {Button, Dropdown, Modal, Tag} from 'antd';
import {ClockCircleOutlined, DownloadOutlined, SyncOutlined} from "@ant-design/icons";
import AnalysisStepMenuItems from "./AnalysisStepMenuItems";
import {useDispatch, useSelector} from "react-redux";
import {setStopMenuShortcut} from "../../analysis/analysisSlice";

export default function AnalysisStepMenu(props) {
    const dispatch = useDispatch();

    const [menuIsVisible, setMenuIsVisible] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [showMenuItem, setShowMenuItem] = useState()
    const stopMenuShortcut = useSelector(state => state.analysis.stopMenuShortcut)

    useEffect(() => {
        if(showTable){
            dispatch(setStopMenuShortcut(true))
        }else{
            dispatch(setStopMenuShortcut(false))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTable])

    // If pressed key is our target key then set to true
    function downHandler(key) {
        if(key.key.toLowerCase() === "a" && key.shiftKey){
            setMenuIsVisible(true)
            setShowMenuItem("add-step")
        }
    }

    // Add event listeners
    useEffect(() => {
        if(props.isSelected && ! stopMenuShortcut){
            window.addEventListener("keydown", downHandler);
            // Remove event listeners on cleanup
            return () => {
                window.removeEventListener("keydown", downHandler);
            };
        }
    }, [props.isSelected, props.stepId, stopMenuShortcut]);

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

            <Dropdown visible={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                      overlay={<AnalysisStepMenuItems
                                                      type={props.paramType}
                                                      showMenuItem={showMenuItem}
                                                      setShowMenuItem={setShowMenuItem}
                                                      stepId={props.stepId}
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
                                                      hasPlot={props.hasPlot}
                                                      experimentDetails={props.experimentDetails}
                                                      resType={props.resType}
                                                      resultId={props.resultId}></AnalysisStepMenuItems>}
                      placement="bottomLeft"
                      arrow>
                <Button type={"primary"} shape={"round"} size="small">Menu</Button>
            </Dropdown>
        </>


    );
}
