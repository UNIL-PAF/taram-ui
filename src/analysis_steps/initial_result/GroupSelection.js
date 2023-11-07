import React, {useEffect, useState} from "react";
import GroupTitle from "./GroupTitle";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Button, Popover} from "antd";
import {InfoOutlined, EditOutlined} from "@ant-design/icons";
import ExpNameEdit from "./ExpNameEdit"
import {setStopMenuShortcut} from "../../analysis/analysisSlice";
import {useDispatch} from "react-redux";

export default function GroupSelection(props) {
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState()

    useEffect(() => {
        if(showEdit){
            dispatch(setStopMenuShortcut(true))
        }else{
            dispatch(setStopMenuShortcut(false))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEdit])

    const addGroup = () => {
        let newCols = {...props.groupData}
        let nextIdx = Object.keys(props.groupData).length
        // if this name already exists, we have to go to the next nextIdx
        while(newCols["Group-"+nextIdx]){ nextIdx = nextIdx + 1}
        const newName = "Group-" + nextIdx
        newCols[newName] = {name: newName, items: []}
        props.setParams({...props.params, groupsOrdered: props.groupsOrdered.concat(newName), groupData: newCols})
    }

    const deleteGroup = (groupId) => {
        var myGroups = props.groupData
        myGroups.experiments.items = myGroups.experiments.items.concat(myGroups[groupId].items)
        delete myGroups[groupId]
        props.setParams({...props.params, groupsOrdered: props.groupsOrdered.filter(a => a !== groupId), groupData: myGroups})
    }

    const setGroupData = (gd) => {
        props.setParams({...props.params, groupData: gd})
    }

    const changeGroupName =  (groupId, groupName) => {
        const myName = groupName.trim()
        const newCols = {...props.groupData}
        newCols[myName] = newCols[groupId]
        newCols[myName].name = myName
        delete newCols[groupId]
        const newGroupsOrdered = props.groupsOrdered.map(a => a === groupId ? groupName : a)
        props.setParams({...props.params, groupsOrdered: newGroupsOrdered, groupData: newCols})
    }

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

    const nrGroups = props.groupsOrdered && props.groupsOrdered.length

    const maxChars = Object.values(props.groupData).reduce( (acc, curr) => {
        const myNew = (curr.name.length > acc) ? curr.name.length : acc
        const myNewMax = Math.max.apply(Math, curr.items.map(a => a.name.length))
        return (myNewMax > myNew) ? myNewMax : myNew
    }, 0)

    const defaultWidth = 200
    const myWidth = (maxChars > 10) ? defaultWidth + (maxChars-10) * 5 : defaultWidth

    return (
        <div>
            <div
                style={{display: "flex", justifyContent: "left", height: "100%"}}
            >
                <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, props.groupData, setGroupData)}
                >
                    {['experiments'].concat(props.groupsOrdered).map((columnId, i) => {
                        const column = props.groupData[columnId]
                        if(!column){return null}

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
                                <GroupTitle id={columnId} name={column.name} i={i} moveLeft={props.moveGroupLeft}
                                            moveRight={props.moveGroupRight} isLast={i === nrGroups}
                                            changeGroupName={changeGroupName} deleteGroup={deleteGroup}></GroupTitle>
                                <div style={{margin: 8}}>
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
                                                        width: myWidth,
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
                                                                    const popoverContent = <div>
                                                                        <span>Original name: <strong>{item.originalName}</strong></span>
                                                                        <br/>
                                                                        {item.fileName &&
                                                                            <span>File name: <strong>{item.fileName}</strong></span>}
                                                                    </div>
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
                                                                                    ? "#91caff"
                                                                                    : "#e6f4ff",
                                                                                color: "black",
                                                                                border: "1px solid #91caff",
                                                                                borderRadius: "5px",
                                                                                ...provided.draggableProps.style
                                                                            }}
                                                                        >
                                                                                <span style={{
                                                                                    color: "black",
                                                                                }}>{item.name}</span>
                                                                            <Popover content={popoverContent}
                                                                                     title={
                                                                                         <strong>{item.name}</strong>}>
                                                                                <Button
                                                                                    style={{
                                                                                        float: "right",
                                                                                        marginRight: "5px",
                                                                                        marginBottom: "0px",
                                                                                        minWidth: "18px",
                                                                                        width: "18px",
                                                                                        height: "18px"
                                                                                    }} type="primary" shape="circle"
                                                                                    icon={<InfoOutlined style={{
                                                                                        width: "15px",
                                                                                        height: "15px",
                                                                                        paddingLeft: "1px",
                                                                                        paddingTop: "1px"
                                                                                    }}/>}
                                                                                    size={"small"}/>
                                                                            </Popover>
                                                                            <Button
                                                                                onClick={() => setShowEdit({
                                                                                    col: i,
                                                                                    idx: index
                                                                                })}
                                                                                style={{
                                                                                    float: "right",
                                                                                    marginRight: "5px",
                                                                                    marginBottom: "0px",
                                                                                    minWidth: "18px",
                                                                                    width: "18px",
                                                                                    height: "18px"
                                                                                }} type="primary" shape="circle"
                                                                                icon={<EditOutlined style={{
                                                                                    width: "15px",
                                                                                    height: "15px",
                                                                                    paddingLeft: "1px",
                                                                                    paddingTop: "1px"
                                                                                }}/>}
                                                                                size={"small"}/>
                                                                            {showEdit && showEdit.col === i && showEdit.idx === index &&
                                                                                <ExpNameEdit name={item.name}
                                                                                             expIdx={item.name}
                                                                                             changeExpName={props.changeExpName}
                                                                                             cancel={() => setShowEdit(undefined)}></ExpNameEdit>}
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
