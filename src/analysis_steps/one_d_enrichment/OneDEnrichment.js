import React, {useState, useEffect} from "react";
import {Button, Card, Col, Row} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"
import OneDEnrichmentTable from "./OneDEnrichmentTable";
import OneDEnrichmentTableZoom from "./OneDEnrichmentTableZoom";

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

    const multiTestCorrText = (fdrCorrection) => {
        return  fdrCorrection ? "Benjamini & Hochberg (FDR)" : "None"
    }

    const getAnnotationString = (annotation) => {
        return annotation.name + ", " +
            (annotation.description && annotation.description !== "undefined" ? annotation.description + ", " : "") +
            annotation.creationString + ", " +
            annotation.nrEntries + " entries."
    }

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
            { results && <Row className={"analysis-step-row"}>
                <Col span={16}>
                    <div className={"analysis-step-param-box"}>
                        <div className={"analysis-step-param-content"}>
                            <p className={"analysis-step-param-line"}>{"Annotation file: " + results.annotation.origFileName}</p>
                            <p className={"analysis-step-param-line"}>{"Annotation info: " + getAnnotationString(results.annotation)}</p>
                            <p className={"analysis-step-param-line"}>{"Selected annotations: " + results.annotation.selHeaderNames.join(", ")}</p>
                            <p className={"analysis-step-param-line"}>{"Selected columns: " + results.selColumns.join(', ')}</p>
                            {<p className={"analysis-step-param-line"}>Significance
                                threshold: {params.threshold}</p>}
                            <p className={"analysis-step-param-line"}>Multiple testing
                                correction: {multiTestCorrText(params.fdrCorrection)}</p>
                        </div>
                    </div>
                </Col>
                <Col span={8} className={"analysis-step-middle-col"}>
                    <Row className={"analysis-step-row-end"} style={{marginTop: "10px"}}>
                            <span><Button
                                className={"table-download-button"}
                                onClick={() => setShowZoom(true)}
                                size={'small'}><span>{'Enrichment-table-' + props.data.nr}</span></Button></span>
                    </Row>

                </Col>
            </Row>}
            {localSelResults &&
                <>
                    <br></br>
                   <span>
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