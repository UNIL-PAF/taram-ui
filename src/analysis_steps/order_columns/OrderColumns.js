import React, {useState} from "react";
import {Card, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle} from "../CommonStep";

export default function OrderColumns(props) {
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, "Order columns", props.data.nrProteinGroups, props.data.status === 'done')}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={"remove-columns"}
                              commonResult={props.commonResBefore}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.tableNr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <div>
                    <Row className={"analysis-step-row"}>
                        <span><strong>Nr of columns: </strong>{results.nrOfColumns}</span>
                    </Row>
                    <Row className={"analysis-step-row"}>
                        <span><strong>Nr of columns removed: </strong>{results.nrOfColumnsRemoved}</span>
                    </Row>
                </div>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}