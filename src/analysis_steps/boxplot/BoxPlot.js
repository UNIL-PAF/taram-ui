import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepTitle, replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {setStepParametersWithoutRunning} from "../BackendAnalysisSteps"

export default function BoxPlot(props) {
    const type = 'boxplot'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if(localParams && props.data && props.data.status === 'done'){
            const echartOptions = getOptions(JSON.parse(props.data.results))
            setOptions({...options, data: echartOptions})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localParams])

    useEffect(() => {
        if (props.data) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)

            if (isWaiting && props.data.status === 'done'){
                const results = JSON.parse(props.data.results)
                const echartOptions = getOptions(results)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                setIsWaiting(false)
            }

            if(! isWaiting && props.data.status !== 'done'){
                setIsWaiting(true)
                const greyOpt = {...options.data, color:  Array(30).fill('lightgrey')}
                setOptions({count: options ? options.count + 1 : 0, data: greyOpt} )
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, isWaiting])

    const getOptions = (results) => {
        const params = localParams || JSON.parse(props.data.parameters)

        const newData = results.boxPlotData.map(d => {
            const dataWithName = d.groupData.map(box => {
                return [box.name].concat(box.data)
            })
            return {
                group: d.group ? d.group : null,
                data: dataWithName
            }
        })

        results.boxPlotData = newData

        const boxplotDimensions = ['name', 'min', 'Q1', 'median', 'Q3', 'max']

        const parsedRes = results

        const [yMin, yMax] = parsedRes.boxPlotData.reduce( (a, v) => {
            const myMin = Math.min.apply(Math, v.data.map(x => x[1]))
            const myMax = Math.max.apply(Math, v.data.map(x => x[5]))
            if(typeof a[0] === "undefined" || a[0] < myMin) a[0] = myMin
            if(typeof a[1] === "undefined" || a[1] > myMax) a[1] = myMax
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
                name: d.group,
                type: type,
                datasetIndex: i,
                encode: {
                    y: boxplotDimensions.slice(1),
                    x: 'name',
                },
                xAxisIndex: i
            }
        })

        const groupByCondition = parsedRes.boxPlotData.reduce(
            (acc, curr) => acc.concat(curr.data.map(d => d[0])),
            []
        );

        const sortByCondition = (groupByCondition) => {
            const sortArr = parsedRes.experimentNames.map((n, i) => {
                return groupByCondition.indexOf(n)
            })

            return parsedRes.selProtData.map(p => {
                let newInts = sortArr.map(sortIdx => p.ints[sortIdx])
                return {...p, ints: newInts}
            })
        }

        const experimentNames = params.groupByCondition ? groupByCondition : parsedRes.experimentNames

        const selProtSeries = (groupByCondition) => {
            if (!parsedRes.selProtData) return null
            const mySel = params.groupByCondition ? sortByCondition(groupByCondition) : parsedRes.selProtData

            return mySel.map(d => {
                return {
                    name: d.gene ? d.gene : d.prot,
                    type: 'line',
                    data: d.ints
                }
            })
        }

        const options = {
            dataset: boxplotDatasets,
            series: parsedRes.selProtData ? boxplotSeries.concat(selProtSeries(groupByCondition)) : boxplotSeries,
            legend: {},
            xAxis: parsedRes.boxPlotData.map((d, i) => {
                return {
                    type: 'category',
                    scale: true,
                    axisLabel: {interval: 0, rotate: 50 },
                    show: (i === 0 ? true : false),
                    data: experimentNames,
                    axisLine: { onZero: false}
                }
            }),
            yAxis: {
                name: params.column || props.data.columnInfo.columnMapping.intCol,
                nameTextStyle: {
                    align: 'left',
                    padding: [0, 0, 0, -50]
                },
                nameGap: 20,
                min: (yMin - range * 0.2).toFixed(1),
                axisLabel: {showMinLabel: false}
            }
        };

        return options
    }

    const checkboxChange = (e) => {
        const newLocalParams = {...localParams, groupByCondition: e.target.checked}
        setStepParametersWithoutRunning({stepId: props.data.id, params: newLocalParams})
        setLocalParams(newLocalParams)
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, "Boxplot", props.data.nrProteinGroups, props.data.status === 'done')}
              headStyle={{textAlign: 'left'}}
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
            />
        }>
            {props.data.status === 'done' && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='default' onClick={() => setShowZoom(true)} icon={<FullscreenOutlined />}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            <Checkbox
                className={"analysis-step-row"}
                onChange={checkboxChange} checked={localParams && localParams.groupByCondition}>Group by condition
            </Checkbox>
            {options && options.data && options.data.series.length > 0 && <ReactECharts key={options.count} option={options.data}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data} paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}