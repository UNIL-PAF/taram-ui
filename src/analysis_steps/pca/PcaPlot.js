import React, {useEffect, useState, useRef, useCallback} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepResults, getStepTitle, replacePlotIfChanged, replaceProgressiveSeries} from "../CommonStepUtils";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {typeToName} from "../TypeNameMapping"
import {switchSel} from "../BackendAnalysisSteps";
import {useOnScreen} from "../../common/UseOnScreen";
import {defaultColors} from "../../common/PlotColors";

export default function PcaPlot(props) {
    const type = 'pca'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const [selExps, setSelExps] = useState([])
    const dispatch = useDispatch();
    const [stepResults, setStepResults] = useState()
    const [count, setCount] = useState(1)

    // check if element is shown
    const elementRef = useRef(null);
    const isOnScreen = useOnScreen(elementRef);

    useEffect(() => {
        if(props.data && props.data.status === "done") {
            if (isOnScreen) {
                if (!stepResults) {
                    getStepResults(props.data.id, setStepResults, dispatch)
                }
            } else setStepResults(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults, isOnScreen, props.data])

    const updatePlot = useCallback(() => {
            const newParams = {...localParams, selExps: selExps}
            const echartOptions = getOptions(stepResults, newParams, selExps)
            const withColors = {...echartOptions, color: defaultColors}
            setOptions({count: options ? options.count + 1 : 0, data: withColors})
            const optsToSave = replaceProgressiveSeries(withColors)
            replacePlotIfChanged(props.data.id, stepResults, optsToSave, dispatch)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selExps]
    );

    // update if selExps changed
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
        if(!localParams && props.data && props.data.parameters){
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)
            if (params.selExps) setSelExps(params.selExps)
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

    /*

    useEffect(() => {
        if (props.data && props.data.results) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)

            if (isWaiting && props.data.status === 'done') {
                const results = JSON.parse(props.data.results)
                const backendSelExps = JSON.parse(props.data.parameters).selExps
                if (backendSelExps) setSelExps(backendSelExps)
                const echartOptions = getOptions(results, params, backendSelExps)
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

     */

    const getOptions = (results, params, mySelExps) => {
        const xAxisPc = 0
        const yAxisPc = 1

        const transforms = results.groups.map((g) => {
            return {transform: {type: 'filter', config: {dimension: 'group', value: g}}}
        })

        const labels = [
            {
                label: {
                    show: true,
                    formatter: function (v) {
                        return v.value[0]
                    },
                    position: 'right',
                    minMargin: 2,
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: 'black'

                },
                symbolSize: 10,
                itemStyle: {
                    color: "rgba(0, 128, 0, 0)",
                    borderWidth: 1,
                    borderColor: 'grey'
                },
                datasetIndex: 1,
                type: 'scatter',
                encode: {
                    x: 'x',
                    y: 'y',
                },
            },
        ]

        const series = labels.concat(results.groups.map((g, i) => {
            return  {
                name: g,
                datasetIndex: (i + 2),
                type: 'scatter',
                encode: {
                    x: 'x',
                    y: 'y'
                }
            }
        }))

        const defSelExps = (mySelExps ? mySelExps : params.selExps)

        const dataWithLabel = results.pcList.map(p => {
            const showLab = defSelExps && defSelExps.includes(p.expName)
            return [p.expName, p.groupName, p.pcVals[xAxisPc], p.pcVals[yAxisPc], showLab]
        })

        const options = {
            dataset: [
                {
                    dimensions: ["expName", "group", "x", "y", "showLab"],
                    source: dataWithLabel
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'showLab', value: true}
                    }
                },
            ].concat(transforms),
            xAxis: {
                name: "PC" + (xAxisPc + 1) + " (" + results.explVars[xAxisPc].toFixed(1) + "%)",
                nameLocation: "center",
                nameTextStyle: {padding: [10, 4, 5, 6]},
            },
            yAxis: {
                name: "PC" + (yAxisPc + 1) + " (" + results.explVars[yAxisPc].toFixed(1) + "%)",
                nameLocation: "center",
                nameTextStyle: {padding: [8, 4, 15, 6]},
            },
            tooltip: {
                position: 'top',
                formatter: function (params) {
                    return params.data[0]
                }
            },
            legend: {},
            series: series.length ? series : [{
                datasetIndex: 0,
                type: 'scatter',
                encode: {
                    x: 'x',
                    y: 'y'
                }
            }]
        };

        return options
    }

    /*
    function showToolTipOnClick(e) {
        // don't do anything if the analysis is locked
        if(props.isLocked) return

        const exp = e.data[0]
        const expIndex = (selExps ? selExps.indexOf(exp) : -1)
        const newSelExps = expIndex > -1 ? selExps.filter(e => e !== exp) : selExps.concat(exp)
        setSelExps(newSelExps)

        const results = JSON.parse(props.data.results)
        const echartOptions = getOptions(results, localParams, newSelExps)
        const callback = () => {
            replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
        }
        dispatch(switchSel({resultId: props.resultId, selId: exp, stepId: props.data.id, callback: callback}))
        setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
    }

     */

    const showToolTipOnClick = useCallback((e) => {
        // don't do anything if the analysis is locked
        if(props.isLocked) return

        const exp = e.data[0]
        const expIndex = (selExps ? selExps.indexOf(exp) : -1)
        const newSelExps = expIndex > -1 ? selExps.filter(e => e !== exp) : selExps.concat(exp)
        setSelExps(newSelExps)

            setLocalParams({...localParams, selExps: newSelExps})
            const callback = () => {
                setCount(count+1)
            }
            dispatch(switchSel({resultId: props.resultId, selId: exp, stepId: props.data.id, callback: callback}))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selExps, count]
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
            />
        }>
            {props.data.status === 'done' && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                        icon={<FullscreenOutlined/>}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data} onEvents={onEvents}/>}
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}
                                     onEvents={onEvents}></EchartsZoom>}
        </Card>
    );
}