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
import getOptionsV1 from "./ScatterPlotVersion1";
import getOptionsV2 from "./ScatterPlotVersion2";

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
            const optionFun = props.data.version === "2.0" ? getOptionsV2 : getOptionsV1
            const echartOptions = optionFun(stepResults, newParams, selProts, logTrans, showRegrLine, showXYLine)
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
            const optionFun = props.data.version === "2.0" ? getOptionsV2 : getOptionsV1
            const echartOptions = optionFun(stepResults, localParams, selProts, logTrans, showRegrLine, showXYLine)
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

    const showToolTipOnClick = useCallback((e) => {
            // don't do anything if the analysis is locked
            if (props.isLocked) return

            const prot = e.data[3]
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

    const showMultiGeneText = () => {
        return <>
                <span style={{fontSize: 'x-small', paddingLeft: '20px'}}>* only the first of multiple gene names is displayed</span>
        </>
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
            {stepResults  && showMultiGeneText()}
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId}
                         comment={props.data.comments}></StepComment>
            {options && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={options.data}
                                     onEvents={onEvents}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}