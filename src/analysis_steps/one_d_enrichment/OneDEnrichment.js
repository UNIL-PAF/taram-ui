import React, {useState} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
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
    const [showZoom, setShowZoom] = useState(null)

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type))}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error} paramType={type}
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
            {results &&
                <>
                   <span>
                        <div style={{textAlign: 'right', marginBottom: '10px'}}>
                           <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                                        icon={<FullscreenOutlined/>}>Expand</Button>
                        </div>
                        <h4>Selected results</h4>
                </span>


                    <OneDEnrichmentTable results={results}></OneDEnrichmentTable>


                </>
            }
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId}
                         comment={props.data.comments}></StepComment>
            {results && <OneDEnrichmentTableZoom showZoom={showZoom}
                                                 setShowZoom={setShowZoom}
                                                 stepNr={props.data.nr}
                                                 stepId={props.data.id}></OneDEnrichmentTableZoom>}
        </Card>
    );
}