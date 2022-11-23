import React, {useEffect, useState} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";

export default function BoxPlot(props) {
    const type = 'boxplot'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const dispatch = useDispatch();

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
        const params = JSON.parse(props.data.parameters)

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

        const boxplotDatasets = parsedRes.boxPlotData.map(d => {
            return {
                dimensions: boxplotDimensions,
                source: d.data
            }
        })

        const selProtSeries = parsedRes.selProtData ? parsedRes.selProtData.map(d => {
            return {
                name: d.gene ? d.gene : d.prot,
                type: 'line',
                data: d.ints
            }
        }) : null

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

        const options = {
            dataset: boxplotDatasets,
            series: boxplotSeries.concat(selProtSeries),
            legend: {},
            xAxis: parsedRes.boxPlotData.map((d, i) => {
                return {
                    type: 'category',
                    scale: true,
                    axisLabel: {interval: 0, rotate: 50},
                    show: (i === 0 ? true : false),
                    data: parsedRes.experimentNames,
                    axisLine: { onZero: false }
                }
            }),
            yAxis: {
                name: params.column || props.data.columnInfo.columnMapping.intCol,
                nameTextStyle: {align: 'left'},
                nameGap: 20
            }
        };

        return options
    }

    return (
        <Card className={'analysis-step-card'} title={props.data.nr + " - Boxplot"} headStyle={{textAlign: 'left'}}
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
            />
        }>
            {props.data.status === 'done' && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='default' onClick={() => setShowZoom(true)} icon={<FullscreenOutlined />}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.data && options.data.series.length > 0 && <ReactECharts key={options.count} option={options.data}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data} paramType={type} stepId={props.data.id}></EchartsZoom>}
        </Card>
    );
}