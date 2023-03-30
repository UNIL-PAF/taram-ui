import React, {useEffect, useState} from "react";
import {Button, Card, Modal, Row, Select, Space, Col} from 'antd';
import AnalysisStepMenu from "../menus/AnalysisStepMenu"
import StepComment from "../StepComment";
import DefineGroupsParams from "./DefineGroupsParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";

export default function InitialResult(props) {
    const {Option} = Select;
    const [showModal, setShowModal] = useState(false)
    const [localParams, setLocalParams] = useState(false)
    const dispatch = useDispatch();

    const defineGroupButton = {danger: true, text: "Define groups"}
    const ChangeGroupButton = {danger: false, text: "Edit groups"}

    const results = JSON.parse(props.data.results)
    const colInfo = props.data.columnInfo
    const numCols = props.data.commonResult.numericalColumns
    const intCol = colInfo ? colInfo.columnMapping.intCol : null
    const groupsDefined = Object.values(props.data.columnInfo.columnMapping.experimentDetails).some(a => a.group)


    useEffect(() => {
        if (props.data) {
            const colMapping = props.data.columnInfo.columnMapping

            const expData = colMapping.experimentNames.map((e) => {
                const exp = colMapping.experimentDetails[e]
                return {
                    name: exp.name,
                    fileName: exp.fileName,
                    originalName: exp.originalName,
                    key: e,
                    isSelected: exp.isSelected
                }
            })

            const expList = Object.values(colMapping.experimentDetails)

            const newGroupData = {
                experiments: {
                    name: "Experiments",
                    items: expList.filter((d) => {
                        return !d.group
                    }).map((d) => {
                        return {id: d.name, name: d.name}
                    })
                }
            }

            const groups = [...new Set(expList.map((e) => e.group))].filter((e) => e != null)

            const initialGroups = groups.reduce((acc, cur) => ({
                ...acc,
                [cur]: {name: cur, items: []}
            }), {})

            const loadedGroupData = expList.reduce((acc, cur) => {
                const cleaned = {id: cur.name, name: cur.name}
                groups.forEach((g) => {
                    if (g === cur.group) acc[g].items.push(cleaned)
                })
                return acc
            }, initialGroups)

            const groupData = (groups.length >= 1) ? {...newGroupData, ...loadedGroupData} : newGroupData
            setLocalParams({expData: expData, groupData: groupData, column: colMapping.intCol})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])


    // format the data for the backend
    const prepareParams = (params) => {
        const experimentDetails = params.expData.reduce((sum, d) => {
            const group = Object.values(params.groupData).find((g) => {
                return g.items.find((i) => {
                    return i.id === d.key
                })
            })
            sum[d.key] = {fileName: d.fileName, name: d.name, isSelected: d.isSelected, originalName: d.originalName}
            if (group && group.name !== "Experiments") {
                sum[d.key].group = group.name
            }
            return sum
        }, {})
        return {experimentDetails: experimentDetails, intCol: params.column}
    }

    const changGroups = () => {
        setShowModal(!showModal)
    }

    const changeIntensity = (value) => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: prepareParams({...localParams, column: numCols[value]})
        }))
    }

    const handleGroupModalOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: prepareParams(localParams)
        }))
        setShowModal(false)
    }

    return (
        <Card className={"analysis-step-card"} title={props.data.nr + " - Initial result"}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              commonResult={props.data.commonResult}
                              intCol={intCol}
                              tableNr={props.data.tableNr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              resType={props.resType}
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
                { results.fastaFiles &&
                    <Row>
                        <Col>Fasta files:</Col>
                        <Col>
                            {results.fastaFiles.map(f => {return <Row key={f}>&nbsp;<strong>{f}</strong></Row>})}
                        </Col>
                    </Row>
                }
                <StepComment stepId={props.data.id} resultId={props.resultId}
                             comment={props.data.comments}></StepComment>
            </Space>
            <Modal visible={showModal} onOk={() => handleGroupModalOk()}
                   onCancel={() => changGroups()} width={1000}>
                <DefineGroupsParams analysisIdx={props.analysisIdx}
                                    params={localParams}
                                    commonResult={props.data.commonResult}
                                    prepareParams={prepareParams}
                                    setParams={setLocalParams}>
                </DefineGroupsParams>
            </Modal>
        </Card>
    );
}
