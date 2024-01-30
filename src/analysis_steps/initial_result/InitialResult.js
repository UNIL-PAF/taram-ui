import React, {useEffect, useState} from "react";
import {Button, Card, Col, Modal, Row, Select} from 'antd';
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu"
import StepComment from "../StepComment";
import DefineGroupsParams from "./DefineGroupsParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import "../AnalysisStep.css"
import {getNumCols, getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"

export default function InitialResult(props) {
    const type = "initial-result"
    const {Option} = Select;
    const [showModal, setShowModal] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [localParams, setLocalParams] = useState(false)
    const [groupModalKey, setGroupModalKey] = useState(1)
    const [localGroupParams, setLocalGroupParams] = useState()
    const [currentHash, setCurrentHash] = useState()
    const dispatch = useDispatch();

    const defineGroupButton = {danger: true, text: "Define groups"}
    const ChangeGroupButton = {danger: false, text: "Edit groups"}

    const results = JSON.parse(props.data.results)
    const colInfo = props.data.columnInfo
    const numCols = props.data.commonResult ? getNumCols(props.data.commonResult.headers) : []
    const intCol = colInfo ? colInfo.columnMapping.intCol : null
    const groupsDefined = colInfo ? Object.values(colInfo.columnMapping.experimentDetails).some(a => a.group) : null

    useEffect(() => {
        if((props.data && props.data.columnInfo && (!localParams || (!currentHash || currentHash !== props.data.columnInfo.columnMappingHash)))){
            setCurrentHash(props.data.columnInfo.columnMappingHash)
            setLocalParams(initializeLocalParams())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, localParams, currentHash])


    const initializeLocalParams = () => {
        const colMapping = props.data.columnInfo.columnMapping
        const expList = Object.values(colMapping.experimentDetails)

        const newGroupData = {
            experiments: {
                name: "Experiments",
                items: expList.filter((d) => {
                    return !d.group
                }).map((d) => {
                    return {
                        id: d.name,
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
                id: cur.name,
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
        const myGroupsOrdered = colMapping.groupsOrdered ? colMapping.groupsOrdered : Object.keys(groupData).filter(a => a !== "experiments") || []
        return {groupData: groupData, column: colMapping.intCol, groupsOrdered: myGroupsOrdered}
    }


    // format the data for the backend
    const prepareParams = (params) => {
        const colMapping = props.data.columnInfo.columnMapping

        const experimentDetails = Object.values(colMapping.experimentDetails).reduce((sum, d) => {
            const group = Object.values(params.groupData).reduce((acc, g) => {
                const item = g.items.find((i) => {
                    return i.name === d.name
                })
                return item ? {name: g.name, item: item} : acc
            }, {})

            const myName = group && group.item ? group.item.name : d.name

            sum[myName] = {fileName: d.fileName, name: myName, isSelected: d.isSelected, originalName: d.originalName}
            if (group && group.name !== "Experiments") {
                sum[myName].group = group.name
            }
            return sum
        }, {})

        return {experimentDetails: experimentDetails, intCol: params.column, groupsOrdered: params.groupsOrdered}
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
            const items = v.items.map(i => i.id === expIdx ? {...i, name: newName, id: newName} : i)
            a[key] = {...v, items: items};
            return a;
        }, {});
    }

    const changeExpName = (expIdx, newName) => {
        const newGroupData = computeNewGroupData(expIdx, newName)
        const newLocalParams = {...localParams, groupData: newGroupData}
        setLocalParams(newLocalParams)
        const colMapping = props.data.columnInfo.columnMapping
        const newExpNames = colMapping.experimentNames.map(e => e === expIdx ? newName : e)
        let newExpDetails = {...colMapping.experimentDetails}
        newExpDetails[expIdx] = {...newExpDetails[expIdx], name: newName}
        const newParams = {...colMapping, experimentDetails: newExpDetails, experimentNames: newExpNames}
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
            params: prepareParams(localGroupParams)
        }))
        setShowModal(false)
        setLocalGroupParams(undefined)
    }

    const handleGroupModalCancel = (e) => {
        if(e.type !== "keydown"){
            setLocalParams(initializeLocalParams())
            setShowModal(false)
            setLocalGroupParams(undefined)
        }
    }

    const handleGroupModalOpen = () => {
        setLocalGroupParams({...localParams})
        setGroupModalKey(groupModalKey + 1)
        setShowModal(true)
    }

    const isDone = props.data.status === "done"

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type), results && results.nrProteinGroups, isDone)}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              commonResult={props.data.commonResult}
                              intCol={intCol}
                              tableNr={props.data.nr}
                              experimentDetails={props.data.columnInfo && props.data.columnInfo.columnMapping.experimentDetails}
                              resType={props.resType}
                              isSelected={props.isSelected}
                              isLocked={props.isLocked}
                              error={props.data.error}
                              hasImputed={false}/>
        }>
            {colInfo && results && <div>
                <Row>
                    <Col span={8}>
                        <Row>
                            <Button onClick={() => handleGroupModalOpen()}
                                    disabled={props.isLocked}
                                    danger={groupsDefined ? ChangeGroupButton.danger : defineGroupButton.danger}
                                    type={'primary'}
                                    size={"small"}>{groupsDefined ? ChangeGroupButton.text : defineGroupButton.text}</Button>
                        </Row>
                        <Row className={"analysis-step-row"} style={{marginTop: "10px"}}>
                        <span><strong>Default intensity column</strong><br></br>
                    <Select className={"analysis-step-row"} value={props.data.columnInfo.columnMapping.intCol} disabled={props.isLocked}
                            style={{width: "100%"}}
                            onChange={changeIntensity}>
                        {numCols.map((n, i) => {
                            return <Option key={i} value={i}>{n}</Option>
                        })}</Select>
                </span>
                        </Row>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                        {results.softwareVersion &&
                            <Row className={"analysis-step-row"}>
                                <Col><strong>Version:</strong></Col>
                                <Col>&nbsp;{results.softwareVersion}</Col>
                            </Row>
                        }
                        {results.spectronautSetup &&
                            <Row className={"analysis-step-row"}>
                                <Col><strong>Analysis date:</strong></Col>
                                <Col>&nbsp;{results.spectronautSetup.analysisDate}</Col>
                            </Row>
                        }
                        {results.fastaFiles &&
                            <Row className={"analysis-step-row"}>
                                <Col><strong>Fasta files:</strong></Col>
                                <Col>
                                    {results.fastaFiles.map(f => {
                                        return <Row key={f}>&nbsp;{f}</Row>
                                    })}
                                </Col>
                            </Row>
                        }
                        {results.spectronautSetup && results.spectronautSetup.libraries &&
                            <Row className={"analysis-step-row"}>
                                <Col><strong>Libraries:</strong></Col>
                                <Col>
                                    {results.spectronautSetup.libraries.map(f => {
                                        return <Row key={f.name}>&nbsp;{f.name}</Row>
                                    })}
                                </Col>
                            </Row>
                        }
                        <Row className={"analysis-step-row"}>
                            {results && results.maxQuantParameters &&
                                <span><strong>Match between runs: </strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}
                </span>}
                        </Row>
                    </Col>
                        {isDone && getTableCol(results.nrProteinGroups, props.data.nr, setShowTable)}
                </Row>

                <StepComment stepId={props.data.id} resultId={props.resultId} isLocked={props.isLocked}
                             comment={props.data.comments}></StepComment>

                {showTable && getTable(props.data.id, props.data.nr, setShowTable)}
            </div>
            }
            <Modal open={showModal} onOk={() => handleGroupModalOk()}
                   onCancel={(e) => handleGroupModalCancel(e)} width={1000} bodyStyle={{overflowY: 'scroll'}}>
                <DefineGroupsParams key={groupModalKey}
                                    analysisIdx={props.analysisIdx}
                                    params={localGroupParams}
                                    commonResult={props.data.commonResult}
                                    prepareParams={prepareParams}
                                    setParams={setLocalGroupParams}
                                    changeExpName={changeExpName}
                >
                </DefineGroupsParams>
            </Modal>
        </Card>
    )
        ;
}
