import React,{useState} from "react";
import './hints.css'
import OneHint from "./OneHint";
import {Button, Popover} from 'antd';
import {CloseOutlined, DownOutlined} from "@ant-design/icons";

export default function Hints(props) {
    const [open, setIsOpen] = useState(props.defaultOpen)
    const [myClass, setMyClass] = useState(props.defaultOpen ? '' : 'hidden')

    const switchShow = () => {
        setMyClass(open ? 'hidden' : '')
        setIsOpen(!open)
    }

    const button = () => {
        if(open){
            return <Button type="default" icon={<CloseOutlined />} size={"small"} onClick={switchShow}/>
        }else{
            return <Popover content={"Analysis process"} placement="right">
                <Button type="default" size={"small"} icon={<DownOutlined />} onClick={switchShow} ></Button>
            </Popover>
        }

    }

    return (
        <div id={"hints"} className={myClass}>
            {props.data && <div id={"hints-box"} className={myClass}>
                {
                    props.data.hintList.map(a => {
                        return <OneHint key={a.id} isNext={props.data.nextHintId === a.id} data={a} resultId={props.resultId}></OneHint>
                    })
                }
            </div>
            }
            {button()}
        </div>
    );
}
