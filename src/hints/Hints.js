import React,{useState} from "react";
import './hints.css'
import OneHint from "./OneHint";
import {Button} from 'antd';
import {CloseOutlined, DownOutlined} from "@ant-design/icons";

export default function Hints(props) {
    const [open, setIsOpen] = useState(props.defaultOpen)
    const [myClass, setMyClass] = useState(props.defaultOpen ? '' : 'hidden')

    const icon = open ? <CloseOutlined /> : <DownOutlined />

    const switchShow = () => {
        setMyClass(open ? 'hidden' : '')
        setIsOpen(!open)
    }

    return (
        <div id={"hints"}>
            {props.data && <div id={"hints-box"} className={myClass}>
                {
                    props.data.hintList.map(a => {
                        return <OneHint key={a.id} isNext={props.data.nextHintId === a.id} data={a} resultId={props.resultId}></OneHint>
                    })
                }
            </div>
            }
            <Button type="default" icon={icon} size={"small"} onClick={switchShow}/>
        </div>
    );
}
