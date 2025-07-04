import React from "react";
import {Button, Input} from "antd";
import {DeleteOutlined, LeftOutlined, RightOutlined} from "@ant-design/icons";

export default function GroupTitle(props) {

    const save = () => {
        props.setEditGroupName(undefined)
    }

    const deleteGroup = () => {
        props.deleteGroup(props.id)
    }

    const moveLeft = () => {
        props.moveLeft(props.id, props.i)
    }

    const moveRight = () => {
        props.moveRight(props.id, props.i)
    }

    const renderMoveLeft = () => {
        if(props.id !== "experiments" && props.i > 1) return <Button onClick={() => moveLeft()} type={"text"} icon={<LeftOutlined/>}></Button>
        else return <span></span>
    }

    const renderMoveRight = () => {
        if(props.id !== "experiments" && !props.isLast) return <Button onClick={() => moveRight()} type={"text"} icon={<RightOutlined/>}></Button>
    }

    const edit = () => {
        if(props.name !== "Experiments"){
            props.setEditGroupName(props.id)
        }
    }

    const change = (e) => {
        props.changeGroupName(props.id, e.target.value)
    }

    return (<>
            <div style={{minHeight: "35px"}}><span style={{float: "left"}}>{renderMoveLeft()}</span><span style={{float: "right"}}>{renderMoveRight()}</span></div>
        <div>
                    <span style={{display: "block", float: "left", paddingTop: "5px"}}>
                        {props.editGroupName === props.id &&
                            <Input
                                value={props.name}
                                onBlur={(e) => save(e)}
                                onPressEnter={(e) => save(e)}
                                onChange={(e) => change(e)}
                            />}
                        {props.editGroupName !== props.id &&
                        <h4 onClick={() => edit()} style={{paddingLeft: "18px"}}>
                            {props.name}
                        </h4>}
                    </span>

            {props.id !== "experiments" &&
                <span style={{display: "block", float: "right"}}>
                        <Button onClick={(e) => deleteGroup(e)} type={"text"} icon={<DeleteOutlined/>}></Button>
                    </span>}

            {props.color !== undefined && <span style={{display: "block", float: "right", paddingTop: "5px", marginRight: "10px"}}>
                <input type="color" className={"color-input"} value={props.color} onChange={e => props.setGroupColor(e.target.value)}/>
            </span>}
        </div>
    </>);
}
