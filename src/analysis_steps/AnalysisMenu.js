import React from "react";
import {Menu} from 'antd';

export default function AnalysisMenu(props) {
    console.log(props)

    const clickQualityControl = function(){
        console.log("click QualityControl")
    }

    return (
        <Menu>
            <Menu.Item onClick={() => clickQualityControl()} key={1}>
                <span>Quality Control</span>
            </Menu.Item>
        </Menu>

    );
}
