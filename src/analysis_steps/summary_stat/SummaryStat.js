import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {formNum} from "../../common/NumberFormatting"

export default function SummaryStat(props) {
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    return (
        <Card className={'analysis-step-card'} title={props.data.nr + " - Summary"} headStyle={{textAlign: 'left'}}
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
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row>
                    <Col span={12}>
                        <Row><span>Min: <strong>{formNum(results.min)}</strong></span></Row>
                        <Row><span>Max: <strong>{formNum(results.max)}</strong></span></Row>
                        <Row><span>Number of NaN: <strong>{results.nrNans}</strong></span></Row>
                    </Col>
                    <Col span={12}>
                        <Row><span>Mean: <strong>{formNum(results.mean)}</strong></span></Row>
                        <Row><span>Median: <strong>{formNum(results.median)}</strong></span></Row>
                    </Col>
                </Row>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}