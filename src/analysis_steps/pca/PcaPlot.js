import React, {useEffect, useState} from "react";
import {Button, Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import {useDispatch} from "react-redux";
import {getStepTitle, replacePlotIfChanged} from "../CommonStepUtils";
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

    const getOptions = (results) => {
        const xAxisPc = 0
        const yAxisPc = 1

        const transforms = results.groups.map((g) => {
            return {transform: {type: 'filter', config: {dimension: 'group', value: g}}}
        })

        const series = results.groups.map((g, i) => {
            return  {
                name: g,
                datasetIndex: (i + 1),
                type: 'scatter',
                encode: {
                    x: 'x',
                    y: 'y'
                }
            }
        })

        const options = {
            dataset: [
                {
                    dimensions: ["expName", "group", "x", "y"],
                    source: results.pcList.map(p => {
                        return [p.expName, p.groupName, p.pcVals[xAxisPc], p.pcVals[yAxisPc]]
                    }),
                }
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

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, "PCA", props.data.nrProteinGroups, props.data.status === 'done')}
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
                <Button size={'small'} type='default' onClick={() => setShowZoom(true)}
                        icon={<FullscreenOutlined/>}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.data && options.data.series.length > 0 &&
                <ReactECharts key={options.count} option={options.data}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}