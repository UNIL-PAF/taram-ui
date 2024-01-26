import React, {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {onClick, onDragEnd} from "./OrderColumnsUtils"

export default function OrderColumnsDraggeable(props) {

    const [selItems, setSelItems] = useState([])
    const [draggingItemId, setDraggingItemId] = useState()

    const onDragStart = (start) => {
        setDraggingItemId(start.draggableId)
    };

    const localDragEnd = (result) => {
        const newColumns = onDragEnd(result, props.columns, selItems)

        if(newColumns){
            const corrId = newColumns.map( (a, i) => {return {...a, id: i}} )
            props.setColumns(corrId)
            const newOrder = newColumns.map(a => a.idx)
            props.setParams({...props.params, newOrder: newOrder})
        }
        setDraggingItemId(null)
        setSelItems([])
    }

    const allItems = props.columns.map( a => a.id)

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

                                        const isSelected = selItems.includes(item.id)
                                        const isGhosting = isSelected && draggingItemId && Number(draggingItemId) !== item.id;
                                        const showSelNr = shouldShowSelection && Number(draggingItemId) === item.id

                                        return (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={(e) => onClick(e, item.id, allItems, selItems, setSelItems)}
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
