import React, {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {onClick} from "./MultiDragUtils"

export default function OrderColumnsDraggeable(props) {

    const [selItems, setSelItems] = useState([])

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

    const allItems = props.columns.map( a => a.idx)

    return (
        <div
            style={{display: "flex", justifyContent: "left", height: "100%"}}
        >
            <DragDropContext
                onDragEnd={(result) => onDragEnd(result)}
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
                                                                backgroundColor: snapshot.isDragging
                                                                    ? "#91caff"
                                                                    : "#e6f4ff",
                                                                color: "black",
                                                                border: "1px solid #91caff",
                                                                borderRadius: "5px",
                                                                ...provided.draggableProps.style
                                                            }}
                                                        >
                                                                                <span style={{
                                                                                    color: isSelected ? "blue" : "black",
                                                                                }}>{item.name}</span>

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
