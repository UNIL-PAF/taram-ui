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

        const newData = results.boxPlotData.map(d => {
            const dataWithName = d.groupData.map(box => {
                return [box.name].concat(box.data)
            })
            return {
                group: d.group ? d.group : null,
                data: dataWithName
            }
        })

        results.boxPlotData = newData

        const boxplotDimensions = ['name', 'min', 'Q1', 'median', 'Q3', 'max']

        const parsedRes = results

        const boxplotDatasets = parsedRes.boxPlotData.map(d => {
            return {
                dimensions: boxplotDimensions,
                source: d.data
            }
        })

        const selProtSeries = parsedRes.selProtData ? parsedRes.selProtData.map(d => {
            return {
                name: d.gene ? d.gene : d.prot,
                type: 'line',
                data: d.ints
            }
        }) : null

        const boxplotSeries = parsedRes.boxPlotData.map((d, i) => {
            return {
                name: d.group,
                type: 'boxplot',
                datasetIndex: i,
                encode: {
                    y: boxplotDimensions.slice(1),
                    x: 'name',
                },
                xAxisIndex: i
            }
        })

        const options = {
            dataset: boxplotDatasets,
            series: boxplotSeries.concat(selProtSeries),
            legend: {},
            xAxis: parsedRes.boxPlotData.map((d, i) => {
                return {
                    type: 'category',
                    scale: true,
                    axisLabel: {interval: 0, rotate: 50},
                    show: (i === 0 ? true : false),
                    data: parsedRes.experimentNames,
                    axisLine: { onZero: false }
                }
            }),
            yAxis: {
                name: params.column || props.data.columnInfo.columnMapping.intCol,
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
            <AnalysisStepMenu key={props.data.id} stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              error={props.data.error} paramType={"boxplot"}
                              commonResult={props.data.commonResult}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              stepParams={localParams}
                              paramComponent={<BoxPlotParams analysisIdx={props.analysisIdx}
                                                             intCol={props.data.columnInfo.columnMapping.intCol}
                                                             params={localParams} commonResult={props.data.commonResult}
                                                             setParams={setLocalParams}
                                                             stepId={props.data.id}
                              ></BoxPlotParams>}/>

        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.series.length > 0 && <ReactECharts option={options}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}