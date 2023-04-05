import React from "react";
import GroupTitle from "./GroupTitle";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {Button} from "antd";

export default function GroupSelection(props) {

    const addGroup = () => {
        let newCols = {...props.groupData}
        const nextIdx = Object.keys(props.groupData).length
        newCols["group-" + nextIdx] = { name: "Group " + nextIdx, items: []}
        props.setGroupData(newCols)
    }

    const changeGroupName = (groupId, groupName) => {
        const newCols = {...props.groupData}
        newCols[groupId].name = groupName
        props.setGroupData(newCols)
    }

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
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


        return (
            <div>
                <div
                    style={{ display: "flex", justifyContent: "left", height: "100%"}}
                >
                    <DragDropContext
                        onDragEnd={(result) => onDragEnd(result, props.groupData, props.setGroupData)}
                    >
                        {Object.entries(props.groupData).map(([columnId, column], i) => {
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
                                    <GroupTitle id={columnId} name={column.name} changeGroupName={changeGroupName}></GroupTitle>
                                    <div style={{ margin: 8 }}>
                                        <Droppable droppableId={columnId} key={columnId}>
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
                                                                        return (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{
                                                                                    userSelect: "none",
                                                                                    paddingLeft: "5px",
                                                                                    paddingTop: "5px",
                                                                                    margin: "0 0 8px 0",
                                                                                    minHeight: "30px",
                                                                                    height: "30px",
                                                                                    backgroundColor: snapshot.isDragging
                                                                                        ? "#7d560a"
                                                                                        : "#e19b12",
                                                                                    color: "white",
                                                                                    borderRadius: "5px",
                                                                                    ...provided.draggableProps.style
                                                                                }}
                                                                            >
                                                                                <span style={{
                                                                                    color: "white",
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
                                </div>
                        );
                        })}
                    </DragDropContext>
                    <Button style={{marginLeft: "8px"}} onClick={addGroup}>New group</Button>
                </div>
            </div>
        );

}
