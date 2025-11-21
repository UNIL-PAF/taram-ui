import React, {useEffect, useState} from "react";
import {Checkbox, Col, Row, Select, Space} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function CorrelationTableParams(props) {
    const intColName = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()
    const numCols = getNumCols(props.commonResult.headers)

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: intColName,
                correlationType: 'pearson',
            })
            setUseDefaultCol(true)
        } else {
            if(useDefaultCol === undefined){
                setUseDefaultCol(!props.params.column)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params, useDefaultCol])

    function transChange(value) {
        props.setParams({...props.params, correlationType: value})
    }

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, column: null})
    }

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function showOptions() {
        return <Row>
            <Col span={12}>
                <h3>Select data column</h3>
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.column || props.intCol} style={{width: 250}} onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
            </Col>
            <Col span={12}>
                        <Space direction="vertical" size="middle">
                            <h3>Correlation type</h3>
                            <Select value={props.params.correlationType} style={{width: 250}} onChange={transChange}>
                                <Option value={'pearson'}>Pearson</Option>
                                <Option value={'spearman'}>Spearman</Option>
                            </Select>
                        </Space>
            </Col>
        </Row>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );
}