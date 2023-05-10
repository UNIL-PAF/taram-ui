import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space} from 'antd';
import {getNumCols} from "../CommonStep";

const {Option} = Select;

export default function NormalizationParams(props) {

    const numCols = getNumCols(props.commonResult.headers)
    const intColName = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: intColName,
                normalizationType: 'median',
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

    function normChange(value) {
        props.setParams({...props.params, normalizationType: value})
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
                <h3>Normalization</h3>
                <Select value={props.params.normalizationType} style={{width: 250}} onChange={normChange}>
                    <Option value={'median'}>Median</Option>
                    <Option value={'mean'}>Mean</Option>
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
