import React, {useState} from "react";
import {Button, Card, Col, Modal, Row, Select, Space} from 'antd';
import AnalysisStepMenu from "../menus/AnalysisStepMenu"
import StepComment from "../StepComment";
import DefineGroupsParams from "./DefineGroupsParams";

export default function InitialResult(props) {
    const {Option} = Select;
    const [groupsDefined, setGroupsDefined] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [localParams, setLocalParams] = useState(false)

    const defineGroupButton = {danger: true, text: "Define groups"}
    const ChangeGroupButton = {danger: false, text: "Edit groups"}

    console.log(props)

    const results = JSON.parse(props.data.results)
    const colInfo = props.data.columnInfo
    const intCol = colInfo ? colInfo.columnMapping.intCol : null

    const prepareParams = () => {
        console.log("prepareParams")
    }

    const changGroups = () => {
        setShowModal(!showModal)
    }

    const changeIntensity = (value) => {
        console.log(value)
    }

    const handleGroupModalOk = () => {
        console.log("handleGroupModalOk")
    }

    return (
        <Card className={"analysis-step-card"} title={props.data.nr + " - Initial result"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              commonResult={props.data.commonResult}
                              intCol={intCol} tableNr={props.data.tableNr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              hasImputed={false}/>
        }>
            <Space direction={'vertical'}>
                <Row>
                    <Button onClick={() => changGroups()}
                            danger={groupsDefined ? ChangeGroupButton.danger : defineGroupButton.danger}
                            type={'primary'}>{groupsDefined ? ChangeGroupButton.text : defineGroupButton.text}</Button>
                </Row>
            <Row>
                <span>Default intensity column: <strong>
                    <Select value={props.data.columnInfo.columnMapping.intCol}
                            style={{width: 250}}
                            onChange={changeIntensity}>
                        {props.data.commonResult.numericalColumns.map((n, i) => {
                            return <Option key={i} value={i}>{n}</Option>
                        })}</Select>
                </strong></span>
            </Row>
            <Row>
            {results && results.maxQuantParameters &&
                <span>Match between runs: <strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}</strong>
                </span>}
            </Row>
            <Row>
            <span>Protein groups: <strong>{results && results.nrProteinGroups}</strong></span>
            </Row>
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            </Space>
            <Modal visible={showModal} onOk={() => handleGroupModalOk()}
                   onCancel={() => changGroups()} width={1000}>
                <DefineGroupsParams analysisIdx={props.analysisIdx}
                                    params={props.data.parameters}
                                    commonResult={props.data.commonResult}
                                    prepareParams={prepareParams}
                                    setParams={setLocalParams}>
                </DefineGroupsParams>
            </Modal>
        </Card>
    );
}
