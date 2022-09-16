import React, {useState} from "react";
import InitialResult from "./initial_result/InitialResult";
import QualityControl from "./quality_control/QualityControl";
import Filter from "./filter/Filter"
import {EllipsisOutlined} from "@ant-design/icons";
import {Button, Dropdown, Badge} from "antd";
import BoxPlot from "./boxplot/BoxPlot";
import './AnalysisStep.css'
import Transformation from "./transformation/Transformation";
import AnalysisMenu from "./AnalysisMenu";
import GroupFilter from "./group_filter/GroupFilter";
import TTest from "./t_test/TTest";
import VolcanoPlot from "./volcano_plot/VolcanoPlot";

export default function AnalysisSteps(props) {
    const [menuIsVisible, setMenuIsVisible] = useState(false)

    const badgeStatus = () => {
        switch (props.data.status) {
            case 'error':
                return 'error'
            case 'running':
                return 'processing'
            case 'idle':
                return 'warning'
            case 'done':
                return 'success'
            default:
                return 'default'
        }
    }

    return (
        <>
            {props.data && props.data.analysisSteps && <div className={"analysis-col"}>
                <h3>
                <span style={{float: "left", marginLeft: "10px"}}>
                    <Badge status={badgeStatus()}/>
                </span>
                    Analysis #{props.data.idx + 1}
                    <span style={{float: "right", marginRight: "10px"}}>
                <Dropdown visible={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                          overlay={<AnalysisMenu analysisId={props.data.id} setMenuIsVisible={setMenuIsVisible}
                                                 resultId={props.data.result.id} initialStep={props.data.analysisSteps[0]}></AnalysisMenu>}
                          placement="bottomLeft"
                          arrow>
                    <Button type={"text"} icon={<EllipsisOutlined style={{fontSize: '24px'}}/>}></Button>
                </Dropdown>

            </span>
                </h3>
                <div className={"analysis-col-content"}>
                    {props.data.analysisSteps && props.data.analysisSteps.map(step => {
                        switch (step.type) {
                            case 'initial-result':
                                return <InitialResult analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                      data={step} key={step.id}/>
                            case 'quality-control':
                                return <QualityControl analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                       data={step} key={step.id}/>
                            case 'boxplot':
                                return <BoxPlot analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                data={step} key={step.id}/>
                            case 'transformation':
                                return <Transformation analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                       data={step} key={step.id}/>
                            case 'filter':
                                return <Filter analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                               data={step} key={step.id}/>
                            case 'group-filter':
                                return <GroupFilter analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                    data={step} key={step.id}/>
                            case 't-test':
                                return <TTest analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                              data={step} key={step.id}/>
                            case 'volcano-plot':
                                return <VolcanoPlot analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                    data={step} key={step.id}/>

                            default:
                                return null
                        }
                    })}
                </div>
            </div>}
        </>
    );
}
