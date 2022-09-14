import React, {useEffect, useState} from "react";
import {Card} from 'antd';
import AnalysisStepMenu from "../AnalysisStepMenu"
import InitialResultParams from "./InitialResultParams";
import StepComment from "../StepComment";

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)
    const [localParams, setLocalParams] = useState()

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

            const newGroupData = [{
                name: "Condition",
                alreadySet: false,
                targetKeys: [],
                dataSource: expData.map((exp) => {
                    return {key: exp.key, title: exp.name, disabled: !exp.isSelected}
                })
            }]

            const expList = Object.values(colMapping.experimentDetails)
            const groups = [...new Set(expList.map((e) => e.group))].filter((e) => e != null)

            //const initialGroups = groups.map((e) => ({e : {name: e, "alreadySet": true, targetKeys: [], dataSource: []}}))
            const initialGroups = groups.reduce((acc, cur) => ({ ...acc, [cur]: {name: cur, "alreadySet": true, targetKeys: [], dataSource: []}}), {})

            const loadedGroupData = expList.reduce((acc, cur) => {
                const cleaned = {key: cur.originalName, title: cur.name, disabled: true}
                groups.forEach((g) => {
                    const sameGroup = (g === cur.group)
                    const dataSource = sameGroup ? {...cleaned, disabled: false} : cleaned
                    acc[g].dataSource.push(dataSource)
                    if(sameGroup) acc[g].targetKeys.push(cleaned.key)
                })
                return acc
            }, initialGroups)

            const groupData = (groups.length >= 1) ? Object.values(loadedGroupData) : newGroupData
            setLocalParams({expData: expData, groupData: groupData})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    // format the data for the backend
    const prepareParams = (params) => {
        return params.expData.reduce( (sum, d) => {
            const group = params.groupData.find( (g) => {return g.targetKeys.includes(d.key)})
            sum[d.key] = { fileName: d.fileName, name: d.name, isSelected: d.isSelected, originalName: d.originalName }
            if(group) {sum[d.key].group = group.name}
            return sum
        }, {})
    }

    return (
        <Card className={"analysis-step-card"} title={"Initial result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              commonResult={props.data.commonResult} stepParams={localParams}
                              prepareParams={prepareParams}
                              paramComponent={<InitialResultParams analysisIdx={props.analysisIdx}
                                                                   params={localParams} commonResult={props.data.commonResult}
                                                                   setParams={setLocalParams}></InitialResultParams>}/>
        }>
            {results && results.maxQuantParameters && <p>Match between runs: <strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}</strong></p>}
            <p>Protein groups: <strong>{results && results.nrProteinGroups}</strong></p>
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}
