import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function UmapPlotParams(props) {

    console.log(props)

    const [useDefaultCol, setUseDefaultCol] = useState()
    const numCols = getNumCols(props.commonResult.headers)

    useEffect(() => {
        if (props.params) {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.column ? false : true)
            }
        }else{
            props.setParams({scale: true})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, column: null})
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.column || props.intCol} style={{width: 250}}
                        onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                <span>
                <span style={{paddingRight: "10px"}}>Number of neighbors</span>
                <InputNumber
                    min={2} max={100}
                    value={props.params.nrOfNeighbors}
                    onChange={(val) => valueChange("nrOfNeighbors", val)}></InputNumber>
            </span>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select data column for UMAP</h3>
            {props.params && showOptions()}
        </>
    );
}
