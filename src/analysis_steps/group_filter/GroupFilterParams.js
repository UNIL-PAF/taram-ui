import React from "react";
import {InputNumber, Select} from 'antd';

const {Option} = Select;

export default function GroupFilterParams(props) {



    const numCols = props.commonResult.numericalColumns
    const intCol = numCols.findIndex(c => {
        const selCol = props.selCol ? props.selCol : props.commonResult.intCol
        return selCol === c
    })

    function handleChange(value) {
        console.log({...props.params, field: numCols[value]})
        props.setParams({...props.params, field: numCols[value]})
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function filterInGroupChange(value) {
        props.setParams({...props.params, filterInGroup: value})
    }

    return (<>
        <span>
            <span style={{paddingRight: "10px"}}>Value to filter on</span>
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
            <span style={{paddingRight: "10px"}}>Min number of valid values</span>
            <InputNumber
                defaultValue={0}
                onChange={(val) => valueChange("minNrValid", val)}></InputNumber>
        </span>
        <br/>
        <br/>
        <span>
            <span style={{paddingRight: "10px"}}>Number of valid entries required in</span>
            <Select defaultValue={'one_group'} style={{width: 250}} onChange={filterInGroupChange}>
                <Option value={'one_group'}>One groups</Option>
                <Option value={'all_groups'}>All groups</Option>
            </Select>
        </span>
    </>);
}
