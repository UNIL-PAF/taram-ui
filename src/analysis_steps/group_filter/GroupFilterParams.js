import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function GroupFilterParams(props) {

    const numCols = getNumCols(props.commonResult.headers)
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if (!props.params) {
            props.setParams({filterInGroup: 'one_group', minNrValid: 1, zeroIsInvalid: true})
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

    function changeZeroIsInvalid(e) {
        props.setParams({...props.params, zeroIsInvalid: e.target.checked})
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
            <span style={{paddingRight: "10px"}}>Consider zero as invalid</span>
               <Checkbox
                   onChange={changeZeroIsInvalid} checked={props.params.zeroIsInvalid}>
                </Checkbox>
            </span>
                <span>
            <span style={{paddingRight: "10px"}}>Min number of valid values</span>
            <InputNumber
                value={props.params.minNrValid}
                min={0}
                onChange={(val) => valueChange("minNrValid", val)}></InputNumber>
            </span>
                <span>
            <span style={{paddingRight: "10px"}}>Required in</span>
            <Select value={props.params.filterInGroup} style={{width: 250}} onChange={filterInGroupChange}>
                <Option value={'total'}>total</Option>
                <Option value={'all_groups'}>each group</Option>
                <Option value={'one_group'}>at least one group</Option>
            </Select>
        </span>
            </Space>
        </>
    }

    return (<>
        {props.params && showOptions()}
    </>);
}
