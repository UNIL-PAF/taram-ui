import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space, Typography} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;
const { Text } = Typography;

export default function NormalizationParams(props) {
    const numCols = getNumCols(props.commonResult.headers)
    const [useDefaultCol, setUseDefaultCol] = useState()
    const isLog = props.commonResult.intColIsLog

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: null,
                normalizationType: 'median',
                normalizationCalculation: (isLog ? "substraction" : "division")
            })
            setUseDefaultCol(true)
        } else {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.inCol ? false : true)
            }
            if(props.params.normalizationCalculation === undefined){
                props.setParams({...props.params, normalizationCalculation: (isLog ? "substraction" : "division")})
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

    function normChange(value, field) {
        let newParams = {...props.params}
        newParams[field] = value
        props.setParams(newParams)
    }

    function calcText(){
        if(isLog){
            return <Text type="danger">You have logarithmic data, so you should do a <strong>substraction</strong>.</Text>
        }else{
            return <Text type={"danger"}>If your data is <strong>not</strong> logarithmic, you should do a <strong>division</strong>.</Text>
        }
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
                <Select value={props.params.normalizationType} style={{width: 250}} onChange={(value) => normChange(value, "normalizationType")}>
                    <Option value={'median'}>Median</Option>
                    <Option value={'mean'}>Mean</Option>
                </Select>
                {calcText()}
                <Select value={props.params.normalizationCalculation} style={{width: 250}} onChange={(value) => normChange(value, "normalizationCalculation")}>
                    <Option value={'substraction'}>Substract</Option>
                    <Option value={'division'}>Divide</Option>
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
