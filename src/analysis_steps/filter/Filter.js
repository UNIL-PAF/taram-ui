import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {CheckOutlined} from "@ant-design/icons";
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";

export default function Filter(props) {
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

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
              title={getStepTitle(props.data.nr, "Filter rows")}
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
                <Row className={"analysis-step-row"}>
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
                    <Col span={8} className={"analysis-step-middle-col"}>
                        <p><strong>Removed: </strong>{results.nrRowsRemoved}</p>
                    </Col>
                    {isDone && getTableCol(props.data.nrProteinGroups, props.data.tableNr, setShowTable)}
                </Row>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.tableNr, setShowTable)}
        </Card>
    );
}