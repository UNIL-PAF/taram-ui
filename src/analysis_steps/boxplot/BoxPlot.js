import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import BoxPlotParams from "./BoxPlotParams";
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";

export default function BoxPlot(props) {
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.data) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)
        }
        if (props.data.results) setOptions(getOptions())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const getOptions = () => {
        const results = JSON.parse(props.data.results)
        const params = JSON.parse(props.data.parameters)

        const newData = results.data.map(d => {
            const dataWithName = d.data.map(box => {
                return [box.name].concat(box.data)
            })
            return {
                group: d.group ? d.group : null,
                data: dataWithName
            }
        })

        results.data = newData

        const myDimensions = ['name', 'min', 'Q1', 'median', 'Q3', 'max']

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
                    axisLabel: {interval: 0, rotate: 50},
                    show: (i === 0 ? true : false),
                    data: boxplotData.experimentNames,
                    axisLine: { onZero: false }
                }
            }),
            yAxis: {
                name: params.column,
                nameTextStyle: {align: 'left'},
                nameGap: 20
            }
        };

        if (params.column) {
            replacePlotIfChanged(props.data.id, results, options, dispatch)
        }

        return options
    }

    return (
        <Card className={'analysis-step-card'} title={"Boxplot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              error={props.data.error} paramType={"boxplot"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              paramComponent={<BoxPlotParams analysisIdx={props.analysisIdx}
                                                             params={localParams} commonResult={props.data.commonResult}
                                                             setParams={setLocalParams}
                              ></BoxPlotParams>}/>

        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.series.length > 0 && <ReactECharts option={options}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}