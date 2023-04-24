import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {formNum} from "../../common/NumberFormatting";

export default function LogTransformation(props) {
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    const transText = { "log2": "Log2"}

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={props.data.nr + " - Log transformation"}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={"log-transformation"}
                              commonResult={props.data.commonResult}
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
                <Row>
                    <Col span={8}>
                        <Row><span><strong>Min: </strong>{formNum(results.min)}</span></Row>
                        <Row><span><strong>Max: </strong>{formNum(results.max)}</span></Row>
                        <Row><span><strong>Number of NaN: </strong>{results.nrNans}</span></Row>
                    </Col>
                    <Col span={8}>
                        <Row><span><strong>Mean: </strong>{formNum(results.mean)}</span></Row>
                        <Row><span><strong>Median: </strong>{formNum(results.median)}</span></Row>
                        <Row><span><strong>Sum: </strong>{formNum(results.sum)}</span></Row>
                    </Col>
                    <Col span={8}>
                        <div className={"analysis-step-param-box"}>
                            <div className={"analysis-step-param-content"}>
                                {transText[params.transformationType]} transformation
                            </div>
                        </div>
                    </Col>
                </Row>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}