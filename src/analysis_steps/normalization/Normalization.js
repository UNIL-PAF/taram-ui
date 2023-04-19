import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {formNum} from "../../common/NumberFormatting";

export default function Normalization(props) {
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={props.data.nr + " - Normalization"}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={"normalization"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.tableNr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row>
                    <Col span={12}>
                        <Row><span><strong>Min: </strong>{formNum(results.min)}</span></Row>
                        <Row><span><strong>Max: </strong>{formNum(results.max)}</span></Row>
                        <Row><span><strong>Number of NaN: </strong>{results.nrNans}</span></Row>
                    </Col>
                    <Col span={12}>
                        <Row><span><strong>Mean: </strong>{formNum(results.mean)}</span></Row>
                        <Row><span><strong>Median: </strong>{formNum(results.median)}</span></Row>
                        <Row><span><strong>Sum: </strong>{formNum(results.sum)}</span></Row>
                    </Col>
                </Row>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}