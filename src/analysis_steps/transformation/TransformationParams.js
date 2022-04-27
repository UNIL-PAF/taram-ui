import React from "react";
import {Checkbox, Select} from 'antd';

const {Option} = Select;

export default function TransformationParams(props) {

    const numCols = props.data.commonResult.numericalColumns
    const intCol = numCols.findIndex(c => {
         const selCol = props.selCol ? props.selCol : props.data.commonResult.intCol
        return  selCol === c
    })

    function handleChange(value) {
        props.setSelCol(numCols[value])
    }

    function checkboxChange(e){
        console.log(`checked = ${e.target.checked}`);
        props.setLogScale(e.target.checked)
    }

    return (
        <>
            <h3>Select data column for Boxplot</h3>
            <Select defaultValue={intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
            <br></br>
            <Checkbox
                onChange={checkboxChange} defaultChecked={props.logScale}>Use logarithmic scale (log2)
            </Checkbox>

        </>
    );
}
