import React, {useState} from "react";
import {Button, Input} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

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

    return (
        <>
            {!isEditing &&
                <h4 onClick={() => setIsEditing(true)} style={{paddingLeft: "18px"}}>{props.name}</h4>
            }
            { isEditing &&
                <span>
                            <Input
                                style={{ width: 100 }}
                                defaultValue={props.name}
                                onPressEnter={save}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={save}/>
                                <Button shape="circle" icon={<CheckOutlined style={{fontSize: '10px'}}/>} onClick={() => save()} size={"small"}></Button>
                                <Button shape="circle" icon={<CloseOutlined style={{fontSize: '10px'}}/>} onClick={() => cancel()} size={"small"} danger></Button>
                </span>
            }
        </>
    );
}
