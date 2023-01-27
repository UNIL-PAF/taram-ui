import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space, Row, Col} from 'antd';

const {Option} = Select;

export default function ScatterPlotParams(props) {
    const [useDefaultCol, setUseDefaultCol] = useState()
    const [useColorBy, setUseColorBy] = useState()
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

    const dataCols = props.commonResult.headers.reduce((acc, h) => {
        if (h.type === "NUMBER") {
            if (h.experiment) {
                if (!acc.includes(h.experiment.field)) acc.push(h.experiment.field)
            } else {
                acc.push(h.name)
            }
        }
        return acc
    }, [])

    useEffect(() => {
        if (props.params) {
            if (useDefaultCol === undefined) setUseDefaultCol(props.params.column ? false : true)
            if (useColorBy === undefined) setUseColorBy(props.params.colorBy ? true : false)
            // we have to reset Log transform to undefined
            if(props.params.logTrans) props.setParams({...props.params, logTrans: undefined})
        } else {
            props.setParams({xAxis: expNames[0], yAxis: expNames[1]})
            setUseDefaultCol(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleColChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function handleColorColChange(value) {
        props.setParams({...props.params, colorBy: dataCols[value]})
    }

    function handleAxisChangeX(value){
        props.setParams({...props.params, xAxis: expNames[value]})
    }

    function handleAxisChangeY(value){
        props.setParams({...props.params, yAxis: expNames[value]})
    }

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, column: props.intCol})
    }

    function handleCheckColorBy(e){
        setUseColorBy(e.target.checked)
        if(!e.target.checked){
            let myParams = props.params
            delete myParams.colorBy
            props.setParams(myParams)
        }
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Row>
                    <Space direction={"horizontal"}>
                        <Col>
                            <Select disabled={useDefaultCol} value={props.params.column} style={{width: 250}}
                                    onChange={handleColChange}>
                                {numCols.map((n, i) => {
                                    return <Option key={i} value={i}>{n}</Option>
                                })}</Select>
                        </Col>
                    </Space>
                </Row>
                <Row>
                    <Space direction={"horizontal"}>
                        <Col><span><strong>X axis</strong></span></Col>
                        <Col><Select value={props.params.xAxis} style={{width: 250}}
                                     onChange={handleAxisChangeX}>
                            {expNames.map((n, i) => {
                                return <Option key={i} value={i}>{n}</Option>
                            })}</Select></Col>
                    </Space>
                </Row>
                <Row>
                    <Space direction={"horizontal"}>
                        <Col><span><strong>X axis</strong></span></Col>
                        <Col><Select value={props.params.yAxis} style={{width: 250}}
                                     onChange={handleAxisChangeY}>
                            {expNames.map((n, i) => {
                                return <Option key={i} value={i}>{n}</Option>
                            })}</Select></Col>
                    </Space>
                </Row>
                <Checkbox
                    onChange={handleCheckColorBy} checked={useColorBy}>Color data points by
                </Checkbox>
                <Select disabled={!useColorBy} value={props.params.colorBy} style={{width: 250}}
                        onChange={handleColorColChange}>
                    {dataCols.map((n, i) => {
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
