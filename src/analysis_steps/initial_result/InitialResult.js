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

        const groups = colMapping.groupsOrdered || [...new Set(expList.map((e) => e.group))].filter((e) => e != null)

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

        const groupDataOrderedExps = Object.fromEntries(Object.entries(groupData).map(([k, v]) => {
            const newItems = v.items.sort((x, y) => x.name.localeCompare(y.name))
            return [k, {...v, items: newItems}]
        }));

        return {groupData: groupDataOrderedExps, column: colMapping.intCol, groupsOrdered: myGroupsOrdered, experimentNames: colMapping.experimentNames}
    }

    // format the data for the backend
    const prepareParams = (params) => {
        const anyGroupDefined = Object.values(params.groupData).reduce( (a, v) => (a || (v.name !== "Experiments" && v.items.length > 0)) ? true : false, false)

        const experimentDetails = Object.fromEntries(params.experimentNames.map(expName => {
            const oneItem =  params.groupsOrdered.reduce((acc, k) => {
                const v = params.groupData[k]
                const item = v.items.find((i) => {
                    return i.name === expName
                })
                const isSelected = (anyGroupDefined && k === "experiments") ? false : true
                const newItem =  !acc && item ? {...item, group: (k !== 'experiments' ? k : undefined), isSelected: isSelected} : acc
                return newItem
            }, null)

           return [oneItem.name, oneItem]
        }))

        let idx = 0
        params.groupsOrdered.forEach((a) => {
            params.groupData[a].items.forEach((b) => {
                experimentDetails[b.name].idx = idx
                idx ++
            })
        })

        // keep only unique
        const groupsOrdered = params.groupsOrdered.filter((v,i,a) => a.indexOf(v) === i)
        return {experimentDetails: experimentDetails, intCol: params.column, groupsOrdered: groupsOrdered, experimentNames: params.experimentNames}
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
                              key={props.data.id + "-" + props.data.nextId ? props.data.nextId : ""}
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
                        {results && results.maxQuantParameters && <Row className={"analysis-step-row"}>
                            <Col><strong>Match between runs: </strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}</Col>
                        </Row>}
                        {results && results.maxQuantParameters && results.maxQuantParameters.someGenesParsedFromFasta &&
                            <Row className={"analysis-step-row"}>
                                <Col><strong>Some gene and protein names were parsed from column <em>Fasta.headers</em>.</strong></Col>
                            </Row>}
                        {results && results.maxQuantParameters && results.maxQuantParameters.allGenesParsedFromFasta &&
                            <Row className={"analysis-step-row"}>
                                <Col><strong><em>Gene.names</em> and <em>Protein.names</em> were parsed from column <em>Fasta.headers</em>.</strong></Col>
                            </Row>}
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
                >
                </DefineGroupsParams>
            </Modal>
        </Card>
    )
        ;
}
