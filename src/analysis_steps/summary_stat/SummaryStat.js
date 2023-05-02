import React, {useState} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import "../AnalysisStep.css"
import {FullscreenOutlined} from "@ant-design/icons";
import SummaryTableZoom from "./SummaryTableZoom";
import SummaryTable from "./SummaryTable";
import {getStepTitle} from "../CommonStep";

export default function SummaryStat(props) {
    const [showZoom, setShowZoom] = useState(null)

    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, "Summary", props.data.nrProteinGroups)}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={"summary-stat"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <div>
                    <div style={{textAlign: 'right'}}>
                        <Button size={'small'} type='default' onClick={() => setShowZoom(true)}
                                icon={<FullscreenOutlined/>}>Expand</Button>
                    </div>
                    <SummaryTable results={results}></SummaryTable>
                </div>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {results && <SummaryTableZoom showZoom={showZoom} setShowZoom={setShowZoom}
                                     results={results} stepId={props.data.id} stepNr={props.data.nr}></SummaryTableZoom>}
        </Card>
    );
}