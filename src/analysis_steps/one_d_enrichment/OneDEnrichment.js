import React, {useState, useEffect} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"
import OneDEnrichmentTable from "./OneDEnrichmentTable";
import OneDEnrichmentTableZoom from "./OneDEnrichmentTableZoom";
import {FullscreenOutlined} from "@ant-design/icons";

export default function OneDEnrichment(props) {
    const type = "one-d-enrichment"
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)
    const [localSelResults, setLocalSelResults] = useState()
    const [showZoom, setShowZoom] = useState(null)
    const isDone = props.data.status === "done"

    useEffect(() => {
        if(!localSelResults && results && results.selResults){
            setLocalSelResults(results.selResults)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [results])

    useEffect(() => {
        if(localParams && props.data.status === "running"){
            setLocalParams(undefined)
        }else if(! localParams && props.data.status === "done"){
            setLocalParams(params)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, localParams])

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type))}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={type}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.tableNr}
                              hasImputed={props.data.imputationTablePath != null}
                              isSelected={props.isSelected}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isLocked={props.isLocked}
                              resType={props.resType}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {localSelResults &&
                <>
                   <span>
                        <div style={{textAlign: 'right', marginBottom: '10px'}}>
                           <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                                        icon={<FullscreenOutlined/>}>Expand</Button>
                        </div>
                        <h4>Selected results:</h4>
                </span>
                    <OneDEnrichmentTable results={localSelResults}></OneDEnrichmentTable>
                </>
            }
            <StepComment isLocked={props.isLocked || !isDone} stepId={props.data.id} resultId={props.resultId}
                         comment={props.data.comments}></StepComment>
            {results && isDone && localParams && <OneDEnrichmentTableZoom showZoom={showZoom}
                                                 setShowZoom={setShowZoom}
                                                 params={localParams}
                                                 setParams={setLocalParams}
                                                 stepNr={props.data.nr}
                                                 resultId={props.resultId}
                                                 setResults={setLocalSelResults}
                                                 results={localSelResults}
                                                 stepId={props.data.id}></OneDEnrichmentTableZoom>}
        </Card>
    );
}