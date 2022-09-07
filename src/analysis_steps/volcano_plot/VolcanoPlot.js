import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import VolcanoPlotParams from "./VolcanoPlotParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";

export default function VolcanoPlot(props) {

    const [selCol, setSelCol] = useState()
    const [logScale, setLogScale] = useState(false)
    const [options, setOptions] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.data.parameters) {
            const params = JSON.parse(props.data.parameters)
            setSelCol(params.column)
            setLogScale(params.logScale)
        } else {
            setSelCol(props.data.commonResult.intCol)
        }

        if(props.data.results) setOptions(getOptions())
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

    const onClickOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: {column: selCol, logScale: logScale}
        }))
    }

    return (
        <Card className={'analysis-step-card'} title={"Volcano plot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              onClickOk={onClickOk} error={props.data.error}
                              paramComponent={<VolcanoPlotParams analysisIdx={props.analysisIdx}
                                                         data={props.data} setSelCol={setSelCol}
                                                         selCol={selCol} setLogScale={setLogScale}
                                                         logScale={logScale}></VolcanoPlotParams>}/>
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.series.length > 0 && <ReactECharts option={options} onEvents= {onEvents}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}