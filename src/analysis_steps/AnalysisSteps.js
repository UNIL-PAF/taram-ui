import React, {useState} from "react";
import InitialResult from "./initial_result/InitialResult";
import Filter from "./filter/Filter"
import {BarsOutlined} from "@ant-design/icons";
import {Alert, Badge, Button, Dropdown} from "antd";
import BoxPlot from "./boxplot/BoxPlot";
import './AnalysisStep.css'
import LogTransformation from "./log_transformation/LogTransformation";
import Imputation from "./imputation/Imputation";
import AnalysisMenu from "./menus/AnalysisMenu";
import GroupFilter from "./group_filter/GroupFilter";
import TTest from "./t_test/TTest";
import VolcanoPlot from "./volcano_plot/VolcanoPlot";
import AnalysisTitle from "../analysis/AnalysisTitle";
import RemoveImputed from "./remove_imputed/RemoveImputed";
import RemoveColumns from "./remove_columns/RemoveColumns";
import PcaPlot from "./pca/PcaPlot";
import ScatterPlot from "./scatter_plot/ScatterPlot";
import Normalization from "./normalization/Normalization";
import SummaryStat from "./summary_stat/SummaryStat";

export default function AnalysisSteps(props) {
    const [menuIsVisible, setMenuIsVisible] = useState(false)
    const [error, setError] = useState(undefined)
    const [selStep, setSelStep] = useState()

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

    const keyBase = (props.data.copyFromIdx ? props.data.copyFromIdx : "")

    return (
        <>
            {props.data && props.data.analysisSteps && <div className={"analysis-col"}>
                <h3>
                <span style={{float: "left", marginLeft: "10px"}}>
                    <Badge status={badgeStatus()}/>
                    <span style={{fontSize: "large"}}>{props.data.idx + 1}</span>
                </span>
                    <span className={"results-name-title"}>{props.data.result.name}</span>
                    <span style={{marginRight: "10px"}}>-</span>
                    <AnalysisTitle id={props.data.id} name={props.data.name} idx={props.data.idx} resultId={props.data.result.id}></AnalysisTitle>
                    {props.data.copyFromIdx != null && <span className={"copy-from-title"}>{"Copy from #" + (props.data.copyFromIdx+1)}</span>}
                    <span style={{float: "right", marginRight: "10px"}}>
                <Dropdown visible={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                          overlay={<AnalysisMenu analysisId={props.data.id} setMenuIsVisible={setMenuIsVisible}
                                                 setError={setError}
                                                 resultId={props.data.result.id}
                                                 resultName={props.data.result.name}
                                                 initialStep={props.data.analysisSteps[0]}></AnalysisMenu>}
                          placement="bottomLeft"
                          arrow>
                    <Button type={"text"} icon={<BarsOutlined style={{fontSize: '24px'}}/>}></Button>
                </Dropdown>

            </span>
                </h3>
                {(error) && <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                />}
                <div className={"analysis-col-content"}>
                    {props.data.analysisSteps && props.data.analysisSteps.map( (step, i) => {
                        const stepWithNr = {...step, nr: i+1}
                        const myKey = keyBase + "-" + step.id
                        const onSelect = () => {
                            setSelStep(i)
                        }
                        switch (step.type) {
                            case 'initial-result':
                                return <InitialResult analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                      data={stepWithNr} key={myKey} resType={props.resType}
                                                      onSelect={onSelect} isSelected={selStep === i}/>
                            case 'boxplot':
                                return <BoxPlot analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                data={stepWithNr} key={myKey}
                                                onSelect={onSelect} isSelected={selStep === i}/>
                            case 'pca':
                                return <PcaPlot analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                data={stepWithNr} key={myKey}
                                                onSelect={onSelect} isSelected={selStep === i}/>
                            case 'log-transformation':
                                return <LogTransformation analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                       data={stepWithNr} key={myKey}
                                                          onSelect={onSelect} isSelected={selStep === i}/>
                            case 'normalization':
                                return <Normalization analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                          data={stepWithNr} key={myKey}
                                                      onSelect={onSelect} isSelected={selStep === i}/>
                            case 'summary-stat':
                                return <SummaryStat analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                      data={stepWithNr} key={myKey}
                                                    onSelect={onSelect} isSelected={selStep === i}/>
                            case 'imputation':
                                return <Imputation analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                          data={stepWithNr} key={myKey}
                                                   onSelect={onSelect} isSelected={selStep === i}/>
                            case 'filter':
                                return <Filter analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                               data={stepWithNr} key={myKey}
                                               onSelect={onSelect} isSelected={selStep === i}/>
                            case 'group-filter':
                                return <GroupFilter analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                    data={stepWithNr} key={myKey}
                                                    onSelect={onSelect} isSelected={selStep === i}/>
                            case 't-test':
                                return <TTest analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                              data={stepWithNr} key={myKey}
                                              onSelect={onSelect} isSelected={selStep === i}/>
                            case 'volcano-plot':
                                return <VolcanoPlot analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                    data={stepWithNr} key={myKey}
                                                    onSelect={onSelect} isSelected={selStep === i}/>
                            case 'remove-imputed':
                                return <RemoveImputed analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                      data={stepWithNr} key={myKey}
                                                      onSelect={onSelect} isSelected={selStep === i}/>
                            case 'remove-columns':
                                // since we need all headers if changing parameters, we have to get from the step before
                                const commonResBefore = props.data.analysisSteps[i-1].commonResult
                                return <RemoveColumns analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                      data={stepWithNr} key={myKey} commonResBefore={commonResBefore}
                                                      onSelect={onSelect} isSelected={selStep === i}/>
                            case 'scatter-plot':
                                return <ScatterPlot analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                                    data={stepWithNr} key={myKey}
                                                    onSelect={onSelect} isSelected={selStep === i}/>
                            default:
                                return null
                        }
                    })}
                </div>
            </div>}
        </>
    );
}
