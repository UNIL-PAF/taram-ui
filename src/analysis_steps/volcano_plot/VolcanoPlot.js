import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import VolcanoPlotParams from "./VolcanoPlotParams";
import StepComment from "../StepComment";
import {switchSelProt} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";

export default function VolcanoPlot(props) {

    const dispatch = useDispatch();
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
        const params = JSON.parse(props.data.parameters)
        const dataWithLabel = results.data.map(d => {
            const showLab = params.selProteins && params.selProteins.includes(d.prot)
            return { ...d, showLab: showLab }
        })

        return {
            xAxis: {
                name: "Fold change",
                nameLocation: "center",
                nameTextStyle: { padding: [8, 4, 5, 6] },
            },
            yAxis: {
                min: 0,
                name: "-log10(p)",
                position: "left",
                nameRotate: 90,
                nameLocation: "center",
                nameTextStyle: { padding: [8, 4, 5, 6] },
            },
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
                    if (params.componentType === "markLine") {
                        const text =
                            params.data.name + " threshold: " + params.data.value;
                        return text;
                    } else {
                        return "Gene: <strong>" + params.data.gene + "</strong><br>" +
                            "Protein AC: <strong>" + params.data.prot + "</strong><br>" +
                            "p-value: <strong>" + params.data.pVal.toPrecision(3) + "</strong><br>" +
                            "fold change: <strong>" + params.data.fc.toFixed(2) + "</strong>"
                    }
                },
            },
            dataset: [
                {
                    dimensions: ["fc", "plotPVal", "isSign"],
                    source: dataWithLabel,
                },
                {
                    transform: {
                        type: 'filter',
                        config: { dimension: 'isSign', value: true }
                    }
                },
                {
                    transform: {
                        type: 'filter',
                        config: { dimension: 'isSign', value: false }
                    }
                }
            ],
            series: [
                {
                    symbolSize: 5,
                    datasetIndex: 1,
                    type: 'scatter',
                    encode: {
                        x: 'fc',
                        y: 'plotPVal'
                    },
                    itemStyle: {
                        color: "red"
                    },
                    markLine: {
                        lineStyle: {
                            type: "dashed",
                            color: "#3ba272",
                        },
                        label: { show: false },
                        symbol: ["none", "none"],
                        data: [
                            {
                                xAxis: -1 * params.fcThresh,
                                name: "Fold change",
                            },
                            {
                                xAxis: params.fcThresh,
                                name: "Fold change",
                            },
                            {
                                yAxis: -1 * Math.log10(params.pValThresh),
                                name: "p-Value",
                            },
                        ],
                    },
                },
                {
                    symbolSize: 5,
                    datasetIndex: 2,
                    type: 'scatter',
                    encode: {
                        x: 'fc',
                        y: 'plotPVal'
                    }
                }
            ]
        }
    }

    const onEvents = {
        'click': showToolTipOnClick,
    }

    function showToolTipOnClick(e) {
        dispatch(switchSelProt({resultId: props.resultId, proteinAc: e.data.prot, stepId: props.data.id}))
    }

    return (
        <Card className={'analysis-step-card'} title={"Volcano plot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              error={props.data.error} paramType={"volcano-plot"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
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