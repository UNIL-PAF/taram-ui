import React, {useEffect} from "react";
import {InputNumber, Select} from 'antd';

const {Option} = Select;

export default function TransformationParams(props) {

    const numCols = props.commonResult.numericalColumns
    const intColName = props.commonResult.intCol

    useEffect(() => {
        if(!props.params){
            props.setParams({
                intCol: intColName,
                transformationType: 'log2',
                normalizationType: 'median',
                imputationType: 'normal',
                imputationParams: {
                    width: 0.3,
                    downshift: 1.8,
                    seed: 1
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function handleChange(value) {
        props.setParams({...props.params, intCol: numCols[value]})
    }

    function transChange(value) {
        props.setParams({...props.params, transformationType: value})
    }

    function normChange(value) {
        props.setParams({...props.params, normalizationType: value})
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
                    value={props.params.imputationParams.width}
                    onChange={(val) => valueChange("width", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Downshift <InputNumber
                    value={props.params.imputationParams.downshift}
                    onChange={(val) => valueChange("downshift", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Seed <InputNumber
                    value={props.params.imputationParams.seed}
                    onChange={(val) => valueChange("seed", val)}></InputNumber></span>
            </span>
    }

    function showOptions(){
        return <>
            <Select value={props.params.intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
            <br></br>
            <br></br>
            <h3>Transformation</h3>
            <Select value={props.params.transformationType} style={{width: 250}} onChange={transChange}>
                <Option value={'none'}>None</Option>
                <Option value={'log2'}>Log2</Option>
            </Select>
            <br></br>
            <br></br>
            <h3>Normalization</h3>
            <Select value={props.params.normalizationType} style={{width: 250}} onChange={normChange}>
                <Option value={'none'}>None</Option>
                <Option value={'median'}>Median</Option>
                <Option value={'mean'}>Mean</Option>
            </Select>
            <br></br>
            <br></br>
            <h3>Imputation</h3>
            <Select value={props.params.imputationType} style={{width: 250}} onChange={impChange}>
                <Option value={'none'}>None</Option>
                <Option value={'normal'}>Normal distribution</Option>
                <Option value={'nan'}>Replace by NaN</Option>
                <Option value={'value'}>Fix value</Option>
            </Select>
            {props.params.imputationType === "value" && valueParams()}
            {props.params.imputationType === "normal" && normalParams()}
        </>
    }

    return (
        <>
            <h3>Select value to transform</h3>
            {props.params && showOptions()}
        </>
    );
}
