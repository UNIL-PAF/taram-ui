import React, {useEffect, useState} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";

export default function PcaPlot(props) {
    const type = 'pca'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.data) {
            const params = JSON.parse(props.data.parameters)
            setLocalParams(params)

            if (isWaiting && props.data.status === 'done') {
                const results = JSON.parse(props.data.results)
                const echartOptions = getOptions(results)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                replacePlotIfChanged(props.data.id, results, echartOptions, dispatch)
                setOptions({count: options ? options.count + 1 : 0, data: echartOptions})
                setIsWaiting(false)
                console.log(results)
            }

            if (!isWaiting && props.data.status !== 'done') {
                setIsWaiting(true)
                const greyOpt = {...options.data, color: Array(30).fill('lightgrey')}
                setOptions({count: options ? options.count + 1 : 0, data: greyOpt})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, isWaiting])

    const getOptions = (results) => {
        const params = JSON.parse(props.data.parameters)
        const xAxisPc = 0
        const yAxisPc = 1

        console.log(results)
        /*
        const series = results.groups.map(g => {
            console.log(g)
            console.log(g.pcList[xAxisPc].pcVals)
            return {
                data: g.pcList[xAxisPc].pcVals.map((l, i) => { return [l, g.pcList[yAxisPc].pcVals[i]]}),
                type: 'scatter'
            }
        })
        console.log(series)

         */
        const mySource = results.pcList.map(p => {return [p.expName, p.groupName, p.pcVals[xAxisPc], p.pcVals[yAxisPc]]})
        console.log(mySource)

        const options = {
            dataset: [
                {
                    dimensions: ["expName", "group", "x", "y"],
                    source: results.pcList.map(p => {return [p.expName, p.groupName, p.pcVals[xAxisPc], p.pcVals[yAxisPc]]}),
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'group', value: "KO"}
                    }
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'group', value: "WT"}
                    }
                },
            ],
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
            series: [
                {
                    datasetIndex: 1,
                    type: 'scatter',
                    encode: {
                        x: 'x',
                        y: 'y'
                    }
                },
                {
                    datasetIndex: 2,
                    type: 'scatter',
                    encode: {
                        x: 'x',
                        y: 'y'
                    }
                },
            ]
        };

        return options
    }

    return (
        <Card className={'analysis-step-card'} title={props.data.nr + " - PCA"} headStyle={{textAlign: 'left'}}
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
            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     paramType={type} stepId={props.data.id}></EchartsZoom>}
        </Card>
    );
}