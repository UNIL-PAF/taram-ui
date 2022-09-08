import React, {useEffect, useState} from "react";
import {Checkbox, Select} from 'antd';

const {Option} = Select;

export default function BoxPlotParams(props) {
    const [selCol, setSelCol] = useState()
    const [logScale, setLogScale] = useState(false)

    useEffect(() => {
        if(! selCol){
            if (props.params) {
                const params = JSON.parse(props.params)
                setSelCol(params.column)
                setLogScale(params.logScale)
            } else {
                setSelCol(props.commonResult.intCol)
            }
        }
        setBoxplotParams()
    }, [props, selCol, logScale])

    const numCols = props.commonResult.numericalColumns
    const intCol = () => numCols.findIndex(c => {
         const mySelCol = selCol ? selCol : props.commonResult.intCol
        return  mySelCol === c
    })

    function handleChange(value) {
        setSelCol(numCols[value])
    }

    function checkboxChange(e){
        setLogScale(e.target.checked)
    }

    function setBoxplotParams(){
        props.setParams({column: selCol, logScale: logScale})
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
                onChange={checkboxChange} defaultChecked={logScale}>Use logarithmic scale (log2)
            </Checkbox>

        </>
    );
}
