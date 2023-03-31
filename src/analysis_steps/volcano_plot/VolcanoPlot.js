import React, {useEffect, useState} from "react";
import {Button, Card, Row, Col} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import StepComment from "../StepComment";
import {switchSelProt} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import EchartsZoom from "../EchartsZoom";
import {FullscreenOutlined} from "@ant-design/icons";
import {replacePlotIfChanged} from "../CommonStep";

export default function VolcanoPlot(props) {
    const type = 'volcano-plot'

    const dispatch = useDispatch();
    const [localParams, setLocalParams] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [options, setOptions] = useState()
    // to show the selected proteins before the reload
    const [selProts, setSelProts] = useState([])
    const [onEvents, setOnEvents] = useState()
    const [showZoom, setShowZoom] = useState(null)

    useEffect(() => {
        if (props.data.parameters) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)
        }
        if (props.data.status === 'done') {
            if (isWaiting) {
                const results = JSON.parse(props.data.results)
                const echartOptions = getOptions(results)
                const backendSelProts = JSON.parse(props.data.parameters).selProteins
                if (backendSelProts) setSelProts(backendSelProts)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                setIsWaiting(false)
                replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
            }
            setOnEvents({'click': showToolTipOnClick})
        } else {
            if (!isWaiting) {
                setIsWaiting(true)
                const greyOpt = greyOptions(options.data)
                setOptions({count: options ? options.count + 1 : 0, data: greyOpt})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, selProts])

    const greyOptions = (options) => {
        const greyCol = 'lightgrey'
        let newOpts = {...options, color: Array(30).fill(greyCol)}
        newOpts.series.forEach((s, i) => {
            if (s.itemStyle) newOpts.series[i].itemStyle = {color: greyCol}
        })
        newOpts.series[0].markLine.lineStyle.color = greyCol
        return newOpts
    }

    const getOptions = (results, mySelProts) => {
        const params = JSON.parse(props.data.parameters)

        // we set the default selProts
        const defSelProts = (mySelProts ? mySelProts : params.selProteins)

        const dataWithLabel = results.data.filter(d => {
            return params.useAdjustedPVal ? d.qVal : d.pVal
        }).map(d => {
            const showLab = defSelProts && defSelProts.includes(d.prot)
            return {...d, showLab: showLab}
        })

        const valueName = params.useAdjustedPVal ? "q-value" : "p-value"
        const xAxisName = params.log10PVal ? ("-log10(" + valueName + ")") : valueName

        const opts = {
            title: {text: params.comparison.group1 + " - " + params.comparison.group2, left: "center"},
            xAxis: {
                name: "Fold change",
                nameLocation: "center",
                nameTextStyle: {padding: [8, 4, 5, 6]},
            },
            yAxis: {
                min: 0,
                name: xAxisName,
                position: "left",
                nameRotate: 90,
                nameLocation: "center",
                nameTextStyle: {padding: [8, 4, 5, 6]},
            },
            tooltip: {
                showDelay: 0,
                formatter: function (myParams) {
                    if (myParams.componentType === "markLine") {
                        const text =
                            myParams.data.name + " threshold: " + (myParams.data.name.includes("Fold") ? myParams.data.value : params.pValThresh);
                        return text;
                    } else {
                        return "Gene: <strong>" + myParams.data.gene + "</strong><br>" +
                            "Protein AC: <strong>" + myParams.data.prot + "</strong><br>" +
                            "p-value: <strong>" + myParams.data.pVal.toPrecision(3) + "</strong><br>" +
                            "q-value: <strong>" + myParams.data.qVal.toPrecision(3) + "</strong><br>" +
                            "fold change: <strong>" + myParams.data.fc.toFixed(2) + "</strong>"
                    }
                },
            },
            dataset: [
                {
                    dimensions: ["fc", "plotVal", "isSign", "showLab", "qVal", "qIsSign"],
                    source: dataWithLabel,
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: params.useAdjustedPVal ? 'qIsSign' : 'isSign', value: true}
                    }
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: params.useAdjustedPVal ? 'qIsSign' : 'isSign', value: false}
                    }
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'showLab', value: true}
                    }
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'qIsSign', value: true}
                    },
                },

            ],
            legend: {
                top: "10%",
                data: ["Sign" + (params.useAdjustedPVal ? " q-val" : "")].concat((!params.useAdjustedPVal && params.showQVal) ? ["Sign q-val"] : [])
            },
            series: [
                {
                    name: "Sign" + (params.useAdjustedPVal ? " q-val" : ""),
                    label: {
                        show: false,
                    },
                    symbolSize: 5,
                    datasetIndex: 1,
                    large: true,
                    largeThreshold: 1,
                    type: 'scatter',
                    encode: {
                        x: 'fc',
                        y: 'plotPVal'
                    },
                    itemStyle: {
                        color: "#91cc75"
                    },
                    markLine: {
                        lineStyle: {
                            type: "dashed",
                            color: "#3ba272",
                        },
                        label: {show: false},
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
                                name: (params.useAdjustedPVal ? " q-Value" : "p-Value")
                            },
                        ],
                    },
                },
                {
                    itemStyle: {
                        color: "#5470c6"
                    },
                    label: {show: false},
                    symbolSize: 5,
                    datasetIndex: 2,
                    large: true,
                    largeThreshold: 1,
                    type: 'scatter',
                    encode: {
                        x: 'fc',
                        y: 'plotPVal'
                    }
                },
                {
                    label: {
                        show: true,
                        formatter: function (v) {
                            return v.data.gene ? v.data.gene : v.data.prot
                        },
                        position: 'right',
                        minMargin: 2,
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                    symbolSize: 8,
                    itemStyle: {
                        color: "rgba(0, 128, 0, 0)",
                        borderWidth: 1,
                        borderColor: 'green'
                    },
                    datasetIndex: 3,
                    type: 'scatter',
                },
            ]
        }

        const qValSeries = {
            name: "Sign q-val",
            itemStyle: {
                color: "#fac858"
            },
            label: {show: false},
            symbolSize: 5,
            datasetIndex: 4,
            large: true,
            largeThreshold: 1,
            type: 'scatter',
            encode: {
                x: 'fc',
                y: 'plotPVal'
            }
        }

        const finalOpts = {
            ...opts,
            series: ((!params.useAdjustedPVal && params.showQVal) ? opts.series.concat(qValSeries) : opts.series)
        }

        return finalOpts
    }

    function showToolTipOnClick(e) {
        const prot = e.data.prot
        const protIndex = (selProts ? selProts.indexOf(prot) : -1)
        const newSelProts = protIndex > -1 ? selProts.filter(e => e !== prot) : selProts.concat(prot)
        setSelProts(newSelProts)
        const results = JSON.parse(props.data.results)
        const echartOptions = getOptions(results, newSelProts)
        const callback = () => {
            replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
        }
        dispatch(switchSelProt({resultId: props.resultId, proteinAc: prot, stepId: props.data.id, callback: callback}))
        setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
    }

    return (
        <Card className={'analysis-step-card'} title={props.data.nr + " - Volcano plot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu key={props.data.id + ':' + (options ? options.count : -1)}
                              stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={type}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              echartOptions={options ? options.data : null}
                              setStepParams={setLocalParams}
                              hasPlot={true}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.status === 'done' && <Row>
                <Col span={12}></Col>
                <Col span={12}>
                    <div style={{textAlign: 'right'}}>
                        <Button size={'small'} type='default' onClick={() => setShowZoom(true)}
                                icon={<FullscreenOutlined/>}>Expand</Button>
                    </div>
                </Col>
            </Row>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}

            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data} onEvents={onEvents}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     paramType={type} stepId={props.data.id}></EchartsZoom>}
        </Card>
    );
}