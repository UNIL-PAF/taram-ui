import React from "react";
import InitialResult from "./initial_result/InitialResult";
import QualityControl from "./quality_control/QualityControl";
import {EllipsisOutlined} from "@ant-design/icons";
import {Button, Dropdown} from "antd";
import BoxPlot from "./boxplot/BoxPlot";
import './AnalysisStep.css'
import Transformation from "./transformation/Transformation";
import AnalysisMenu from "./AnalysisMenu";

export default function AnalysisStep(props) {

    return (<div className={"analysis-col"}>
            <h3>Analysis #{props.data.idx + 1} <span style={{float: "right"}}>
                <Dropdown trigger={['click']} overlay={<AnalysisMenu analysisId={props.data.id}></AnalysisMenu>} placement="bottomLeft"
                          arrow>
                    <Button type={"text"} icon={<EllipsisOutlined style={{fontSize: '24px'}}/>}></Button>
                </Dropdown>

            </span></h3>
            <div>
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
                        default:
                            return null
                    }
                })}
            </div>
        </div>

    );
}
