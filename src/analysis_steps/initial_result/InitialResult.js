import React, {useEffect, useState} from "react";
import {Button, Card, Col, Modal, Row, Select} from 'antd';
import AnalysisStepMenu from "../menus/AnalysisStepMenu"
import StepComment from "../StepComment";
import DefineGroupsParams from "./DefineGroupsParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import "../AnalysisStep.css"
import {getNumCols, getStepTitle} from "../CommonStep";

export default function InitialResult(props) {
    const {Option} = Select;
    const [showModal, setShowModal] = useState(false)
    const [localParams, setLocalParams] = useState(false)
    const dispatch = useDispatch();

    const defineGroupButton = {danger: true, text: "Define groups"}
    const ChangeGroupButton = {danger: false, text: "Edit groups"}

    const results = JSON.parse(props.data.results)
    const colInfo = props.data.columnInfo
    const numCols = getNumCols(props.data.commonResult.headers)
    const intCol = colInfo ? colInfo.columnMapping.intCol : null
    const groupsDefined = Object.values(props.data.columnInfo.columnMapping.experimentDetails).some(a => a.group)
    
    useEffect(() => {
        if (!localParams && props.data) {
            const colMapping = props.data.columnInfo.columnMapping
            const expList = Object.values(colMapping.experimentDetails)

            const newGroupData = {
                experiments: {
                    name: "Experiments",
                    items: expList.filter((d) => {
                        return !d.group
                    }).map((d) => {
                        return {
                            id: d.originalName,
                            name: d.name,
                            fileName: d.fileName,
                            originalName: d.originalName
                        }
                    })
                }
            }

            const groups = [...new Set(expList.map((e) => e.group))].filter((e) => e != null)

            const initialGroups = groups.reduce((acc, cur) => ({
                ...acc,
                [cur]: {name: cur, items: []}
            }), {})

            const loadedGroupData = expList.reduce((acc, cur) => {
                const cleaned = {
                    id: cur.originalName,
                    name: cur.name,
                    fileName: cur.fileName,
                    originalName: cur.originalName
                }
                groups.forEach((g) => {
                    if (g === cur.group) acc[g].items.push(cleaned)
                })
                return acc
            }, initialGroups)

            const groupData = (groups.length >= 1) ? {...newGroupData, ...loadedGroupData} : newGroupData
            setLocalParams({groupData: groupData, column: colMapping.intCol})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, localParams])


    // format the data for the backend
    const prepareParams = (params) => {
        const colMapping = props.data.columnInfo.columnMapping

        const experimentDetails = Object.values(colMapping.experimentDetails).reduce((sum, d) => {
            const group = Object.values(params.groupData).find((g) => {
                return g.items.find((i) => {
                    return i.originalName === d.originalName
                })
            })
            sum[d.originalName] = {fileName: d.fileName, name: d.name, isSelected: d.isSelected, originalName: d.originalName}
            if (group && group.name !== "Experiments") {
                sum[d.originalName].group = group.name
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

    const computeNewGroupData = (expIdx, newName) => {
        return Object.entries(localParams.groupData).reduce((a, [key, v]) => {
            const items = v.items.map(i => i.id === expIdx ? {...i, name: newName} : i)
            a[key] = {...v, items: items};
            return a;
        }, {});
    }

    const changeExpName = (expIdx, newName) =>{
        const newGroupData = computeNewGroupData(expIdx, newName)
        setLocalParams({...localParams, groupData: newGroupData})

        const exps = prepareParams(localParams)
        let newExpDetails = {...exps.experimentDetails}
        newExpDetails[expIdx] = {...newExpDetails[expIdx], name: newName}
        const newParams = {...exps, experimentDetails: newExpDetails}
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: newParams
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
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, "Initial result", results.nrProteinGroups, props.data.status === "done")}
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
                              isSelected={props.isSelected}
                              hasImputed={false}/>
        }>
            <div>
                <Row>
                    <Button onClick={() => changGroups()}
                            danger={groupsDefined ? ChangeGroupButton.danger : defineGroupButton.danger}
                            type={'primary'} size={"small"}>{groupsDefined ? ChangeGroupButton.text : defineGroupButton.text}</Button>
                </Row>
                <Row className={"analysis-step-row"}>
                    <span><strong>Default intensity column: </strong>
                    <Select className={"analysis-step-row"} value={props.data.columnInfo.columnMapping.intCol}
                            style={{width: 250}}
                            onChange={changeIntensity}>
                        {numCols.map((n, i) => {
                            return <Option key={i} value={i}>{n}</Option>
                        })}</Select>
                </span>
                </Row>
                <Row className={"analysis-step-row"}>
                    {results && results.maxQuantParameters &&
                        <span><strong>Match between runs: </strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}
                </span>}
                </Row>
                { results.fastaFiles &&
                    <Row className={"analysis-step-row"}>
                        <Col><strong>Fasta files:</strong></Col>
                        <Col>
                            {results.fastaFiles.map(f => {return <Row key={f}>&nbsp;{f}</Row>})}
                        </Col>
                    </Row>
                }
                { results.softwareVersion &&
                    <Row className={"analysis-step-row"}>
                        <Col><strong>Version:</strong></Col>
                        <Col>&nbsp;{results.softwareVersion}</Col>
                    </Row>
                }
                <StepComment stepId={props.data.id} resultId={props.resultId}
                             comment={props.data.comments}></StepComment>
            </div>
            <Modal visible={showModal} onOk={() => handleGroupModalOk()}
                   onCancel={() => changGroups()} width={1000} bodyStyle={{overflowY: 'scroll'}}>
                <DefineGroupsParams analysisIdx={props.analysisIdx}
                                    params={localParams}
                                    commonResult={props.data.commonResult}
                                    prepareParams={prepareParams}
                                    setParams={setLocalParams}
                                    changeExpName={changeExpName}
                >
                </DefineGroupsParams>
            </Modal>
        </Card>
    );
}
