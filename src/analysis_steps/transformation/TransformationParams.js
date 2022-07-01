import React from "react";
import {Select} from 'antd';

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

    const intColName = (results && results.oldIntCol) ? results.oldIntCol : props.data.commonResult.intCol
    const intCol = numCols.findIndex(c => {
        return intColName === c
    })


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
                <Option value={'provoke-error'}>Provoke error</Option>
            </Select>
            <br></br>
            <br></br>
            <h3>Imputation</h3>
            <Select defaultValue={props.localParams.imputationType} style={{width: 250}} onChange={impChange}>
                <Option value={'none'}>None</Option>
                <Option value={'nan'}>Replace by NaN</Option>
                {/*<Option value={'normal'}>Normal distribution</Option>
                <Option value={'value'}>Fix value</Option>*/}
            </Select>

        </>
    );
}
