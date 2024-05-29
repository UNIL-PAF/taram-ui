import React, {useEffect, useRef, useState, useCallback} from "react";
import {Button, Card, Checkbox, Spin, Typography} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepResults, getStepTitle, replacePlotIfChanged, replaceProgressiveSeries} from "../CommonStepUtils";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {setStepParametersWithoutRunning, switchSel} from "../BackendAnalysisSteps";
import {typeToName} from "../TypeNameMapping"
import {useOnScreen} from "../../common/UseOnScreen";
import {defaultColors} from "../../common/PlotColors";

const {Text} = Typography;

export default function ScatterPlot(props) {
    const type = 'scatter-plot'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const [count, setCount] = useState(1)
    // to show the selected proteins before the reload
    const [selProts, setSelProts] = useState([])
    const [logTrans, setLogTrans] = useState(false)
    const [showXYLine, setShowXYLine] = useState(false)
    const [showRegrLine, setShowRegrLine] = useState(false)
    const dispatch = useDispatch();
    const [stepResults, setStepResults] = useState()
    const [showLoading, setShowLoading] = useState(false)
    const [showError, setShowError] = useState(false)

    // check if element is shown
    const elementRef = useRef(null);
    const isOnScreen = useOnScreen(elementRef);

    useEffect(() => {
        if (props.data && props.data.status === "done") {
            if (isOnScreen) {
                if (!stepResults) {
                    setShowLoading(true)
                    setLocalParams(null)
                    getStepResults(props.data.id, setStepResults, dispatch, () => setShowLoading(false), () => setShowError(true))
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults, isOnScreen, props.data])

    const updatePlot = useCallback(() => {
            const newParams = {...localParams, selProteins: selProts}
            const echartOptions = getOptions(stepResults, newParams, selProts)
            const withColors = {...echartOptions, color: defaultColors}
            setOptions({count: options ? options.count + 1 : 0, data: withColors})
            const optsToSave = replaceProgressiveSeries(withColors)
            replacePlotIfChanged(props.data.id, stepResults, optsToSave, dispatch)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selProts, logTrans, showXYLine, showRegrLine]
    );

    // update if selProts changed
    useEffect(() => {
        if (props.data && props.data.status === 'done' && stepResults) {
            updatePlot()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count])

    // update if stepResults arrive
    useEffect(() => {
        if (localParams && props.data && props.data.status === 'done' && stepResults) {
            const echartOptions = getOptions(stepResults, localParams)
            const withColors = {...echartOptions, color: defaultColors}
            setOptions({...options, data: withColors})
            const optsToSave = replaceProgressiveSeries(withColors)
            replacePlotIfChanged(props.data.id, stepResults, optsToSave, dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults])

    // set initial params
    useEffect(() => {
        if (!localParams && props.data && props.data.parameters) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)
            if (params.selProteins) setSelProts(params.selProteins)
            if (typeof params.logTrans !== "undefined") setLogTrans(params.logTrans)
            if (typeof params.showXYLine !== "undefined") setShowXYLine(params.showXYLine)
            if (typeof params.showRegrLine !== "undefined") setShowRegrLine(params.showRegrLine)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, localParams])

    useEffect(() => {
        if (props.data && stepResults) {
            if (isWaiting && props.data.status === 'done') {
                setIsWaiting(false)
                setStepResults(undefined)
                setOptions({count: 0})
            }

            if (!isWaiting && props.data && props.data.status !== 'done') {
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

    const checkboxChange = (e, field) => {
        if(field === "logTrans") setLogTrans(e.target.checked)
        else if(field === "showXYLine") setShowXYLine(e.target.checked)
        else setShowRegrLine(e.target.checked)

        let newParams = {...localParams}
        newParams[field] = e.target.checked

        setLocalParams(newParams)
        dispatch(setStepParametersWithoutRunning({
            stepId: props.data.id,
            params: newParams,
            callback: () => setCount(count + 1)
        }))
    }

    const computeLimits = (min, max) => {
        const newMin = Math.abs(min) > 0 ? Math.floor(min) : min
        const newMax = Math.abs(max) > 0 ? Math.ceil(max) : max
        return [newMin-Math.ceil(Math.abs(newMin*0.05)), newMax+Math.ceil(Math.abs(newMax*0.05))]
    }

    const computeLogData = (d, doCompute) => {
        const myD = d.filter(d => d.x > 0 && d.y > 0).map(a => {
            return {...a, x: Math.log10(a.x), y: Math.log10(a.y)}
        })

        const newD = doCompute ? myD : d

        const xVals = newD.map(a => a.x)
        const yVals = newD.map(a => a.y)

        const xMin = Math.min(...xVals)
        const xMax = Math.max(...xVals)
        const yMin = Math.min(...yVals)
        const yMax = Math.max(...yVals)

        return {lims: [computeLimits(xMin, xMax), computeLimits(yMin, yMax)], d: newD}
    }

    const computeColLimits = (d) => {
        return d.reduce((acc, v) => {
            acc[0] = (!acc[0] || v.d < acc[0]) ? v.d : acc[0]
            acc[1] = (!acc[1] || v.d > acc[1]) ? v.d : acc[1]
            return acc
        }, [undefined, undefined])
    }

    const compY = (x, reg) => {
        return x * reg.slope + reg.intercept
    }

    const compX = (y, reg) => {
        return (y - reg.intercept) / reg.slope
    }

    const getRegrData = (reg, lims) => {
        const evXMin = compX(lims[1][0], reg)
        const evXMax = compX(lims[1][1], reg)

        const xMin = evXMin > lims[0][0] ? evXMin : lims[0][0]
        const xMax = evXMax < lims[0][1] ? evXMax : lims[0][1]

        const formatter = "y = " +
            reg.slope.toFixed(2) + "x " +
            (reg.intercept < 0 ? "- " : "+ ") +
            Math.abs(reg.intercept).toFixed(2) + "\nR2: " +
            reg.rSquare.toFixed(2)

        const regrBase = {
            symbol: 'none',
            label: {
                formatter: formatter,
                align: 'left',
                position: 'end',
                backgroundColor: '#fef4f4',
                borderColor: '#f6adad',
                borderWidth: 1,
                borderRadius: 4,
                padding: [2, 8],
                lineHeight: 16,
            },
            lineStyle: {
                type: 'solid',
                color: '#ee6666'
            },
            tooltip: {
                formatter: formatter
            },
        }

        return  [
            { ...regrBase, coord: [xMin, compY(xMin, reg)]},
            { ...regrBase, coord: [xMax, compY(xMax, reg)]}
        ]
    }

    const getXYData = (lims, reverseOrder) => {
        const xyBase = {
            symbol: 'none',
            lineStyle: {
                type: 'solid',
                color: '#3ba272'
            },
            tooltip: {
                formatter: 'y = x'
            },
            label: {
                formatter: "y = x",
                align: 'left',
                position: 'end',
                backgroundColor: '#e4f5ed',
                borderColor: '#63c698',
                borderWidth: 1,
                borderRadius: 4,
                padding: [2, 8],
                lineHeight: 16,
            },
        }

        const xYCurve = {slope: 1, intercept: 0}

        const evXMin = compX(lims[1][0], xYCurve)
        const evXMax = compX(lims[1][1], xYCurve)

        const xMin = evXMin > lims[0][0] ? evXMin : lims[0][0]
        const xMax = evXMax < lims[0][1] ? evXMax : lims[0][1]

        const myCoords = [
            {...xyBase, coord: [xMin, compY(xMin, xYCurve)]},
            {...xyBase, coord: [xMax, compY(xMax, xYCurve)]}
        ]

        return  (!reverseOrder ? myCoords : myCoords.reverse())
    }

    const getXYLines = (reg, lims) => {
            if(!showRegrLine && !showXYLine) return null
            const xyLine = (showXYLine ?  [getXYData(lims, showRegrLine)] : [])

            return {
                animation: false,
                data: xyLine.concat(showRegrLine && reg ? [getRegrData(reg, lims)] : [])
            }
        }
    ;

    const getOptions = (results, params, mySelProteins) => {
        const myData = computeLogData(results.data, logTrans)
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
                axisLabel: {
                    formatter: function (value) {
                        return String(value).length > 5 ? value.toExponential(1) : value
                    }
                },
                min: myData.lims[0][0],
                max: myData.lims[0][1]
            },
            yAxis: {
                name: params.yAxis,
                nameLocation: "center",
                nameTextStyle: {
                    padding: [8, 4, 45, 6],
                    fontWeight: 'bold'
                },
                axisLabel: {
                    formatter: function (value) {
                        return String(value).length > 5 ? value.toExponential(1) : value
                    }
                },
                min: myData.lims[1][0],
                max: myData.lims[1][1]
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
                    itemStyle: {
                      color: '#fac858'
                    },
                    symbolSize: 5,
                    markLine: logTrans ? null : getXYLines(results.linearRegression, myData.lims, params)
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
                    }
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

    const showToolTipOnClick = useCallback((e) => {
            // don't do anything if the analysis is locked
            if (props.isLocked) return

            const prot = e.data[2]
            const protIndex = (selProts ? selProts.indexOf(prot) : -1)
            const newSelProts = protIndex > -1 ? selProts.filter(e => e !== prot) : selProts.concat(prot)
            setSelProts(newSelProts)
            setLocalParams({...localParams, selProteins: newSelProts})
            const callback = () => {
                setCount(count + 1)
            }
            dispatch(switchSel({resultId: props.resultId, selId: prot, stepId: props.data.id, callback: callback}))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selProts, count, localParams]
    );

    const onEvents = {
        click: showToolTipOnClick,
    };

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
                              resType={props.resType}
            />
        }>
            {props.data.status === 'done' && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                        icon={<FullscreenOutlined/>}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            <Checkbox
                onChange={(e) => checkboxChange(e, "logTrans")}
                checked={logTrans}
                disabled={props.isLocked}
            >Log transform [log10]
            </Checkbox>
            <Checkbox
                onChange={(e) => checkboxChange(e, "showXYLine")}
                checked={showXYLine}
                disabled={props.isLocked || logTrans}
            >y = x
            </Checkbox>
            <Checkbox
                onChange={(e) => checkboxChange(e, "showRegrLine")}
                checked={showRegrLine}
                disabled={props.isLocked || logTrans || (stepResults && !stepResults.linearRegression)}
            >Linear regression
            </Checkbox>
            {showLoading && !(options && options.data) && !showError &&
                <Spin tip="Loading" style={{marginLeft: "20px"}}>
                    <div className="content"/>
                </Spin>}
            {showError && <Text type="danger">Unable to load plot from server.</Text>}
            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data} onEvents={onEvents}/>}
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId}
                         comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     onEvents={onEvents}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}