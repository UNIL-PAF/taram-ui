import React from "react";
import {Select} from 'antd';

const {Option} = Select;

export default function BoxPlotParams(props) {

    const numCols = props.data.columnInfo.columnMapping.numericalColumns
    const intCol = numCols.findIndex(c => props.data.columnInfo.columnMapping.intColumn === c)

    function handleChange(value) {
        props.setSelCol(numCols[value])
    }

    return (
        <>
            <h3>Select data column for Boxplot</h3>
            <Select defaultValue={intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
        </>
    );
}
