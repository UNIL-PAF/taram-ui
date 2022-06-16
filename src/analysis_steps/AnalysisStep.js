import React from "react";
import InitialResult from "./initial_result/InitialResult";
import QualityControl from "./quality_control/QualityControl";
import {DeleteOutlined, FilePdfOutlined, PlayCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {Button, Dropdown, Menu, message, Popconfirm} from "antd";
import BoxPlot from "./boxplot/BoxPlot";
import './AnalysisStep.css'
import Transformation from "./transformation/Transformation";
import axios from "axios";
import globalConfig from "../globalConfig";
import {deleteAnalysis} from "../analysis/BackendAnalysis";

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

    const confirmDelete = (analysisId) => {
        deleteAnalysis(analysisId)
        message.success('Delete step.');
    };

    const downloadPdf = (analysisId) => {
        fetch(globalConfig.urlBackend + 'analysis/pdf/' + analysisId)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'analysis_' + analysisId + '.pdf';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    return (<div className={"analysis-col"}>
            <h3>Analysis #{props.data.idx + 1} <span style={{float: "right"}}>
                <Popconfirm
                    title="Are you sure to delete this analysis?"
                    onConfirm={() => confirmDelete(props.data.id)}
                    okText="Yes"
                    cancelText="Cancel"
                >
                <Button type={"text"} icon={<DeleteOutlined style={{fontSize: '24px'}}/>}></Button>
            </Popconfirm>
                <SaveOutlined style={{fontSize: '24px'}}/>
                &nbsp;
                <PlayCircleOutlined style={{fontSize: '24px'}}/>
                &nbsp;
                <FilePdfOutlined onClick={() => downloadPdf(props.data.id)} style={{fontSize: '24px'}}/>
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
