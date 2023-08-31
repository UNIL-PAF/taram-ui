import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Checkbox} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepTitle, replacePlotIfChanged, replaceProgressiveSeries} from "../CommonStepUtils";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {setStepParametersWithoutRunning, switchSel} from "../BackendAnalysisSteps";
import {typeToName} from "../TypeNameMapping"
import {useOnScreen} from "../../common/UseOnScreen";
import globalConfig from "../../globalConfig";
import {setError} from "../../navigation/loadingSlice";

export default function ScatterPlot(props) {
    const type = 'scatter-plot'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    // to show the selected proteins before the reload
    const [selProts, setSelProts] = useState([])
    const [onEvents, setOnEvents] = useState()
    const dispatch = useDispatch();
    const [stepResults, setStepResults] = useState()

    // check if element is shown
    const elementRef = useRef(null);
    const isOnScreen = useOnScreen(elementRef);

    useEffect(() => {
        if(isOnScreen){
            if(! stepResults){
                fetch(globalConfig.urlBackend + 'analysis-step/results/' + props.data.id)
                    .then(response => {
                        if(response.ok){
                            response.text().then(t => {
                                setStepResults(JSON.parse(t))
                            })
                        }else {
                            response.text().then(text => {
                                dispatch(setError({title: "Error while fetching results for step [" + props.data.id + "]", text: text}))
                            })
                        }
                    })
            }
        } else setStepResults(undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults, isOnScreen])

    useEffect(() => {
        setOnEvents({'click': showToolTipOnClick})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selProts])

    useEffect(() => {
        if (props.data && stepResults) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)

            if (isWaiting && props.data.status === 'done') {
                const echartOptions = getOptions(stepResults, params)
                const optsToSave = replaceProgressiveSeries(echartOptions)
                replacePlotIfChanged(props.data.id, stepResults, optsToSave, dispatch)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                setIsWaiting(false)
                const backendSelProts = JSON.parse(props.data.parameters).selProteins
                if (backendSelProts) setSelProts(backendSelProts)
            }

            if (!isWaiting && props.data.status !== 'done') {
                setIsWaiting(true)
                const greyOpt = greyOptions(options.data)
                setOptions({count: options ? options.count + 1 : 0, data: greyOpt})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, isWaiting, stepResults])

    const greyOptions = (options) => {
        const greyCol = 'lightgrey'
        let newOpts = {...options, color: Array(30).fill(greyCol), visualMap: null}
        newOpts.series.forEach((s, i) => {
            if (s.itemStyle) newOpts.series[i].itemStyle = {color: greyCol}
        })
        return newOpts
    }

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

    const getOptions = (results, params, mySelProteins) => {
        const myData = (params.logTrans) ? computeLogData(results.data) : {d: results.data}
        const colLimits = (params.colorBy) ? computeColLimits(results.data) : null
        const defSelProts = (mySelProteins ? mySelProteins : params.selProteins)

        const dataWithLabel = myData.d.map(d => {
            const showLab = defSelProts && defSelProts.includes(d.n)
            return {...d, showLab: showLab}
        })

        const options = {
            title: {text: params.xAxis + " - " + params.yAxis, left: "center", textStyle: {fontSize: 14}},
            dataset: [
                {
                    dimensions: ["x", "y", "name", "col", "showLab"],
                    source: dataWithLabel.map(p => {
                        return [p.x, p.y, p.n, p.d, p.showLab]
                    }),
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'showLab', value: true}
                    }
                },
            ],
            xAxis: {
                name: params.xAxis,
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
                // min: (params.logTrans) ? Math.floor(myData.lims[0][0]) : null,
                // max: (params.logTrans) ? Math.ceil(myData.lims[0][1]) : null
            },
            yAxis: {
                name: params.yAxis,
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
                // min: (params.logTrans) ? Math.floor(myData.lims[1][0]) : null,
                // max: (params.logTrans) ? Math.ceil(myData.lims[1][1]) : null
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
            series: [
                {
                    datasetIndex: 0,
                    type: 'scatter',
                    encode: {
                        x: 'x',
                        y: 'y',
                    },
                    symbolSize: 5
                },
                {
                    label: {
                        show: true,
                        formatter: function (v) {
                            return v.value[2]
                        },
                        position: 'right',
                        minMargin: 2,
                        //fontWeight: 'bold',
                        fontSize: 12,
                        color: 'black'

                    },
                    symbolSize: 8,
                    itemStyle: {
                        color: "rgba(0, 128, 0, 0)",
                        borderWidth: 1,
                        borderColor: 'green'
                    },
                    datasetIndex: 1,
                    type: 'scatter',
                    encode: {
                        x: 'x',
                        y: 'y',
                    },
                },
            ],
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

    function showToolTipOnClick(e) {
        // don't do anything if the analysis is locked
        if(props.isLocked) return

        const prot = e.data[2]
        const protIndex = (selProts ? selProts.indexOf(prot) : -1)
        const newSelProts = protIndex > -1 ? selProts.filter(e => e !== prot) : selProts.concat(prot)
        setSelProts(newSelProts)

        const echartOptions = getOptions(stepResults, localParams, newSelProts)
        const callback = () => {
            replacePlotIfChanged(props.data.id, stepResults, echartOptions, dispatch)
        }
        dispatch(switchSel({resultId: props.resultId, proteinAc: prot, stepId: props.data.id, callback: callback}))
        setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              ref={elementRef}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type), props.data.nrProteinGroups, props.data.status === 'done')}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
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
                              isSelected={props.isSelected}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isLocked={props.isLocked}
            />
        }>
            {props.data.status === 'done' && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                        icon={<FullscreenOutlined/>}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            <Checkbox
                onChange={checkboxChange}
                checked={localParams && localParams.logTrans}
                disabled={props.isLocked}
            >Log transform [log10]
            </Checkbox>
            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data} onEvents={onEvents}/>}
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     onEvents={onEvents}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}