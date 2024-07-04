import React, {useState} from "react";
import InitialResult from "./initial_result/InitialResult";
import Filter from "./filter/Filter"
import {Alert, Badge, Button, Card, Col, Dropdown, Row} from "antd";
import {CheckOutlined, LockTwoTone} from "@ant-design/icons";
import BoxPlot from "./boxplot/BoxPlot";
import './AnalysisStep.css'
import LogTransformation from "./log_transformation/LogTransformation";
import Imputation from "./imputation/Imputation";
import AnalysisMenu from "../analysis/menus/AnalysisMenu";
import GroupFilter from "./group_filter/GroupFilter";
import TTest from "./t_test/TTest";
import VolcanoPlot from "./volcano_plot/VolcanoPlot";
import AnalysisTitle from "../analysis/AnalysisTitle";
import RemoveImputed from "./remove_imputed/RemoveImputed";
import RemoveColumns from "./remove_columns/RemoveColumns";
import PcaPlot from "./pca/PcaPlot";
import UmapPlot from "./umap/UmapPlot";
import ScatterPlot from "./scatter_plot/ScatterPlot";
import Normalization from "./normalization/Normalization";
import SummaryStat from "./summary_stat/SummaryStat";
import OrderColumns from "./order_columns/OrderColumns";
import RenameColumns from "./rename_columns/RenameColumns";
import DownloadZippedResults from "../analysis/menus/DownloadZippedResults";
import AddColumn from "./add_column/AddColumn";
import OneDEnrichment from "./one_d_enrichment/OneDEnrichment";
import {getStepTitle, getTable, getTableCol} from "./CommonStepUtils";
import {typeToName} from "./TypeNameMapping";
import AnalysisStepMenu from "../analysis/menus/AnalysisStepMenu";
import StepComment from "./StepComment";

