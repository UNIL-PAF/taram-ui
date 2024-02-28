import React from "react";
import './hints.css'
import {Button} from 'antd';
import {CheckCircleTwoTone} from "@ant-design/icons";

export default function HintDoneButton(props) {

    const doneColor = "#52c41a"
    const todoColor = "#ececec"

    const currColor = (props.isDone === true) ? doneColor : todoColor

    return (
        <>
            <Button type={"text"} shape="circle"
                    icon={<CheckCircleTwoTone style={{fontSize: "large"}} twoToneColor={currColor}/>}/>
        </>
    );
}
