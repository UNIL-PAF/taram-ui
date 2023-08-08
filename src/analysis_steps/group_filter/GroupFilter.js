import React, {useState} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"

export default function GroupFilter(props) {
    const type = "group-filter"
    const params = JSON.parse(props.data.parameters)
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState(params)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

    const groupTxt = {
        'one_group': "one group",
        'all_groups': "all groups",
        'total': "total"
    }

    const myIntField = params.field ? params.field : props.data.columnInfo.columnMapping.intCol

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type))}
              headStyle={{textAlign: 'left'}}
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
                                <p className={"analysis-step-param-line"}>Only keep rows where <em>{myIntField}</em> has
                                    at least {params.minNrValid} valid values in {groupTxt[params.filterInGroup]}.</p>
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                        <span><strong>Removed: </strong>{results.nrRowsRemoved}</span>
                    </Col>
                    {isDone && getTableCol(props.data.nrProteinGroups, props.data.tableNr, setShowTable)}
                </Row>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.tableNr, setShowTable)}
        </Card>
    );
}