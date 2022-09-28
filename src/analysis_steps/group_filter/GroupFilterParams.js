import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';

const {Option} = Select;

export default function GroupFilterParams(props) {

    const numCols = props.commonResult.numericalColumns
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if (!props.params) {
            props.setParams({filterInGroup: 'one_group', minNrValid: 0})
            setUseDefaultCol(true)
        } else {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.field ? false : true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, field: null})
    }

    function handleChange(value) {
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

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
         <Checkbox
             onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
         </Checkbox>
        <Select disabled={useDefaultCol}
                value={props.params.field || props.intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
        </Select>
            <span>
            <span style={{paddingRight: "10px"}}>Min number of valid values</span>
            <InputNumber
                value={props.params.minNrValid}
                onChange={(val) => valueChange("minNrValid", val)}></InputNumber>
            </span>
            <span>
            <span style={{paddingRight: "10px"}}>Number of valid entries required in</span>
            <Select value={props.params.filterInGroup} style={{width: 250}} onChange={filterInGroupChange}>
                <Option value={'one_group'}>one group</Option>
                <Option value={'all_groups'}>all groups</Option>
            </Select>
        </span>
            </Space>
        </>
    }

    return (<>
        {props.params && showOptions()}
    </>);
}
