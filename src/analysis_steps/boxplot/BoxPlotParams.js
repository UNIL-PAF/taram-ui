import React, {useEffect} from "react";
import {Checkbox, Select} from 'antd';

const {Option} = Select;

export default function BoxPlotParams(props) {

    const numCols = props.commonResult.numericalColumns

    useEffect(() => {
        if(!props.params){
            //props.setParams({column: getSelColIdx(props.intCol), logScale: false})
            //props.setParams({column: props.intCol, logScale: false})
            props.setParams({logScale: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function checkboxChange(e){
        props.setParams({...props.params, logScale: e.target.checked})
    }

    function showOptions(){
        return <>
            <Select value={props.params.column || props.intCol} style={{width: 250}} onChange={handleChange}>
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
