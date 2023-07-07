import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';
import TTestGroupSelection from "./TTestGroupSelection"
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function TTestParams(props) {

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
                multiTestCorr: 'BH',
                signThres: 0.05,
                columns: initCols
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
                setUseDefaultCol(props.params.field ? false: true)
            }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, field: null})
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

    function setColumns(columns){
        props.setParams({...props.params, columns: columns})
    }

    function showOptions(){
        return <>
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
                <h3>Define pairs</h3>
                {props.params && props.params.columns && <TTestGroupSelection columns={props.params.columns} setColumns={setColumns}></TTestGroupSelection>}
            </Space>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );

}
