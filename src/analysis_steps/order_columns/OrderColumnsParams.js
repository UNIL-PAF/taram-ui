import React, {useEffect, useState} from "react";
import OrderColumnsDraggeable from "./OrderColumnsDraggeable";
import {Checkbox} from "antd";

export default function OrderColumnsParams(props) {
    const [columns, setColumns] = useState()

    function handleChange(field, checked) {
        let newParams = {...props.params}
        newParams[field] = checked
        props.setParams(newParams)
        if(checked) setColumns(moveSelIntFirst(columns))
    }

    useEffect(() => {
        const myCols = (!columns && props.commonResult && props.commonResult.headers) ? props.commonResult.headers : undefined

        if (!props.params) {
            props.setParams({
                moveSelIntFirst: false,
                moveFromeTo: []
            })
            if(myCols) setColumns(myCols)
        }else{
            if(myCols){
                const colsMoved = (props.moveSelIntFirst) ? moveSelIntFirst(myCols) : myCols
                setColumns(colsMoved)
            }
        }
    }, [props, columns])

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
                ></OrderColumnsDraggeable>
            }
        </>
    );
}
