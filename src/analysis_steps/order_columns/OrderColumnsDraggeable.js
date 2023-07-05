import React, {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {onClick, onDragEnd} from "./OrderColumnsUtils"

export default function OrderColumnsDraggeable(props) {

    const [selItems, setSelItems] = useState([])
    const [draggingItemId, setDraggingItemId] = useState()

    /*
    const onDragEnd = (result) => {
        const from = Number(result.draggableId)
        const to = result.destination.index
        const newCols = arrayMove(props.columns, from, to)
        const newColsIdx = newCols.map((n, i) => {return {...n, idx: i}})
        props.setColumns(newColsIdx)
        const newMove = props.params.move.concat({from: from, to: to})
        props.setParams({...props.params, move: newMove})
    };


    const arrayMove = (columns, fromIndex, toIndex) => {
        const element = columns[fromIndex];
        let arr = [...columns]
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr
    }

     */

    const onDragStart = (start) => {
        // if dragging an item that is not selected - unselect all items
        if (!selItems) {
            console.log("unselectAll();")
        }
        setDraggingItemId(start.draggableId)
    };

    const localDragEnd = (result) => {
        const newColumns = onDragEnd(result, props.columns, selItems)

        const destinationIdx = Number(result.destination.index)
        const sourceIdx = Number(result.source.index)
        const moveIdx = ((selItems && selItems.length) ? selItems : [sourceIdx]).sort((a,b) => a-b).reverse()

        const moved = moveIdx.reduce( (acc, idx) => {
            let currOffset = [0,0]
            let newOffset = acc.offset
            if(idx > destinationIdx){
                currOffset[0] = acc.offset[0]
                newOffset[0] = acc.offset[0] + 1
            }else{
                currOffset[1] = acc.offset[1]
                newOffset[1] = acc.offset[1] - 1
            }
            acc.moved.push({from: (idx + currOffset[0]), to: (destinationIdx + currOffset[1])})
            return {...acc, offset: newOffset}
        }, {moved: [], offset: [0, 0]}).moved

        if(newColumns){
            const corrIdx = newColumns.map( (a, i) => {return {...a, idx: i}} )
            props.setColumns(corrIdx)
        }
        setDraggingItemId(null)
        setSelItems([])
        const newMoved = props.params.move.concat(moved)

        props.setParams({...props.params, move: newMoved})
    }

    const allItems = props.columns.map( a => a.idx)

    const backgroundColor = (isDragging, isSelected) => {
        if(isDragging){
            return "#91caff"
        }else if(isSelected){
            return "#bfe3ff"
        }else return "#e6f4ff"
    }

    return (
        <div
            style={{display: "flex", justifyContent: "left", height: "100%"}}
        >
            <DragDropContext
                onDragStart={(start) => onDragStart(start)}
                onDragEnd={(result) => localDragEnd(result)}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "top"
                    }}
                >
                    <Droppable droppableId={"order"}>
                        {(provided, snapshot) => {
                            const selectionCount = selItems.length
                            const shouldShowSelection = snapshot.isDraggingOver && selectionCount > 1;

                            return (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{
                                        background: snapshot.isDraggingOver
                                            ? "lightblue"
                                            : "whitesmoke",
                                        padding: 4,
                                        width: 600,
                                        minHeight: 500
                                    }}
                                >
                                    {props.columns.map((item, index) => {

                                        const isSelected = selItems.includes(item.idx)
                                        const isGhosting = isSelected && draggingItemId && Number(draggingItemId) !== item.idx;
                                        const showSelNr = shouldShowSelection && Number(draggingItemId) === item.idx

                                        return (
                                            <Draggable
                                                key={item.idx}
                                                draggableId={item.idx.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={(e) => onClick(e, item.idx, allItems, selItems, setSelItems)}
                                                            style={{
                                                                userSelect: "none",
                                                                paddingLeft: "5px",
                                                                paddingTop: "5px",
                                                                margin: "0 0 8px 0",
                                                                minHeight: "30px",
                                                                height: "30px",
                                                                backgroundColor: backgroundColor(snapshot.isDragging, isSelected),
                                                                color: "black",
                                                                border: "1px solid #91caff",
                                                                borderRadius: "5px",
                                                                visibility: isGhosting ? "collapse" : "visible",
                                                                ...provided.draggableProps.style
                                                            }}
                                                        >
                                                                                <span style={{
                                                                                    color: isSelected ? "blue" : "black",
                                                                                }}>{item.name}</span>
                                                            {showSelNr && <div
                                                                style={{
                                                                    left: "-5px",
                                                                    top: "30px",
                                                                    color: "black",
                                                                    background: "white",
                                                                    borderRadius: "50%",
                                                                    height: "20px",
                                                                    width: "25px",
                                                                    border: "1px solid grey",
                                                                    position: "absolute",
                                                                    textAlign: "center",
                                                                }}
                                                            ><span
                                                                style={{
                                                                    position: "relative",
                                                                    top: "-2px"
                                                                }}
                                                            >{selectionCount}</span></div>}

                                                        </div>
                                                    );
                                                }}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            );
                        }}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>

    );

}
