import React, {useState} from "react";
import GroupTitle from "./GroupTitle";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Button, Col, Popover, Row} from "antd";
import {EditOutlined, InfoOutlined} from "@ant-design/icons";
import ExpNameEdit from "./ExpNameEdit"
import {onClick} from "./GroupSelectionUtils";
import {defaultColors} from "../../common/PlotColors";

export default function GroupSelection(props) {
    const [showEdit, setShowEdit] = useState()
    const [selItems, setSelItems] = useState([])
    const [draggingItemId, setDraggingItemId] = useState()
    const [editGroupName, setEditGroupName] = useState()

    const changeExpName = (expId, newName) => {
        const myGroupData = {...props.params.groupData}

        const newGroupData = Object.fromEntries(
            Object.entries(myGroupData).map(
                ([k, v]) => {
                    const newItems = v.items.map(a => (a.id === expId) ? {...a, id: newName, name: newName} : a)
                    return [k, {...v, items: newItems}]
                }
            )
        )

        const newExperimentNames = props.params.experimentNames.map( a => (a === expId) ? newName : a)
        props.setParams({...props.params, groupData: newGroupData, experimentNames: newExperimentNames})
    }

    const addGroup = () => {
        let newCols = {...props.params.groupData}
        let nextIdx = Object.keys(props.params.groupData).length
        // if this name already exists, we have to go to the next nextIdx
        while (newCols["Group-" + nextIdx]) {
            nextIdx = nextIdx + 1
        }
        const newName = "Group-" + nextIdx
        newCols[newName] = {name: newName, items: []}
        props.setParams({
            ...props.params,
            groupsOrdered: props.params.groupsOrdered.concat(newName),
            groupData: newCols
        })
    }

    const deleteGroup = (groupId) => {
        var myGroups = props.params.groupData
        myGroups.experiments.items = myGroups.experiments.items.concat(myGroups[groupId].items)
        delete myGroups[groupId]
        props.setParams({
            ...props.params,
            groupsOrdered: props.params.groupsOrdered.filter(a => a !== groupId),
            groupData: myGroups
        })
    }

    const setGroupData = (gd) => {
        props.setParams({...props.params, groupData: gd})
    }

    const setGroupColor = (columnId, color) => {
        const newCols = {...props.params.groupData}
        newCols[columnId].color = color
        props.setParams({...props.params, groupData: newCols})
    }

    const changeGroupName = (groupId, groupName) => {
        if (groupId === groupName) return

        const myName = groupName.trimStart().replace('\t', ' ')
        const newCols = {...props.params.groupData}
        newCols[myName] = newCols[groupId]
        newCols[myName].name = myName
        delete newCols[groupId]
        const newGroupsOrdered = props.params.groupsOrdered.map(a => a === groupId ? myName : a)
        setEditGroupName(myName)
        props.setParams({...props.params, groupsOrdered: newGroupsOrdered, groupData: newCols})
    }

    const onDragStart = (start) => {
        setDraggingItemId(start.draggableId)
    };

    const onDragEnd = (result, columns, setColumns) => {
        setDraggingItemId(null)
        setSelItems([])

        if (!result.destination) return;

        const movingItems = Object.values(columns).reduce((acc, col) => {
            const selIt = col.items.filter(a => (selItems.length > 0) ? selItems.includes(a.id) : result.draggableId === a.id)
            return acc.concat(selIt)
        }, [])

        const addItem = (items, movingItems, pos) => {
            const movingItemNames = movingItems.map(a => a.id)
             let newItems = [...items].filter(a => !movingItemNames.includes(a.id))
             newItems.splice(pos, 0, ...movingItems);
            return newItems;
        }

        const newColumns = Object.fromEntries(Object.entries(columns).map(([k, col]) => {
            const filterBy = (a) => {
                return (selItems.length > 0) ? !selItems.includes(a.id) : result.draggableId !== a.id
            }
            const newItems = (k === result.destination.droppableId) ? addItem(col.items, movingItems, result.destination.index) : col.items.filter(a => filterBy(a))
            return [k, {...col, items: newItems}]
        }))

        setColumns(newColumns)
    };

    const nrGroups = props.params.groupsOrdered && props.params.groupsOrdered.length

    const maxChars = Object.values(props.params.groupData).reduce((acc, curr) => {
        const myNew = (curr.name.length > acc) ? curr.name.length : acc
        const myNewMax = Math.max.apply(Math, curr.items.map(a => a.name.length))
        return (myNewMax > myNew) ? myNewMax : myNew
    }, 0)

    const defaultWidth = 200
    const myWidth = (maxChars > 10) ? defaultWidth + (maxChars - 10) * 5 : defaultWidth

    const backgroundColor = (isDragging, isSelected) => {
        if (isDragging) {
            return "#91caff"
        } else if (isSelected) {
            return "#bfe3ff"
        } else return "#e6f4ff"
    }

    const getGroupColor = (columnId, i) => {
        if(i === 0){
            return undefined
        } else if(props.params.groupData[columnId].color){
            return props.params.groupData[columnId].color
        }else {
            return defaultColors[i-1]
        }
    }

    return (
        <div>
            <Row>
                <Col>
                    <Button style={{marginLeft: "8px"}} onClick={addGroup}>Add a group</Button>
                    &nbsp;&nbsp;
                    <span>Number of groups: {props.params.groupsOrdered.length}</span>
                </Col>
            </Row>
            <div
                style={{display: "flex", justifyContent: "left", height: "100%"}}
            >
                <DragDropContext
                    onDragStart={(start) => onDragStart(start)}
                    onDragEnd={(result) => onDragEnd(result, props.params.groupData, setGroupData)}
                >
                    {['experiments'].concat(props.params.groupsOrdered).map((columnId, i) => {
                        const column = props.params.groupData[columnId]

                        if (!column) {
                            return null
                        }

                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "top",
                                    borderRight: i === 0 ? "2px dashed lightgrey" : undefined
                                }}
                                key={i}
                            >
                                <GroupTitle id={columnId} name={column.name} i={i} moveLeft={props.moveGroupLeft}
                                            moveRight={props.moveGroupRight} isLast={i === nrGroups} editGroupName={editGroupName} setEditGroupName={setEditGroupName}
                                            changeGroupName={changeGroupName} deleteGroup={deleteGroup} color={getGroupColor(columnId, i)} setGroupColor={(color) => setGroupColor(columnId, color)}></GroupTitle>
                                <div style={{margin: 8}}>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => {
                                            const selectionCount = selItems.length
                                            const shouldShowSelection = selectionCount > 1;
                                            const allItems = column.items.map(a => a.id)

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
                                                        const isSelected = selItems.includes(item.id)
                                                        const isGhosting = shouldShowSelection && isSelected && draggingItemId && draggingItemId !== item.id;
                                                        const showSelNr = shouldShowSelection && draggingItemId === item.id

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
                                                                                             changeExpName={changeExpName}
                                                                                             cancel={() => setShowEdit(undefined)}></ExpNameEdit>}
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
                            </div>
                        );
                    })}
                </DragDropContext>
            </div>
        </div>
    );

}
