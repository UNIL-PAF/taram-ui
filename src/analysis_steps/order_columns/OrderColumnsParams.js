import React, {useEffect, useState} from "react";
import OrderColumnsDraggeable from "./OrderColumnsDraggeable";
import {Button, Checkbox} from "antd";

export default function OrderColumnsParams(props) {
    const [columns, setColumns] = useState()

    useEffect(() => {
        const myCols = (!columns && props.commonResult && props.commonResult.headers) ? props.commonResult.headers : undefined

        if (!props.params) {
            props.setParams({
                moveSelIntFirst: false,
                move: []
            })
            if(myCols) setColumns(myCols)
        }else{
            if(myCols){
                const intFirst = (props.moveSelIntFirst) ? moveSelIntFirst(myCols) : myCols
                const colsMoved = moveCols(intFirst, props.params.move)
                setColumns(colsMoved)
            }
        }
    }, [props, columns])

    const moveCols = (headers, move) => {
        return headers
    }

    function handleChange(field, checked) {
        let newParams = {...props.params}
        newParams[field] = checked
        props.setParams(newParams)

        const intMoved = checked ? moveSelIntFirst(columns) : columns
        const resetCols = !checked ? moveCols(props.commonResult.headers, props.params.move) : intMoved
        setColumns(resetCols)
    }

    const reset = () => {
        props.setParams({
            moveSelIntFirst: false,
            move: []
        })
        setColumns(props.commonResult.headers)
    }

    const moveSelIntFirst = (myCols) => {
        const selCols = myCols.filter( a => a.experiment && a.experiment.field === props.intCol)
        const idxs = selCols.map(a => Number(a.idx)).sort()

        const first = idxs[0]
        const last = 1 + Number(idxs.slice(-1))

        const newCols = myCols.slice(first, last).concat(myCols.slice(0, first)).concat(myCols.slice(last))
        const newColsIdx = newCols.map((n, i) => {return {...n, idx: i}})
        return newColsIdx
    }

    return (
        <>
            <div><Button type="primary" onClick={() => reset()}>Reset</Button></div>
            <br></br>
            {props.params && <span>
                    <Checkbox checked={props.params.moveSelIntFirst}
                              onChange={(e) => handleChange("moveSelIntFirst", e.target.checked)}>
                    </Checkbox>
                    <span style={{paddingLeft: "20px"}}>Move default intensity column [{props.intCol}] first.</span>
                </span>}
            <br></br>
            <br></br>
            <h3>Change order of columns</h3>
            {
                columns && <OrderColumnsDraggeable
                    columns={columns}
                    setColumns={setColumns}
                    params={props.params}
                    setParams={props.setParams}
                ></OrderColumnsDraggeable>
            }
        </>
    );
}
