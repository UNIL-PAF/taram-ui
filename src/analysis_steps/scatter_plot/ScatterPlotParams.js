import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space} from 'antd';

const {Option} = Select;

export default function ScatterPlotParams(props) {

    const [useDefaultCol, setUseDefaultCol] = useState()
    const numCols = props.commonResult.numericalColumns
    const expNames = props.commonResult.headers.reduce((acc, h) => {
        if (acc.field) {
            if (h.experiment && h.experiment.field === acc.field) {
                acc.res.push(h.experiment.name)
            }
        } else if (h.experiment) {
            acc.field = h.experiment.field
            acc.res.push(h.experiment.name)
        }
        return acc
    }, {field: undefined, res: []}).res

    console.log(expNames)

    useEffect(() => {
        if (props.params) {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.column ? false : true)
            }
        } else {
            props.setParams({scale: true})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleColChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function handleAxisChange(target) {
        return function (value) {
            const myParams = props.params
            myParams[target] = expNames[value]
            props.setParams(myParams)
        }
    }

    function checkboxChange(e) {
        props.setParams({...props.params, scale: e.target.checked})
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
                        onChange={handleColChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                <Select value={props.params.xAxis} style={{width: 250}}
                        onChange={handleAxisChange("xAxis")}>
                    {expNames.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                <Select value={props.params.yAxis} style={{width: 250}}
                        onChange={handleAxisChange("yAxis")}>
                    {expNames.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select data column for Scatter plot</h3>
            {props.params && showOptions()}
        </>
    );
}