export default function AnalysisSteps(props) {
    const [menuIsVisible, setMenuIsVisible] = useState(false)
    const [showDownloadZip, setShowDownloadZip] = useState()
    const [error, setError] = useState(undefined)
    const [selStep, setSelStep] = useState()
    const [isLocked, setIsLocked] = useState(props.data.isLocked)

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

    const getAnalysisSteps = () => {
        return props.data.analysisSteps.map( (step, i) => {
            const stepWithNr = {...step, nr: i+1}
            const myKey = keyBase + "-" + step.id
            const onSelect = () => {
                setSelStep(i)
            }

            // since we need all headers if changing parameters, we have to get from the step before
            const commonResBefore = (i > 0) ? props.data.analysisSteps[i-1].commonResult : null

            switch (step.type) {
                case 'initial-result':
                    return <InitialResult isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                          data={stepWithNr} key={myKey} resType={props.resType}
                                          onSelect={onSelect} isSelected={selStep === i}/>
                case 'boxplot':
                    return <BoxPlot isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                    data={stepWithNr} key={myKey} resType={props.resType}
                                    onSelect={onSelect} isSelected={selStep === i}/>
                case 'pca':
                    return <PcaPlot isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                    data={stepWithNr} key={myKey} resType={props.resType}
                                    onSelect={onSelect} isSelected={selStep === i}/>
                case 'umap':
                    return <UmapPlot isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                     data={stepWithNr} key={myKey} resType={props.resType}
                                     onSelect={onSelect} isSelected={selStep === i}/>
                case 'log-transformation':
                    return <LogTransformation isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                              data={stepWithNr} key={myKey} resType={props.resType} commonResBefore={commonResBefore}
                                              onSelect={onSelect} isSelected={selStep === i}/>
                case 'normalization':
                    return <Normalization isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                          data={stepWithNr} key={myKey} resType={props.resType}
                                          onSelect={onSelect} isSelected={selStep === i}/>
                case 'summary-stat':
                    return <SummaryStat isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                        data={stepWithNr} key={myKey} resType={props.resType}
                                        onSelect={onSelect} isSelected={selStep === i}/>
                case 'imputation':
                    return <Imputation isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                       data={stepWithNr} key={myKey} resType={props.resType}
                                       onSelect={onSelect} isSelected={selStep === i}/>
                case 'filter':
                    return <Filter isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                   data={stepWithNr} key={myKey} resType={props.resType}
                                   onSelect={onSelect} isSelected={selStep === i}/>
                case 'group-filter':
                    return <GroupFilter isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                        data={stepWithNr} key={myKey} resType={props.resType}
                                        onSelect={onSelect} isSelected={selStep === i}/>
                case 't-test':
                    return <TTest isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                  data={stepWithNr} key={myKey} resType={props.resType}
                                  onSelect={onSelect} isSelected={selStep === i}/>
                case 'volcano-plot':
                    return <VolcanoPlot isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                        data={stepWithNr} key={myKey} resType={props.resType}
                                        onSelect={onSelect} isSelected={selStep === i}/>
                case 'remove-imputed':
                    return <RemoveImputed isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                          data={stepWithNr} key={myKey} resType={props.resType}
                                          onSelect={onSelect} isSelected={selStep === i}/>
                case 'remove-columns':
                    return <RemoveColumns isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                          data={stepWithNr} key={myKey} commonResBefore={commonResBefore} resType={props.resType}
                                          onSelect={onSelect} isSelected={selStep === i}/>
                case 'scatter-plot':
                    return <ScatterPlot isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                        data={stepWithNr} key={myKey} resType={props.resType}
                                        onSelect={onSelect} isSelected={selStep === i}/>
                case 'order-columns':
                    return <OrderColumns isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                         data={stepWithNr} key={myKey} commonResBefore={commonResBefore} resType={props.resType}
                                         onSelect={onSelect} isSelected={selStep === i}/>
                case 'rename-columns':
                    return <RenameColumns isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                          data={stepWithNr} key={myKey} commonResBefore={commonResBefore} resType={props.resType}
                                          onSelect={onSelect} isSelected={selStep === i}/>
                case 'add-column':
                    return <AddColumn isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                      data={stepWithNr} key={myKey} commonResBefore={commonResBefore} resType={props.resType}
                                      onSelect={onSelect} isSelected={selStep === i}/>
                case 'one-d-enrichment':
                    return <OneDEnrichment isLocked={isLocked} analysisIdx={props.analysisIdx} resultId={props.data.result.id}
                                           data={stepWithNr} key={myKey} commonResBefore={commonResBefore} resType={props.resType}
                                           onSelect={onSelect} isSelected={selStep === i}/>
                default:
                    return null
            }
        }).concat(getConclusion())
    }

    const getConclusion = () => {
        return (
            <Card className={"analysis-step-card" }
                  title={"Conclusion"}
                  headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
                  bodyStyle={{textAlign: 'left'}}
            >
               <p>Blibla</p>
            </Card>
        )
    }

    return (
        <>
            {props.data && props.data.analysisSteps && <div
                style={{width: (props.multipleAnalysis ? "45%" : "65%")}}
                className={"analysis-col"} >
                <h3>
                <span style={{float: "left", marginLeft: "10px"}}>
                    <Badge status={badgeStatus()}/>
                    <span style={{fontSize: "large"}}>{props.data.idx + 1}</span>
                </span>
                    {(isLocked) && <span style={{fontSize: "x-large", paddingRight: "20px"}}><LockTwoTone twoToneColor={"#d4b106"}/></span>}
                    <span className={"results-name-title"}>{props.data.result.name}</span>
                    <span style={{marginRight: "10px"}}>-</span>
                    <AnalysisTitle id={props.data.id} name={props.data.name} idx={props.data.idx} resultId={props.data.result.id}></AnalysisTitle>
                    {props.data.copyFromIdx != null && <span className={"copy-from-title"}>{"Copy from #" + (props.data.copyFromIdx+1)}</span>}
                    <span style={{float: "right", marginRight: "10px"}}>

                <Dropdown open={menuIsVisible} onClick={() => setMenuIsVisible(true)}
                          overlay={<AnalysisMenu analysisId={props.data.id} setMenuIsVisible={setMenuIsVisible}
                                                 setError={setError}
                                                 resultId={props.data.result.id}
                                                 resultName={props.data.result.name}ß
                                                 setShowDownloadZip={setShowDownloadZip}
                                                 setIsLocked={setIsLocked}
                                                 isLocked={isLocked}
                                                 initialStep={props.data.analysisSteps[0]}></AnalysisMenu>}
                          placement="bottomLeft"
                          arrow>
                    <Button type={"primary"}>Analysis menu</Button>
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
                    {props.data.analysisSteps && getAnalysisSteps()}
                </div>
            </div>}
            {showDownloadZip && <DownloadZippedResults
                handleCancel={() => setShowDownloadZip(false)}
                data={props.data}
                analysisId={props.data.id}
                analysisName={props.data.name}
                resultName={props.data.result.name}
            ></DownloadZippedResults>}
        </>
    );
}
