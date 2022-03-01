import React from "react";
import {Button, Card} from 'antd';

export default function InitialResult(props) {
    console.log(props)

    const results = JSON.parse(props.data.results)
    console.log(results.maxQuantParameters.version)

    return (
        <Card title={"Initial Result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <div>
                <BarChartOutlined />
                <Button>pip</Button>
            </div>

        }>
            <p key={results.id}>version {results.maxQuantParameters.version}</p>
        </Card>
    );
}
