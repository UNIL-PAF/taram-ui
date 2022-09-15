import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import VolcanoPlotParams from "./VolcanoPlotParams";
import StepComment from "../StepComment";

export default function VolcanoPlot(props) {

    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()

    useEffect(() => {
        if (props.data.parameters) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)
        }
        if(props.data.results) setOptions(getOptions())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const getOptions = () => {
        const results = JSON.parse(props.data.results)
        const dataWithLabel = results.data.map(d => { return { ...d, showLab: false } })

        return {
            xAxis: {},
            yAxis: {},
            label: {
                show: true,
                formatter: function (params) {
                    return (params.data.showLab) ? params.data.gene : ""
                },
                position: 'right',
                minMargin: 2
            },
            tooltip: {
                showDelay: 0,
                formatter: function(params) {
                    return "Gene: <strong>" + params.data.gene + "</strong><br>" +
                        "Protein group: <strong>" + params.data.prot + "</strong><br>" +
                        "p-value: <strong>" + params.data.pVal + "</strong><br>" +
                        "fold change: <strong>" + params.data.fc + "</strong>"
                },
            },
            dataset: [{
                dimensions: ["fc", "pVal"],
                source: dataWithLabel,
            }],
            series: [
                {
                    symbolSize: 5,
                    datasetIndex: 0,
                    type: 'scatter'
                }
            ]
        }
    }

    const onEvents = {
        'click': showToolTipOnClick,
    }

    function showToolTipOnClick(e) {
        const dataset = [{...options.dataset[0], source: options.dataset[0].source.map( a => {
                return (a.prot === e.data.prot) ? {...a, showLab: !a.showLab} : a
            })
        }]
        setOptions({...options, dataset: dataset})
    }

    return (
        <Card className={'analysis-step-card'} title={"Volcano plot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              error={props.data.error} paramType={"volcano-plot"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              paramComponent={<VolcanoPlotParams analysisIdx={props.analysisIdx}
                                                                 params={localParams} commonResult={props.data.commonResult}
                                                                 setParams={setLocalParams}
                                                         ></VolcanoPlotParams>}/>
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.series.length > 0 && <ReactECharts option={options} onEvents= {onEvents}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}