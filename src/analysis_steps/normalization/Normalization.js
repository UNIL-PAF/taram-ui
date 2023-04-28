import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {formNum} from "../../common/NumberFormatting";

export default function Normalization(props) {
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    const normType = {
        "median": "Median",
        "mean": "Mean",
        "none": "None"
    }

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
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row>
                    <Col span={8}>
                        <Row><span><strong>Min: </strong>{results.min && formNum(results.min[0])}</span></Row>
                        <Row><span><strong>Max: </strong>{results.max && formNum(results.max[0])}</span></Row>
                        <Row><span><strong>Nr of NaN: </strong>{results.nrNaN && formNum(results.nrNaN[0])}</span></Row>
                    </Col>
                    <Col span={8}>
                        <Row><span><strong>Mean: </strong>{results.mean && formNum(results.mean[0])}</span></Row>
                        <Row><span><strong>Median: </strong>{results.median && formNum(results.median[0])}</span></Row>
                        <Row><span><strong>Sum: </strong>{results.sum && formNum(results.sum[0])}</span></Row>
                    </Col>
                    <Col span={8}>
                        <div className={"analysis-step-param-box"}>
                            <div className={"analysis-step-param-content"}>
                                {<p className={"analysis-step-param-line"}>{normType[params.normalizationType]} normalization</p>}
                            </div>
                        </div>
                    </Col>
                </Row>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}