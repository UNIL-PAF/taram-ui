import React, {useEffect, useState} from "react";
import {Checkbox, Select} from 'antd';

const {Option} = Select;

export default function BoxPlotParams(props) {
    const [selCol, setSelCol] = useState()
    const [logScale, setLogScale] = useState(false)
    const [intCol, setIntCol] = useState(undefined)

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
    }, [props, selCol])

    useEffect(() => {
        const selColIdx = getSelColIdx(selCol)
        setIntCol(selColIdx)
        props.setParams({column: selCol, logScale: logScale})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selCol, logScale])

    const numCols = props.commonResult.numericalColumns

    function getSelColIdx(selCol){
        if(!selCol) return undefined
        return numCols.findIndex(c => {
            const mySelCol = selCol ? selCol : props.commonResult.intCol
            return  mySelCol === c
        })
    }

    function handleChange(value) {
        setSelCol(numCols[value])
    }

    function checkboxChange(e){
        setLogScale(e.target.checked)
    }

    return (
        <>
            <h3>Select data column for Boxplot</h3>
            {intCol && <Select defaultValue={intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}</Select>
            }
            <br></br>
            <Checkbox
                onChange={checkboxChange} checked={logScale}>Use logarithmic scale (log2)
            </Checkbox>

        </>
    );
}
