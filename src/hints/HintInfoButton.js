import React from "react";
import './hints.css'
import {Popover, Button} from 'antd';
import {InfoCircleOutlined} from "@ant-design/icons";

export default function HintInfoButton(props) {

    return (
        <>
            {props.description && <Popover content={props.description} placement="right">
                <Button type="text" shape="circle" icon={<InfoCircleOutlined />} ></Button>
            </Popover>}
        </>
    );
}
