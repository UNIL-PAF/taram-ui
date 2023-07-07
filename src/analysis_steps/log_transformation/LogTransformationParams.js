import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function LogTransformationParams(props) {

    const numCols = getNumCols(props.commonResult.headers)
    const intColName = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: intColName,
                transformationType: 'log2',
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

    function transChange(value) {
        props.setParams({...props.params, transformationType: value})
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values
                    [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.intCol || props.intCol} style={{width: 250}}
                        onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}
                </Select>
                <h3>Transformation</h3>
                <Select value={props.params.transformationType} style={{width: 250}} onChange={transChange}>
                    <Option value={'log2'}>Log2</Option>
                </Select>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select value to transform</h3>
            {props.params && showOptions()}
        </>
    );
}