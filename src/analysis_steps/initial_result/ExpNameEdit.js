import React, {useState} from "react";
import "./ExpNameEdit.css"
import {Button, Input} from 'antd';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

export default function ExpNameEdit(props) {

    const [name, setName] = useState(props.name)

    const save = () => {
        console.log("save", name)
        props.changeExpName(props.expIdx, name)
        props.cancel()
    }

    const cancel = () => {
        props.cancel()
    }

    return (
        <div className={"exp-name-edit"}>
            <Input
                defaultValue={name}
                onPressEnter={save}
                onChange={(e) => setName(e.target.value)}
                onBlur={save}
            ></Input>
            <Button className={"exp-name-button"} shape="circle" icon={<CheckOutlined style={{fontSize: '10px'}}/>} onClick={() => save()} size={"small"}></Button>
            <Button className={"exp-name-button"} shape="circle" icon={<CloseOutlined style={{fontSize: '10px'}}/>} onClick={() => cancel()} size={"small"} danger></Button>
        </div>
    )
}