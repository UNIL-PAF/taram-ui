import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {prepareTTestParams} from "./TTestPrepareParams"
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"

export default function TTest(props) {
    const type = "t-test"
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)
    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

    const multiTestCorrText = {
        'BH': "Benjamini & Hochberg (FDR)",
        'none': "None"
    }

    const testName = (myParams) => {
        const myName = myParams.equalVariance === false ? "Welch's t-test (unequal variances)" : "Student's t-test (equal variances)"
        return myParams.paired === true ? ("Paired " + myName) : myName
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type))}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              key={props.data.id + "-" + props.data.nextId ? props.data.nextId : ""}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={type}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.nr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              hasImputed={props.data.imputationTablePath != null}
                              isSelected={props.isSelected}
                              prepareParams={prepareTTestParams}
                              isLocked={props.isLocked}
                              resType={props.resType}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row className={"analysis-step-row"}>
                    <Col span={8}>
                        <div className={"analysis-step-param-box"}>
                            <div className={"analysis-step-param-content"}>
                                <p className={"analysis-step-param-line"}>{testName(params)}</p>
                                <p className={"analysis-step-param-line"}>Significance
                                    threshold: {params.signThres}</p>
                                <p className={"analysis-step-param-line"}>Multiple testing
                                    correction: {multiTestCorrText[params.multiTestCorr]}</p>
                                {params.filterOnValid && <p className={"analysis-step-param-line"}>Only compute comparisons when there are at least {params.minNrValid} valid (non-imputed) values in one group.</p>}
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                        <h4>Nr of significant results:</h4>
                        {results.comparisions.map((comp, i) => {
                            return <p
                                key={i}><strong>{comp.firstGroup} - {comp.secondGroup}:</strong> {comp.numberOfSignificant} {comp.nrPassedFilter && <span>({comp.nrPassedFilter} passed filter)</span>}
                            </p>
                        })}
                    </Col>
                    {isDone && getTableCol(props.data.nrProteinGroups, props.data.nr, setShowTable)}
                </Row>

            }
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.nr, setShowTable)}
        </Card>
    );
}