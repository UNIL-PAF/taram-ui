import React, {useEffect} from "react";
import {Checkbox, Select} from 'antd';

const {Option} = Select;

export default function BoxPlotParams(props) {

    const numCols = props.commonResult.numericalColumns

    useEffect(() => {
        if(!props.params){
            props.setParams({column: getSelColIdx(props.commonResult.intCol), logScale: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function getSelColIdx(selCol){
        if(!selCol) return undefined
        return numCols.findIndex(c => {
            const mySelCol = selCol ? selCol : props.commonResult.intCol
            return  mySelCol === c
        })
    }

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function checkboxChange(e){
        props.setParams({...props.params, logScale: e.target.checked})
    }

    function showOptions(){
        return <>
            <Select value={props.params.column} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}</Select>
            <br></br>
            <Checkbox
                onChange={checkboxChange} checked={props.params.logScale}>Use logarithmic scale (log2)
            </Checkbox>
        </>
    }

    return (
        <>
            <h3>Select data column for Boxplot</h3>
            {props.params && showOptions()}
        </>
    );
}
