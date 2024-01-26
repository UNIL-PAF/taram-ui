import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"

export default function RemoveColumns(props) {
    const type = "remove-columns"
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

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
                              commonResBefore={props.commonResBefore}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.nr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
                              isLocked={props.isLocked}
                              resType={props.resType}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <div>
                    <Row>
                        <Col span={8}>
                            <div className={"analysis-step-param-box"}>
                                <div className={"analysis-step-param-content"}>
                                        <span>Nr of columns to remove: {results.nrOfColumnsRemoved}</span>
                                </div>
                            </div>
                        </Col>
                        <Col span={8} className={"analysis-step-middle-col"}>
                    <Row className={"analysis-step-row"}>
                        <span><strong>Nr of columns: </strong>{results.nrOfColumns}</span>
                    </Row>
                        </Col>
                        {isDone && getTableCol(props.data.nrProteinGroups, props.data.nr, setShowTable)}
                    </Row>
                </div>
            }
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.nr, setShowTable)}
        </Card>
    );
}