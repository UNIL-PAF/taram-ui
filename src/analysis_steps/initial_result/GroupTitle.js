import React, {useState} from "react";
import {Button, Input} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons";

export default function GroupTitle(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(props.name);

    const save = () => {
        setIsEditing(!isEditing)
        props.changeGroupName(props.id, name)
    }

    const cancel = () => {
        setIsEditing(!isEditing)
    }

    const deleteGroup = () => {
        props.deleteGroup(props.id)
    }

    const moveLeft = () => {
        props.moveLeft(props.name, props.i)
    }

    const moveRight = () => {
        props.moveRight(props.name, props.i)
    }

    const renderMoveLeft = () => {
        if(!isEditing && props.id !== "experiments" && props.i > 1) return <span onClick={() => moveLeft()}>left</span>
    }

    const renderMoveRight = () => {
        if(!isEditing && props.id !== "experiments" && !props.isLast) return <span onClick={() => moveRight()}>Right</span>
    }

    return (<>{renderMoveLeft()}
            {!isEditing && <div>
                    <span style={{display: "block", float: "left", paddingTop: "5px"}}>
                        <h4 onClick={() => setIsEditing(true)} style={{paddingLeft: "18px"}}>
                            {props.name}
                        </h4>
                    </span>
                {props.id !== "experiments" &&
                    <span style={{display: "block", float: "right"}}>
                        <Button onClick={() => deleteGroup()} type={"text"} icon={<DeleteOutlined/>}></Button>
                    </span>}
            </div>}
            {isEditing && <span>
                            <Input
                                style={{width: 100}}
                                defaultValue={props.name}
                                onPressEnter={save}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={save}/>
                                <Button shape="circle" icon={<CheckOutlined style={{fontSize: '10px'}}/>}
                                        onClick={() => save()} size={"small"}></Button>
                                <Button shape="circle" icon={<CloseOutlined style={{fontSize: '10px'}}/>}
                                        onClick={() => cancel()} size={"small"} danger></Button>
                </span>}
        {renderMoveRight()}
        </>);
}
