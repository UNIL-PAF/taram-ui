import React from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";
import ReactECharts from 'echarts-for-react';

export default function BoxPlot(props) {
    const results = JSON.parse(props.data.results)

    const options = {
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
    };

    return (
        <Card title={"Boxplot"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
        }>
            <p>Boxplot</p>
            <ReactECharts option={options} />
        </Card>
    );
}