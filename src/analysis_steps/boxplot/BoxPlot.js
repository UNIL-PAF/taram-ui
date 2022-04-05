import React from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";
import ReactECharts from 'echarts-for-react';

export default function BoxPlot(props) {

    const results = JSON.parse(props.data.results)
    console.log(results)

    const newData = results.data.map(d => {
        const dataWithName = d.data.map(box => {
            return [box.name].concat(box.data)
        })
        return {
            group: d.group ? d.group : null,
            data: dataWithName
        }
    })

    console.log(newData)
    results.data = newData

    const myDimensions = ['name', 'min', 'Q1', 'median', 'Q3', 'max']

    const boxplotDataTest = {
        experimentNames: ['0001', '0002'],
        data: [
            {
                group: null,
                data: [
                    ['0001', 8, 15, 20, 25, 50],
                    ['0002', 8, 15, 20, 25, 50]
                ]
            }
        ]
    }

    const boxplotData = results

    const options = {
        dataset: boxplotData.data.map(d => {
            return {
                dimensions: myDimensions,
                source: d.data
            }
        }),
        series: boxplotData.data.map((d, i) => {
            return {
                name: d.group,
                type: 'boxplot',
                datasetIndex: i,
                encode: {
                    y: myDimensions.slice(1),
                    x: 'name',
                },
                xAxisIndex: i
            }
        }),
        legend: {},
        xAxis: boxplotData.data.map((d, i) => {
            return {
                type: 'category',
                scale: true,
                axisLabel: {interval: 0, rotate: 30},
                show: (i === 0 ? true : false),
                data: boxplotData.experimentNames
            }
        }),
        yAxis: {
            name: 'Intensity'
        }
    };

    return (
        <Card className={'analysis-step-card'} title={"Boxplot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}/>
        }>
            <p>Boxplot</p>
            <ReactECharts option={options}/>
        </Card>
    );
}