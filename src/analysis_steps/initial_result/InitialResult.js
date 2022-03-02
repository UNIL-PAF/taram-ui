import React from "react";
import {Button, Card, Dropdown} from 'antd';
import {PlusCircleOutlined, BarChartOutlined} from '@ant-design/icons';
import AnalysisMenu from "../AnalysisMenu"

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)

    return (
        <Card title={"Initial Result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <div>
                <Button type={"text"} icon={<BarChartOutlined/>}></Button>
                <Dropdown overlay={<AnalysisMenu stepId={props.data.id}/>} placement="bottomLeft" arrow>
                    <Button type={"text"} icon={<PlusCircleOutlined/>}></Button>
                </Dropdown>
            </div>

        }>
            <p key={results.id}>version {results.maxQuantParameters.version}</p>
        </Card>
    );
}