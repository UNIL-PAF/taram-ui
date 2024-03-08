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

/*
  Random with seed ?
  Taken from: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

  var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
 */

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
            } else setStepResults(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepResults, isOnScreen, props.data])

    // update if logScale or groupByCondition changed
    useEffect(() => {
       if(props.data && props.data.status === 'done' && stepResults){
           const echartOptions = getOptions(stepResults)
           const withColors = {...echartOptions, color: defaultColors}
           setOptions({...options, data: withColors})
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

    const getOptions = (myResults) => {
        const results = {...myResults}
        const params = localParams || JSON.parse(props.data.parameters)
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
                type: type,
                datasetIndex: i,
                encode: {
                    y: boxplotDimensions.slice(1),
                    x: 'name',
                },
                xAxisIndex: i
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

        const series = parsedRes.selProtData ? boxplotSeries.concat(selProtSeries()) : boxplotSeries
        const legendNames = series.filter(a => a.name !== "group_null").map(a => a.name)

        const options = {
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
                    axisLabel: {interval: 0, rotate: 50},
                    show: (i === 0 ? true : false),
                    data: experimentNames,
                    axisLine: {onZero: false}
                }
            }),
            yAxis: {
                name: params.column || props.data.columnInfo.columnMapping.intCol,
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    padding: [0, 0, 10, 0]
                },
                min: (yMin - range * 0.2).toFixed(1),
                axisLabel: {
                    showMinLabel: false
                }
            },
            grid: {
                top:    60,
                bottom: heightAndBottom.bottom,
                left:   '10%',
                right:  '10%',
            }
        };
        return options
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