import React from "react";
import InitialResult from "./initial_result/InitialResult";
import QualityControl from "./quality_control/QualityControl";
import {FilePdfOutlined, PlayCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {Button, Dropdown, Menu} from "antd";
import BoxPlot from "./boxplot/BoxPlot";
import './AnalysisStep.css'
import Transformation from "./transformation/Transformation";
import axios from "axios";
import globalConfig from "../globalConfig";

export default function AnalysisStep(props) {

    const clickDuplicate = () => {
        axios.post(globalConfig.urlBackend + "analysis/duplicate/" + props.data.id)
    }

    const clickCopy = () => {
        axios.post(globalConfig.urlBackend + "analysis/copy/" + props.data.id)
    }

    const analysisMenuList = (
        <Menu>
            <Menu.Item onClick={() => clickDuplicate()}
                       key={'copy-current'}>
                <span>Copy current Analysis</span>
            </Menu.Item>
            <Menu.Item onClick={() => clickCopy()}
                       key={'start-new'}>
                <span>Start new Analysis</span>
            </Menu.Item>
        </Menu>
    )


    return (<div className={"analysis-col"}>
            <h3>Analysis #{props.data.idx + 1} <span style={{float: "right"}}>
                <SaveOutlined style={{fontSize: '24px'}}/>
                &nbsp;
                <PlayCircleOutlined style={{fontSize: '24px'}}/>
                &nbsp;
                <FilePdfOutlined style={{fontSize: '24px'}}/>
                &nbsp;
                <Dropdown overlay={analysisMenuList} placement="bottomLeft"
                          arrow>
                <Button type={"text"} icon={<PlusOutlined style={{fontSize: '24px'}}/>}></Button>
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
