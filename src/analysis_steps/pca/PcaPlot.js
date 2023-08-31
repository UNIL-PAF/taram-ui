import React, {useEffect, useState} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepTitle, replacePlotIfChanged} from "../CommonStepUtils";
import StepComment from "../StepComment";
import {FullscreenOutlined} from "@ant-design/icons";
import EchartsZoom from "../EchartsZoom";
import {typeToName} from "../TypeNameMapping"
import {switchSel} from "../BackendAnalysisSteps";

export default function PcaPlot(props) {
    const type = 'pca'
    const [localParams, setLocalParams] = useState()
    const [options, setOptions] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [showZoom, setShowZoom] = useState(null)
    const [onEvents, setOnEvents] = useState()
    const [selExps, setSelExps] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        setOnEvents({'click': showToolTipOnClick})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selExps])

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

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
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