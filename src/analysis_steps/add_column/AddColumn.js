import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"

export default function AddColumn(props) {
    const type = "add-column"
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

    const renderParamContent = () => {
        if (params.charColParams) {
            const charComp = params.charColParams.compOp === "matches" ? "matches" : "does not match"
            return <p className={"analysis-step-param-line"}>Mark each row with&nbsp;
                <strong>+</strong> where <strong><em>{params.charColParams.compSel}</em></strong> entry from <strong><em>[{results.selColNames.join(", ")}]</em></strong> {charComp} <strong><em>{params.charColParams.compVal}</em></strong>.
            </p>
        }
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
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
                              isLocked={props.isLocked}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <div>
                    <Row>
                        <Col span={8}>
                            <div className={"analysis-step-param-box"}>
                                <div className={"analysis-step-param-content"}>
                                    {renderParamContent()}
                                </div>
                            </div>
                        </Col>
                        <Col span={8} className={"analysis-step-middle-col"}>
                            <Row className={"analysis-step-row"}>Added new column &nbsp;<strong><em>{params.newColName}</em></strong></Row>
                        </Col>
                        {isDone && getTableCol(props.data.nrProteinGroups, props.data.tableNr, setShowTable)}
                    </Row>
                </div>
            }
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId}
                         comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.tableNr, setShowTable)}
        </Card>
    );
}