import React, {useEffect, useState, useRef} from "react";
import {Button, Card, Checkbox, Spin, Typography} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepResults, getStepTitle, replacePlotIfChanged} from "../CommonStepUtils";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {setStepParametersWithoutRunning} from "../BackendAnalysisSteps"
import {typeToName} from "../TypeNameMapping"
import {useOnScreen} from "../../common/UseOnScreen";
import {defaultColors} from "../../common/PlotColors"

const { Text } = Typography;

export default function BoxPlot(props) {
    const type = 'boxplot'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState({count: 0})
    const [isWaiting, setIsWaiting] = useState(true)
    const [heightAndBottom, setHeightAndBottom] = useState({height: '400px', bottom: 60})
    const [showZoom, setShowZoom] = useState(null)
    const [logScale, setLogScale] = useState()
    const [groupByCondition, setGroupByCondition] = useState()
    const dispatch = useDispatch();
    const [stepResults, setStepResults] = useState()
    const [count, setCount] = useState(1)
    const [showLoading, setShowLoading] = useState(false)
    const [showError, setShowError] = useState(false)

    // check if element is shown
    const elementRef = useRef(null);
    const isOnScreen = useOnScreen(elementRef);

    // Download results
    useEffect(() => {
        if(props.data && props.data.status === "done") {
            if (isOnScreen) {
                if (!stepResults) {
                    setShowLoading(true)
                    getStepResults(props.data.id, setStepResults, dispatch, () => setShowLoading(false), () => setShowError(true))
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults, isOnScreen, props.data])

    // update if logScale or groupByCondition changed
    useEffect(() => {
       if(props.data && props.data.status === 'done' && stepResults){
           const echartOptions = getOptions(stepResults)
           const withColors = {...echartOptions, color: defaultColors}
           setOptions({...options, data: withColors, count: count})
           replacePlotIfChanged(props.data.id, stepResults, echartOptions, dispatch)
       }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count])

    // update if stepResults arrive
    useEffect(() => {
        if (props.data && props.data.status === 'done' && stepResults) {
            const echartOptions = getOptions(stepResults)
            const withColors = {...echartOptions, color: defaultColors}
            setOptions({...options, data: withColors})
            setHeightAndBottom(getPlotHeightAndBottom(stepResults))
            replacePlotIfChanged(props.data.id, stepResults, echartOptions, dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults])

    // reset step results if status gets idle
    // update if stepResults arrive
    useEffect(() => {
        if(props.data && props.data.status === 'idle' && stepResults){
            setStepResults(null)
            setOptions({count: 0})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])

    // set initial params
    useEffect(() => {
        if(!localParams && props.data && props.data.parameters){
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)
            if(typeof params.logScale !== "undefined") setLogScale(params.logScale)
            if(typeof params.groupByCondition !== "undefined") setGroupByCondition(params.groupByCondition)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, localParams])

    useEffect(() => {
        if (props.data && stepResults) {
            if (isWaiting && props.data.status === "done") {
                setIsWaiting(false)
                setStepResults(undefined)
                setOptions({count: 0})
            }

            if (!isWaiting && options.data && props.data.status === "running") {
                setIsWaiting(true)
                const greyOpt = {...options.data, color: Array(9).fill('lightgrey')}
                setOptions({count: options.count + 1, data: greyOpt})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, isWaiting, stepResults])

    const getPlotHeightAndBottom = (stepResults) => {
        const defaultHeight = 400
        const defaultBottom =  60
        const maxChars = 10
        const maxNameChar =  Math.max.apply(Math, stepResults.experimentNames.map(a => a.length))
        if(maxNameChar > maxChars) {
            const charDiff = maxNameChar - maxChars
            return {height: (defaultHeight + charDiff * 5).toString() + "px", bottom: (defaultBottom + charDiff * 5)}
        } else {
            return {height: defaultHeight.toString() + "px", bottom: defaultBottom}
        }
    }

    const prepareAllDatat = (myResults) => {
        if(!myResults.allProtData) return null
        const myTab = myResults.allProtData.reduce((a, v, i) => {
            const newPar = v.map( b => {
                return [myResults.experimentNames[i], b.y, b.j]
            })
            return a.concat(newPar)
        }, [])
        return myTab
    }

    const computeTopSpace = (groupNames) => {
        const defaultSpace = 50
        if(groupNames.length === 1 && groupNames[0] === null){
            return defaultSpace
        }else {
            const totCharsSpace = groupNames.reduce( (a, v) => a + v.length, 0)
            const nrLines = Math.ceil((totCharsSpace / 5 + groupNames.length) / 15) - 1
            return defaultSpace + nrLines * 15
        }
    }

    const getOptions = (myResults) => {
        const results = {...myResults}

        const params = localParams || JSON.parse(props.data.parameters)
        const allProts = params.showAll ? prepareAllDatat({...myResults}) : null
        const newData = results.boxPlotData.map(d => {
            const dataWithName = d.groupData.map(box => {
                const myData = params.logScale ? box.logData : box.data
                return [box.name].concat(myData)
            })
            return {
                group: d.group ? d.group : null,
                data: dataWithName
            }
        })

        const nrXLabels = results.boxPlotData.reduce((a, v) => a + v.groupData.length, 0)
        results.boxPlotData = newData

        const boxplotDimensions = ['name', 'min', 'Q1', 'median', 'Q3', 'max']

        const parsedRes = results

        const [yMin, yMax] = parsedRes.boxPlotData.reduce((a, v) => {
            const myMin = Math.min.apply(Math, v.data.map(x => x[1]))
            const myMax = Math.max.apply(Math, v.data.map(x => x[5]))
            if (typeof a[0] === "undefined" || a[0] < myMin) a[0] = myMin
            if (typeof a[1] === "undefined" || a[1] > myMax) a[1] = myMax
            return a
        }, [undefined, undefined])

        const range = yMax - yMin

        const boxplotDatasets = parsedRes.boxPlotData.map(d => {
            return {
                dimensions: boxplotDimensions,
                source: d.data
            }
        })

        const boxplotSeries = parsedRes.boxPlotData.map((d, i) => {
            return {
                name: "group_" + d.group,
                type: 'boxplot',
                datasetIndex: i,
                encode: {
                    y: boxplotDimensions.slice(1),
                    x: 'name',
                },
                xAxisIndex: i,
                itemStyle: {
                    opacity: params.showAll ? 0.8 : 1.0
                },
            }
        })

        const groupedByCondition = parsedRes.boxPlotData.reduce(
            (acc, curr) => acc.concat(curr.data.map(d => d[0])),
            []
        );

        const sortByCondition = () => {
            const sortArr = experimentNames.map((n) => {
                return parsedRes.experimentNames.indexOf(n)
            })

            return parsedRes.selProtData.map(p => {
                const myInts = (params.logScale && p.logInts) ? p.logInts : p.ints
                let newInts = sortArr.map(sortIdx => myInts[sortIdx])
                return {...p, ints: newInts}
            })
        }

        const experimentNames = params.groupByCondition ? groupedByCondition : parsedRes.experimentNames

        const selProtSeries = () => {
            if (!parsedRes.selProtData) return null

            return sortByCondition().map(d => {
                return {
                    name: d.gene ? d.gene : d.prot,
                    type: 'line',
                    data: d.ints
                }
            })
        }

        const series01 = parsedRes.selProtData ? boxplotSeries.concat(selProtSeries()) : boxplotSeries

        const allprotSeries = params.showAll ? {
            name: "show_all_proteins",
            type: "custom",
            renderItem: function(params, api) {
                const xValue = api.value(0)

                const barLayout = api.barLayout({
                    barGap: "30%",
                    barCategoryGap: "100%",
                    count: 1,
                });

                const point = api.coord([xValue, api.value(1)]);

                const jitterOffset = api.value(2) * barLayout[0].bandWidth / 1.5;

                point[0] -= jitterOffset

                return {
                    type: "circle",
                    shape: {
                        cx: point[0],
                        cy: point[1],
                        r: 1.5,
                    },
                    style: {
                        fill: "#989898",
                        opacity: 0.2,
                    },
                    styleEmphasis: {
                        fill: "#989898",
                        opacity: 0.9,
                    },
                };
            },
            dimensions: ['x', 'y', 'jiiter'],
            data: allProts,
            animation: false,
            progressiveThreshold: 1,
            progressive: 0,
            large: true,
            largeThreshold: 1,
            silent: true
        } : null


        const series = params.showAll ? series01.concat(allprotSeries) : series01
        const legendNames = series.filter(a => a.name !== "group_null" && a.name !== "show_all_proteins").map(a => a.name)

        // special cases when many samples
        const xFontSizeInt = nrXLabels > 40 ? 12 - Math.floor((nrXLabels - 40) / 6) : 12
        const xFontSize = xFontSizeInt < 5 ? 5 : xFontSizeInt

        const topSpace =  computeTopSpace(parsedRes.boxPlotData.map(a => a.group))

        const yAxisName = params.column || props.data.columnInfo.columnMapping.intCol

        const myOptions = {
            dataset: boxplotDatasets,
            series: series,
            legend: {
                formatter: function (name) {
                    if (name.includes("group_")) {
                        return name.substring(6)
                    }
                    return name;
                },
                data: legendNames
            },
            xAxis: parsedRes.boxPlotData.map((d, i) => {
                return {
                    type: 'category',
                    scale: true,
                    axisLabel: {
                        interval: 0,
                        rotate: 50,
                        fontSize: xFontSize
                    },
                    show: (i === 0 ? true : false),
                    data: experimentNames,
                    axisLine: {onZero: false}
                }
            }),
            yAxis: {
                name: yAxisName,
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    padding: [0, 0, 10, 0]
                },
                min: (yMin - range * 0.2).toFixed(1),
                axisLabel: {
                    showMinLabel: false,
                }
            },
            grid: {
                top:    topSpace,
                bottom: heightAndBottom.bottom,
                left:   '10%',
                right:  '10%',
            },
            tooltip: {
                showDelay: 0,
                formatter: function (v) {
                    if(v.seriesType === "boxplot"){
                        return "<strong>" + v.seriesName.replace("group_", "") + "<br>"
                            + v.value[0] + "</strong><br>" +
                            "Min: " + v.value[1].toFixed(1) + "<br>" +
                            "Q1: " + v.value[2].toFixed(1) + "<br>" +
                            "Median: " + v.value[3].toFixed(1) + "<br>" +
                            "Q3: " + v.value[4].toFixed(1) + "<br>" +
                            "Max: " + v.value[5].toFixed(1) + "<br>"

                    }else if(v.seriesType === "line"){
                        return "<strong>" + v.seriesName + "<br>"
                            + v.name + "</strong><br>" +
                            yAxisName + ": " + v.value.toFixed(1)
                    }else return null
                },
            },
        };

        return myOptions
    }

    const checkboxChange = (e, field) => {
        const newLocalParams = {...localParams}
        newLocalParams[field] = e.target.checked
        dispatch(setStepParametersWithoutRunning({stepId: props.data.id, params: newLocalParams, callback: () => setCount(count + 1)}))
        setLocalParams(newLocalParams)
        if(field === "logScale") setLogScale(e.target.checked)
        if(field === "groupByCondition") setGroupByCondition(e.target.checked)
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              ref={elementRef}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type), props.data.nrProteinGroups, props.data.status === 'done')}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu key={props.data.id + "-" + (props.data.nextId ? props.data.nextId : "") + ':' + (options ? options.count : -1)}
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
                className={"analysis-step-row"}
                onChange={(e) => checkboxChange(e, "logScale")}
                checked={logScale}
                disabled={props.isLocked}
            >Use logarithmic scale [log2]
            </Checkbox>
            <Checkbox
                className={"analysis-step-row"}
                disabled={props.isLocked}
                onChange={(e) => checkboxChange(e, "groupByCondition")}
                checked={groupByCondition}>Group by condition
            </Checkbox>
            <div style={{margin: "13px"}}></div>
            {showLoading && !(options && options.data) && !showError && <Spin tip="Loading" style={{marginLeft: "20px"}}>
                <div className="content"/>
            </Spin>}
            {showError && <Text type="danger">Unable to load plot from server.</Text>}
            {options && options.data && options.data.series.length > 0 && options.data.dataset.length > 0 &&
                <ReactECharts key={options.count} option={options.data} style={{
                    height: heightAndBottom.height,
                    width: '100%',
                }}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}
                         isLocked={props.isLocked}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}