import React, {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {CloseOutlined} from '@ant-design/icons';
import {Button} from 'antd';

export default function TTestGroupSelection(props) {

    const initCols = {
        available: {
            name: "Available groups",
            id: 0,
            items: [{id: "Group 1-0", name: "Group 1", column: 0, colIdx: 0}, {
                id: "Group 2-0",
                name: "Group 2",
                column: 0,
                colIdx: 1
            }]
        },
        first: {name: "First group (right)", id: 1, items: [{id: "Group 1-1", name: "Group 1", column: 1, colIdx: 0}]},
        second: {name: "Second group (left)", id: 2, items: [{id: "Group 2-2", name: "Group 2", column: 2, colIdx: 1}]}
    }

    const [columns, setColumns] = useState(initCols)

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const {source, destination} = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            const myDestItems = destItems.map((itm, i) => {
                return {...itm, column: destColumn.id, id: itm.name + "-" + destColumn.id + "-" + i}
            })
            let newCols = {
                ...columns,
                [destination.droppableId]: {
                    ...destColumn,
                    items: myDestItems
                }
            }

            if (sourceColumn.id !== 0) {
                newCols = {
                    ...newCols,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems
                    }
                }
            }

            setColumns(newCols);
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const itemColor = (item) => {
        const colPal = [
            "#5470c6",
            "#91cc75",
            "#fac858",
            "#ee6666",
            "#73c0de",
            "#3ba272",
            "#fc8452",
            "#9a60b4",
            "#ea7ccc"
        ]

        return colPal[item.colIdx % colPal.length]
    }

    const itemStyle = (item) => {
        return {
            userSelect: "none",
            paddingLeft: "5px",
            paddingTop: "4px",
            margin: "0 0 8px 0",
            minHeight: "30px",
            height: "30px",
            backgroundColor: itemColor(item),
            color: "white",
            borderRadius: "5px"
        }
    }

    const removeItem = (colId, itemId) => {
        const column = Object.values(columns)[colId];
        const columnKey = Object.keys(columns)[colId];
        let copiedItems = [...column.items];
        const itemIdx = copiedItems.findIndex((item) => item.id === itemId)
        copiedItems.splice(itemIdx, 1);

        setColumns({
            ...columns,
            [columnKey]: {
                ...column,
                items: copiedItems
            }
        })
    }

    return (
        <div>
            <div
                style={{display: "flex", justifyContent: "left", height: "100%"}}
            >
                <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                >
                    {Object.entries(columns).map(([columnId, column], i) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "top",
                                    borderRight: i === 0 ? "2px dashed lightgrey" : undefined
                                }}
                                key={columnId}
                            >
                                <span>{column.name}</span>
                                <div style={{margin: 8}}>
                                    <Droppable droppableId={columnId} key={columnId}
                                               isDropDisabled={columnId === "available"}>
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
                                                        width: 150,
                                                        minHeight: 500
                                                    }}
                                                >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    const myStyle = itemStyle(item)
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{...myStyle, ...provided.draggableProps.style}}
                                                                            >
                                                                                <span style={{
                                                                                    color: "white",
                                                                                }}>{item.name}
                                                                                </span>
                                                                                {columnId !== "available" && <Button
                                                                                    onClick={()=>removeItem(column.id, item.id)}
                                                                                    style={{
                                                                                        float: "right",
                                                                                        marginRight: "4px",
                                                                                        marginBottom: "4px"
                                                                                    }} type="default" shape="circle"
                                                                                    icon={<CloseOutlined/>}
                                                                                    size={"small"}/>}
                                                                            </div>
                                                                            {columnId === "available" && snapshot.isDragging &&
                                                                                <div style={myStyle}><span style={{
                                                                                    color: "white"
                                                                                }}>{item.name}</span></div>}
                                                                        </React.Fragment>
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
                            </div>
                        );
                    })}
                </DragDropContext>
            </div>
        </div>
    );

}
