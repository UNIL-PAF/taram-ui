import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {CheckOutlined} from "@ant-design/icons";

export default function Filter(props) {
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    const comparators = {
    "gt": ">",
    "sd": "<",
    "eq": "==",
    "not": "!=",
    "ge": ">=",
    "se": "<="
    }

    const getColFilters = () => {
        return params.colFilters.map( (flt, i) => {
            const fltAction = flt.removeSelected ? "Remove" : "Keep"
            return <p key={i} className={"analysis-step-param-line"}>{fltAction} <em>{flt.colName}</em> {comparators[flt.comparator]} {flt.compareToValue}</p>
        })
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={props.data.nr + " - Filter rows"}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error} paramType={"filter"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.tableNr}
                              hasImputed={props.data.imputationTablePath != null}
                              isSelected={props.isSelected}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row>
                    <Col span={16}>
                        <p>Protein groups: <strong>{results.nrRows}</strong></p>
                        <p>Removed: <strong>{results.nrRowsRemoved}</strong></p>
                    </Col>
                    <Col span={8}>
                        <div className={"analysis-step-param-box"}>
                            <div className={"analysis-step-param-content"}>
                                {params.removeOnlyIdentifiedBySite && <p className={"analysis-step-param-line"}>Remove only-identified-by-site &nbsp;&nbsp;<CheckOutlined/></p>}
                                {params.removeReverse && <p className={"analysis-step-param-line"}>Remove reverse &nbsp;&nbsp;<CheckOutlined/></p>}
                                {params.removePotentialContaminant && <p className={"analysis-step-param-line"}>Remove potential contaminants &nbsp;&nbsp;<CheckOutlined/></p>}
                                {params.colFilters && getColFilters()}
                            </div>
                        </div>
                    </Col>
                </Row>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}