import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {prepareTTestParams} from "./TTestPrepareParams"
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";

export default function TTest(props) {
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

    const multiTestCorrText = {
        'BH': "Benjamini & Hochberg (FDR)",
        'none': "None"
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, "t-test")}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={"t-test"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.tableNr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              hasImputed={props.data.imputationTablePath != null}
                              isSelected={props.isSelected}
                              prepareParams={prepareTTestParams}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row className={"analysis-step-row"}>
                    <Col span={8}>
                        <div className={"analysis-step-param-box"}>
                            <div className={"analysis-step-param-content"}>
                                {<p className={"analysis-step-param-line"}>Significance
                                    threshold: {params.signThres}</p>}
                                <p className={"analysis-step-param-line"}>Multiple testing
                                    correction: {multiTestCorrText[params.multiTestCorr]}</p>
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                        <h4>Nr of significant results:</h4>
                        {results.comparisions.map((comp, i) => {
                            return <p
                                key={i}><strong>{comp.firstGroup} - {comp.secondGroup}:</strong> {comp.numberOfSignificant}
                            </p>
                        })}
                    </Col>
                    {isDone && getTableCol(props.data.nrProteinGroups, props.data.tableNr, setShowTable)}
                </Row>

            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.tableNr, setShowTable)}
        </Card>
    );
}