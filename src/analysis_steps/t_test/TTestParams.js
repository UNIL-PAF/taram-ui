import React from "react";
import {InputNumber, Select} from 'antd';

const {Option} = Select;

export default function TTestParams(props) {

    const numCols = props.data.commonResult.numericalColumns
    const intCol = numCols.findIndex(c => {
        const selCol = props.selCol ? props.selCol : props.data.commonResult.intCol
        return selCol === c
    })

    function handleChange(value) {
        props.setLocalParams({...props.localParams, field: numCols[value]})
    }

    function valueChange(field, value) {
        let newParams = {...props.localParams}
        newParams[[field]] = value
        props.setLocalParams(newParams)
    }

    function filterInGroupChange(value) {
        props.setLocalParams({...props.localParams, filterInGroup: value})
    }

    return (<>
        <span>
            <span style={{paddingRight: "10px"}}>Compute t-test based on </span>
            <Select
                defaultValue={intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
        </span>
        <br/>
        <br/>
        <span>
            <span style={{paddingRight: "10px"}}>Significance threshold</span>
            <InputNumber
                defaultValue={props.localParams.signThres}
                onChange={(val) => valueChange("signThres", val)}></InputNumber>
        </span>
        <br/>
        <br/>
        <span>
            <span style={{paddingRight: "10px"}}>Multiple testing correction</span>
            <Select defaultValue={props.localParams.multiTestCorr} style={{width: 250}} onChange={filterInGroupChange}>
                <Option value={'BH'}>Benjamini & Hochberg (FDR)</Option>
                <Option value={'bonferroni'}>Bonferroni</Option>
            </Select>
        </span>
    </>);
}
