import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';

const {Option} = Select;

export default function ImputationParams(props) {

    const numCols = props.commonResult.numericalColumns
    const intColName = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if(!props.params){
            props.setParams({
                intCol: intColName,
                imputationType: 'normal',
                normImputationParams: {
                    width: 0.3,
                    downshift: 1.8,
                    seed: 1
                }
            })
            setUseDefaultCol(true)
        }else{
            if(useDefaultCol === undefined){
                setUseDefaultCol(props.params.inCol ? false: true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, intCol: numCols[value]})
    }

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, intCol: null})
    }

    function impChange(value) {
        props.setParams({...props.params, imputationType: value})
    }

    function valueChange(field, value) {
        let newParams = {...props.params.imputationParams}
        newParams[[field]] = value
        props.setParams({...props.params, imputationParams: newParams})
    }

    function valueParams() {
        return <span style={{paddingLeft: "10px"}}>
            <InputNumber onChange={(val) => valueChange("replaceValue", val)}></InputNumber>
        </span>
    }

    function normalParams() {
        return <span style={{paddingLeft: "10px"}}>
                <span style={{paddingLeft: "10px"}}>Width <InputNumber
                    value={props.params.normImputationParams.width}
                    onChange={(val) => valueChange("width", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Downshift <InputNumber
                    value={props.params.normImputationParams.downshift}
                    onChange={(val) => valueChange("downshift", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Seed <InputNumber
                    value={props.params.normImputationParams.seed}
                    onChange={(val) => valueChange("seed", val)}></InputNumber></span>
            </span>
    }

    function showOptions(){
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.intCol || props.intCol} style={{width: 250}} onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}
                </Select>
                <h3>Imputation</h3>
                <span>
                <Select value={props.params.imputationType} style={{width: 250}} onChange={impChange}>
                    <Option value={'normal'}>Normal distribution</Option>
                    <Option value={'nan'}>Replace by NaN</Option>
                    <Option value={'value'}>Fix value</Option>
                </Select>
                    {props.params.imputationType === "value" && valueParams()}
                    {props.params.imputationType === "normal" && normalParams()}
                </span>
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
