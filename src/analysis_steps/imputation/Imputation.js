import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"

export default function Imputation(props) {
    const type = "imputation"
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

    const imputationText = () => {
        const selColTxt = getSelColTxt()
        return {
            "normal": "Replace missing values in column(s) [" + selColTxt + "] by random numbers drawn from a normal distribution:",
            "nan": "Replace missing values in column(s) [" + selColTxt + "] by NaN.",
            "value": "Replace missing values in column(s) [" + selColTxt + "] by " + localParams.replaceValue + "."
        }
    }

    const getSelColTxt = () => {
        if(!localParams.intCol && !localParams.selColIdxs){
            return props.data.columnInfo.columnMapping.intCol + "..."
        }else if(!localParams.intCol && localParams.selColIdxs){
            const selColNames = props.data.commonResult.headers.filter(h => localParams.selColIdxs.includes(h.idx)).map(h => h.name)
            return selColNames.join(", ")
        }else{
            return localParams.intCol + "..."
        }
    }

    const getNormParams = () => {
        return <>
            <p className={"analysis-step-param-line"}>Width: {params.normImputationParams.width}</p>
            <p className={"analysis-step-param-line"}>Down shift: {params.normImputationParams.downshift}</p>
            <p className={"analysis-step-param-line"}>Seed: {params.normImputationParams.seed}</p>
        </>
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
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
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
                                <p className={"analysis-step-param-line"}>{imputationText()[params.imputationType]}</p>
                                {params.imputationType === "normal" && getNormParams()}
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                        <Row><Col><strong>Nr of imputed values: </strong>{results.nrImputedValues}</Col></Row>
                        <Row><Col><strong>Nr of protein groups with imputation: </strong>{results.nrOfImputedGroups}
                        </Col></Row>
                    </Col>
                    {isDone && getTableCol(props.data.nrProteinGroups, props.data.nr, setShowTable)}
                </Row>
            }
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId}
                         comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.nr, setShowTable)}
        </Card>
    );
}