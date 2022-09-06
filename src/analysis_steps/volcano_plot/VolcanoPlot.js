import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import VolcanoPlotParams from "./VolcanoPlotParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import {replacePlotIfChanged} from "../CommonStep";
import StepComment from "../StepComment";

export default function VolcanoPlot(props) {

    const [selCol, setSelCol] = useState()
    const [logScale, setLogScale] = useState(false)
    const [options, setOptions] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.data.parameters) {
            const params = JSON.parse(props.data.parameters)
            setSelCol(params.column)
            setLogScale(params.logScale)
        } else {
            setSelCol(props.data.commonResult.intCol)
        }

        if(props.data.results) setOptions(getOptions())
    }, [props])

    const getOptions = () => {
        const results = JSON.parse(props.data.results)
        console.log(results)
        return null
    }

    console.log(options)
    console.log(JSON.parse(props.data.results))

    const onClickOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.data.id,
            params: {column: selCol, logScale: logScale}
        }))
    }

    return (
        <Card className={'analysis-step-card'} title={"Volcano plot"} headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                              onClickOk={onClickOk} error={props.data.error}
                              paramComponent={<VolcanoPlotParams analysisIdx={props.analysisIdx}
                                                         data={props.data} setSelCol={setSelCol}
                                                         selCol={selCol} setLogScale={setLogScale}
                                                         logScale={logScale}></VolcanoPlotParams>}/>
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {options && options.series.length > 0 && <ReactECharts option={options}/>}
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}