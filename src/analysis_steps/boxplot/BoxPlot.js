import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AnalysisMenu from "../AnalysisMenu";
import ReactECharts from 'echarts-for-react';
import BoxPlotParams from "./BoxPlotParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";

export default function BoxPlot(props) {

    const [selCol, setSelCol] = useState()
    const [logScale, setLogScale] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.data.parameters) {
            const params = JSON.parse(props.data.parameters)
            setSelCol(params.column)
            setLogScale(params.logScale)
        } else {
            setSelCol(props.data.commonResult.intCol)
        }
    }, [props])

    const results = JSON.parse(props.data.results)

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
                data: boxplotData.experimentNames
            }
        }),
        yAxis: {
            name: selCol
        }
    };

    if (selCol) {
        replacePlotIfChanged(props.data.id, results, options, dispatch)
    }

    const onClickOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: {column: selCol, logScale: logScale}
        }))
    }

    return (
        <Card className={'analysis-step-card'} title={"Boxplot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                          onClickOk={onClickOk}
                          paramComponent={<BoxPlotParams analysisIdx={props.analysisIdx}
                                                         data={props.data} setSelCol={setSelCol}
                                                         selCol={selCol} setLogScale={setLogScale}
                                                         logScale={logScale}></BoxPlotParams>}/>
        }>
            <p>Boxplot</p>
            {selCol && <ReactECharts option={options}/>}
        </Card>
    );
}