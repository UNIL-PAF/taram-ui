import React, {useEffect, useState} from "react";
import {Card, Checkbox, InputNumber, Select, Space} from 'antd';
import {getNumCols} from "../CommonStepUtils";
import StatTestGroupSelection from "./StatTestGroupSelection";
import {getStatTestName} from "./StatTestType";

const {Option} = Select;

export default function StatTestParams(props) {

    const numCols = getNumCols(props.commonResult.headers)
    const intCol = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()

    const groups = props.commonResult.headers.reduce((acc, cur) => {
        const expName = cur.experiment && cur.experiment.name ? cur.experiment.name : null
        const group = expName ? props.experimentDetails[expName].group : null
        return (group && !acc.includes(group)) ? acc.concat(group) : acc
    }, [])

    const getGroupColor = (availableGroups, name) => {
        const myGrp = availableGroups.find(a => a.name === name)
        return myGrp ? myGrp.color : undefined
    }

    const availableGroups = groups.map( (g, i) => {return {name: g, id: g + "-0-" + i, color: i}})
    const firstGroup =  (props.params && props.params.firstGroup) ?  props.params.firstGroup.map( (g, i) => {return {name: g, id: g + "-1-" + i, color: getGroupColor(availableGroups, g)}}) : []
    const secondGroup =  (props.params && props.params.secondGroup) ?  props.params.secondGroup.map( (g, i) => {return {name: g, id: g + "-2-" + i, color: getGroupColor(availableGroups, g)}}) : []

    const initCols = {
        available: {
            name: "Available groups",
            id: 0,
            items: availableGroups
        },
        first: {name: "First group (left)", id: 1, items: firstGroup},
        second: {name: "Second group (right)", id: 2, items: secondGroup}
    }

    useEffect(() => {
        if(!props.params){
            props.setParams({
                field: intCol,
                statTestType: 'welch_t_test',
                multiTestCorr: 'BH',
                signThres: 0.05,
                columns: initCols,
                limmaParams: {
                    trend: true
                }
            })
            setUseDefaultCol(true)
        }else{
            if(!props.params.columns){
                props.setParams({
                   ...props.params,
                  columns: initCols
                })
            }
            if(useDefaultCol === undefined){
                setUseDefaultCol(!props.params.field)
            }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, field: null})
    }

    function changeFilterOnValid(e){
        props.setParams({...props.params, filterOnValid: e.target.checked})
    }

    function handleChange(value) {
        props.setParams({...props.params, field: numCols[value]})
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function multiTestCorrChange(value) {
        props.setParams({...props.params, multiTestCorr: value})
    }

    function statTestTypeChange(value) {
        props.setParams({...props.params, statTestType: value})
    }

    function setColumns(columns){
        props.setParams({...props.params, columns: columns})
    }

    function changePaired(){
        props.setParams({...props.params, paired: !props.params.paired})
    }

    function changeLimmaParams(field, newVal){
        const newLimmaParams = {...props.params.limmaParams}
        newLimmaParams[field] = newVal
        props.setParams({...props.params, limmaParams: newLimmaParams})
    }

    function showLimmaParams() {
        return <>
            <Checkbox
                onChange={(a) => changeLimmaParams("trend", a)} checked={props.params.limmaParams.trend}>TREND
            </Checkbox>
        </>
    }

    function showOptions(){
        const types = ["welch_t_test", "student_t_test", "limma"]

        return <>
                <Card title={"Statistical test"}>
                    <Space direction="vertical" size="middle">
                     <div>
                        <Select value={props.params.statTestType} style={{width: 250}} onChange={statTestTypeChange}>
                            {types.map(type => (
                                <Option key={type} value={type}>{getStatTestName(type)}</Option>
                            ))}
                        </Select>
                    </div>
                {props.params.statTestType === "limma" && showLimmaParams()}
                        </Space>
                </Card>
                <Card style={{marginTop: "20px"}} >
                    <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select
                    disabled={useDefaultCol}
                    value={props.params.field || props.intCol} style={{width: 250}} onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}
                </Select>
                <span>
            <span style={{paddingRight: "10px"}}>Significance threshold</span>
            <InputNumber
                min={0.000001} max={0.999}
                value={props.params.signThres}
                onChange={(val) => valueChange("signThres", val)}></InputNumber>
        </span>
                <span>
            <span style={{paddingRight: "10px"}}>Multiple testing correction</span>
            <Select value={props.params.multiTestCorr} style={{width: 250}} onChange={multiTestCorrChange}>
                <Option value={'BH'}>Benjamini & Hochberg (FDR)</Option>
                <Option value={'none'}>None</Option>
            </Select>
        </span>
                <span>
               <Checkbox
                   onChange={changeFilterOnValid} checked={props.params.filterOnValid}>
            </Checkbox>
            <span style={{padding: "10px", color: props.params.filterOnValid ? "black" : "grey"}}>Compute only comparisons with at least </span>
            <InputNumber
                min={1}
                disabled={!props.params.filterOnValid}
                value={props.params.minNrValid}
                onChange={(val) => valueChange("minNrValid", val)}></InputNumber>
                    <span style={{paddingLeft: "10px", color: props.params.filterOnValid ? "black" : "grey"}}>valid (non-imputed) values in one group.</span>
        </span>
                        { props.params.statTestType !== "limma" &&
                            <span><Checkbox
                            onChange={changePaired} checked={props.params.paired}>Paired
            </Checkbox></span>
                        }
                <h3>Define groups</h3>
                {props.params && props.params.columns &&
                    <StatTestGroupSelection columns={props.params.columns} setColumns={setColumns}></StatTestGroupSelection>}
                    </Space>
                </Card>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );

}
