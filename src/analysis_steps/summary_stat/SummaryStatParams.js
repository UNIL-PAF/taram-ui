import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space} from 'antd';
import {getNumCols} from "../CommonStep";

const {Option} = Select;

export default function SummaryStatParams(props) {

    const numCols = getNumCols(props.commonResult.headers)
    const intColName = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: intColName,
            })
            setUseDefaultCol(true)
        } else {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.inCol ? false : true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, intCol: numCols[value]})
    }

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, intCol: null})
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.intCol || props.intCol} style={{width: 250}}
                        onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}
                </Select>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select value</h3>
            {props.params && showOptions()}
        </>
    );
}
