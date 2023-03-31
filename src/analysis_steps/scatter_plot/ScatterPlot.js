import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {setStepParametersWithoutRunning} from "../BackendAnalysisSteps";

export default function ScatterPlot(props) {
    const type = 'scatter-plot'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if(localParams && props.data && props.data.status === 'done'){
            const intCol = localParams.column || props.data.columnInfo.columnMapping.intCol
            const results = JSON.parse(props.data.results)
            const echartOptions = getOptions(results, localParams, intCol)
            setOptions({...options, data: echartOptions})
            replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localParams])

    useEffect(() => {
        if (props.data) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)

            if (isWaiting && props.data.status === 'done') {
                const results = JSON.parse(props.data.results)
                const intCol = params.column || props.data.columnInfo.columnMapping.intCol
                const echartOptions = getOptions(results, params, intCol)
                replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                setIsWaiting(false)
            }

            if (!isWaiting && props.data.status !== 'done') {
                setIsWaiting(true)
                const greyOpt = {...options.data, color: Array(30).fill('lightgrey')}
                setOptions({count: options ? options.count + 1 : 0, data: greyOpt})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, isWaiting])

    const checkboxChange = (e) => {
        const newLocalParams = {...localParams, logTrans: e.target.checked}
        setStepParametersWithoutRunning({stepId: props.data.id, params: newLocalParams})
        setLocalParams(newLocalParams)
    }

    const computeLogData = (d) => {
        const myD = d.filter(d => d.x !== 0 && d.y !== 0).map(a => {
            return {...a, x: Math.log10(a.x), y: Math.log10(a.y)}
        })

        const xMin = Math.min(...myD.map(a => a.x))
        const xMax = Math.max(...myD.map(a => a.x))
        const yMin = Math.min(...myD.map(a => a.y))
        const yMax = Math.max(...myD.map(a => a.y))

        return {lims: [[xMin, xMax], [yMin, yMax]], d: myD}
    }

    const computeColLimits = (d) => {
        return d.reduce((acc, v) => {
            acc[0] = (!acc[0] || v.d < acc[0]) ? v.d : acc[0]
            acc[1] = (!acc[1] || v.d > acc[1]) ? v.d : acc[1]
            return acc
        }, [undefined, undefined])
    }

    const getOptions = (results, params, intCol) => {
        const myData = (params.logTrans) ? computeLogData(results.data) : {d: results.data}
        const colLimits = (params.colorBy) ? computeColLimits(results.data) : null

        const options = {
            title: {text: params.xAxis + " - " + params.yAxis, left: "center"},
            dataset: [
                {
                    dimensions: ["x", "y", "name", "col"],
                    source: myData.d.map(p => {
                        return [p.x, p.y, p.n, p.d]
                    }),
                }
            ],
            xAxis: {
                name: intCol + " " + params.xAxis,
                nameLocation: "center",
                nameTextStyle: {
                    padding: [8, 4, 5, 6],
                    fontWeight: 'bold'
                },
                type: params.logTrans ? "log" : "value",
                axisLabel: {
                    formatter: function (value) {
                        return String(value).length > 5 ? value.toExponential(1) : value
                    }
                },
                min: (params.logTrans) ? Math.floor(myData.lims[0][0]) : null,
                max: (params.logTrans) ? Math.ceil(myData.lims[0][1]) : null
            },
            yAxis: {
                name: intCol + " " + params.yAxis,
                nameLocation: "center",
                nameTextStyle: {
                    padding: [8, 4, 45, 6],
                    fontWeight: 'bold'
                },
                type: params.logTrans ? "log" : "value",
                axisLabel: {
                    formatter: function (value) {
                        return String(value).length > 5 ? value.toExponential(1) : value
                    }
                },
                min: (params.logTrans) ? Math.floor(myData.lims[1][0]) : null,
                max: (params.logTrans) ? Math.ceil(myData.lims[1][1]) : null
            },
            tooltip: {
                showDelay: 0,
                formatter: function (p) {
                    const text1 = "<strong>" + p.data[2] + "</strong><br>"
                    const text2 = params.xAxis + ": <strong>" + String(p.data[0].length > 5 ? p.data[0].toExponential(1) : p.data[0].toFixed(1)) + "</strong><br>"
                    const text3 = params.yAxis + ": <strong>" + String(p.data[1].length > 5 ? p.data[1].toExponential(1) : p.data[1].toFixed(1)) + "</strong>"
                    const text = text1 + text2 + text3
                    return (params.colorBy) ? (text + "<br>" + params.colorBy + ": <strong>" + p.data[3].toFixed(1) + "</strong>") : text
                },
            },
            legend: {},
            series: [{
                datasetIndex: 0,
                type: 'scatter',
                encode: {
                    x: 'x',
                    y: 'y',
                },
                symbolSize: 5,
            }],
            grid: {
                left: 75
            }
        };

        return (params.colorBy) ? {
            ...options, visualMap: {
                min: colLimits[0],
                max: colLimits[1],
                dimension: 3,
                orient: 'vertical',
                right: 10,
                top: 'center',
                calculable: true,
                inRange: {
                    color: ['#f2c31a', '#24b7f2']
                },
                text: [params.colorBy, ''],
            }
        } : options
    }

    return (
        <Card className={'analysis-step-card'} title={props.data.nr + " - Scatter plot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu key={props.data.id + ':' + (options ? options.count : -1)}
                              stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={type}
                              commonResult={props.data.commonResult}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              stepParams={localParams}
                              setStepParams={setLocalParams}
                              hasPlot={true}
                              echartOptions={options ? options.data : null}
                              hasImputed={props.data.imputationTablePath != null}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
            />
        }>
            {props.data.status === 'done' && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='default' onClick={() => setShowZoom(true)}
                        icon={<FullscreenOutlined/>}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            <Checkbox
                onChange={checkboxChange} checked={localParams && localParams.logTrans}>Log transform [log10]
            </Checkbox>
            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     paramType={type} stepId={props.data.id}></EchartsZoom>}
        </Card>
    );
}