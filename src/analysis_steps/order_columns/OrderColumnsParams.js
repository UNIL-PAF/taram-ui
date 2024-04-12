import React, {useEffect, useState} from "react";
import OrderColumnsDraggeable from "./OrderColumnsDraggeable";
import {Button, Checkbox} from "antd";

export default function OrderColumnsParams(props) {
    const [columns, setColumns] = useState()

    useEffect(() => {
        if(!columns) {
            const myCols = (props.commonResult && props.commonResult.headers) ? props.commonResult.headers : undefined

            if (!props.params) {
                props.setParams({
                    moveSelIntFirst: false,
                })
                if (myCols) {
                    setColumns(myCols.map(a => {return {...a, id: a.idx}}))
                }
            } else {
                if (myCols) {
                    const orderedCols = props.params.newOrder.map( idx => {
                        return myCols.find(a => a.idx === idx)
                    })
                    setColumns(orderedCols.map((a, i) => {return {...a, id: i}}))
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, columns])


    function handleChange(field, checked) {
        let newParams = {...props.params}
        newParams[field] = checked
        const origHeaders = props.commonResult.headers
        const intMoved = checked ? moveSelIntFirst(origHeaders) : origHeaders
        setColumns(intMoved.map((a, i) => {return {...a, id: i}}))
        const newOrder = intMoved.map(a => a.idx)
        props.setParams({...newParams, newOrder: newOrder})
    }

    const reset = () => {
        props.setParams({
            moveSelIntFirst: false
        })
        setColumns(props.commonResult.headers.map(a => {return {...a, id: a.idx}}))
    }

    const moveSelIntFirst = (myCols) => {
        const selCols = myCols.filter( a => a.experiment && a.experiment.field === props.intCol)

        const idxs = selCols.map(a => Number(a.idx)).sort(function(a, b) {
            return a - b;
        });

        const first = idxs[0]
        const last = 1 + Number(idxs.slice(-1))

        const newCols = myCols.slice(first, last).concat(myCols.slice(0, first)).concat(myCols.slice(last))
        return newCols
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
