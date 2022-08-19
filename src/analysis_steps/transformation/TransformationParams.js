import React from "react";
import {InputNumber, Select} from 'antd';

const {Option} = Select;

export default function TransformationParams(props) {

    const results = JSON.parse(props.data.results)
    const numCols = (results && results.oldNumCols) ? results.oldNumCols : props.data.commonResult.numericalColumns

    function handleChange(value) {
        props.setLocalParams({...props.localParams, intCol: numCols[value]})
    }

    function transChange(value) {
        props.setLocalParams({...props.localParams, transformationType: value})
    }

    function normChange(value) {
        props.setLocalParams({...props.localParams, normalizationType: value})
    }

    function impChange(value) {
        props.setLocalParams({...props.localParams, imputationType: value})
    }

    function valueChange(field, value) {
        let newParams = {...props.localParams.imputationParams}
        newParams[[field]] = value
        props.setLocalParams({...props.localParams, imputationParams: newParams})
    }

    const intColName = (results && results.oldIntCol) ? results.oldIntCol : props.data.commonResult.intCol
    const intCol = numCols.findIndex(c => {
        return intColName === c
    })

    function valueParams() {
        return <span style={{paddingLeft: "10px"}}>
            <InputNumber onChange={(val) => valueChange("replaceValue", val)}></InputNumber>
        </span>
    }

    function normalParams() {
        return <span style={{paddingLeft: "10px"}}>
                <span style={{paddingLeft: "10px"}}>Width <InputNumber
                    defaultValue={0.3}
                    onChange={(val) => valueChange("width", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Downshift <InputNumber
                    defaultValue={1.8}
                    onChange={(val) => valueChange("downshift", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Seed <InputNumber
                    defaultValue={1}
                    onChange={(val) => valueChange("seed", val)}></InputNumber></span>
            </span>
    }

    return (
        <>
            <h3>Select value to transform</h3>
            <Select defaultValue={intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
            <br></br>
            <br></br>
            <h3>Transformation</h3>
            <Select defaultValue={props.localParams.transformationType} style={{width: 250}} onChange={transChange}>
                <Option value={'none'}>None</Option>
                <Option value={'log2'}>Log2</Option>
            </Select>
            <br></br>
            <br></br>
            <h3>Normalization</h3>
            <Select defaultValue={props.localParams.normalizationType} style={{width: 250}} onChange={normChange}>
                <Option value={'none'}>None</Option>
                <Option value={'median'}>Median</Option>
                <Option value={'mean'}>Mean</Option>
            </Select>
            <br></br>
            <br></br>
            <h3>Imputation</h3>
            <Select defaultValue={props.localParams.imputationType} style={{width: 250}} onChange={impChange}>
                <Option value={'none'}>None</Option>
                <Option value={'normal'}>Normal distribution</Option>
                <Option value={'nan'}>Replace by NaN</Option>
                <Option value={'value'}>Fix value</Option>
            </Select>
            {props.localParams.imputationType === "value" && valueParams()}
            {props.localParams.imputationType === "normal" && normalParams()}

        </>
    );
}
