import React from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";
import ReactECharts from 'echarts-for-react';

export default function BoxPlot(props) {
    const results = JSON.parse(props.data.results)

    const options = {
        dataset: [
            {
                dimensions: ['min', 'Q1', 'median', 'Q3', 'max', 'sample'],
                source: [[8, 15, 20, 25, 50, '0001'], [10, 15, 20, 25, 30, '0002']]
            },
            {
                dimensions: ['min', 'Q1', 'median', 'Q3', 'max', 'sample'],
                source: [[10, 15, 20, 25, 30, '0003'], [10, 15, 20, 25, 30, '0004']]
            }
        ],
        series: [
            {
                name: 'WT',
                datasetIndex: 0,
                type: 'boxplot',
                encode: {
                    y: ['min', 'Q1', 'median', 'Q3', 'max'],
                    x: 'sample',
                },
                xAxisIndex: 0
            },
            {
                name: 'KO',
                datasetIndex: 1,
                type: 'boxplot',
                encode: {
                    y: ['min', 'Q1', 'median', 'Q3', 'max'],
                    x: 'sample',
                },
                xAxisIndex: 1
            }
        ],
        legend: {},
        xAxis: [{
            type: 'category',
            scale: true,
            axisLabel: {interval: 0, rotate: 30},
            show: true,
            data: ['0001', '0002', '0003', '0004']
        },
            {
                type: 'category',
                scale: true,
                show: false,
                data: ['0001', '0002', '0003', '0004']
            },],
        yAxis: {
            name: 'Intensity'
        }
    };

    return (
        <Card title={"Boxplot"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
        }>
            <p>Boxplot</p>
            <ReactECharts option={options}/>
        </Card>
    );
}