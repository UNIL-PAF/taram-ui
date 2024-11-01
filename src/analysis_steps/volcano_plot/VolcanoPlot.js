import React, {useEffect, useState, useRef, useCallback} from "react";
import {Button, Card, Row, Col, Spin, Typography} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import ReactECharts from 'echarts-for-react';
import StepComment from "../StepComment";
import {switchSel} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";
import EchartsZoom from "../EchartsZoom";
import {FullscreenOutlined} from "@ant-design/icons";
import {getStepTitle, replacePlotIfChanged, replaceProgressiveSeries, getStepResults} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"
import {useOnScreen} from "../../common/UseOnScreen";
import {defaultColors} from "../../common/PlotColors";

const {Text} = Typography;

export default function VolcanoPlot(props) {
    const type = 'volcano-plot'
    const dispatch = useDispatch();
    const [localParams, setLocalParams] = useState()
    const [isWaiting, setIsWaiting] = useState(true)
    const [options, setOptions] = useState()
    // to show the selected proteins before the reload
    const [selProts, setSelProts] = useState([])
    const [showZoom, setShowZoom] = useState(null)
    const [stepResults, setStepResults] = useState()
    const [count, setCount] = useState(1)
    const [showLoading, setShowLoading] = useState(false)
    const [showError, setShowError] = useState(false)

    const colPalette = {
/*        "down1": "#91cc75",
        "down2": "#5470c6",
        "up1": "#fac858",
        "up2": "#ee6666", */
        "up1": "#fac858",
        "up2": "#5470c6",
        "none": "silver"

    }

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
            const echartOptions = getOptions(stepResults, selProts)
            const withColors = {...echartOptions, color: defaultColors}
            setOptions({count: options ? options.count + 1 : 0, data: withColors})
            const optsToSave = replaceProgressiveSeries(withColors)
            replacePlotIfChanged(props.data.id, stepResults, optsToSave, dispatch)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selProts]
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
            const echartOptions = getOptions(stepResults, localParams.selProteins)
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
        let newOpts = {...options, color: Array(30).fill(greyCol)}
        newOpts.series.forEach((s, i) => {
            if (s.itemStyle) newOpts.series[i].itemStyle = {color: greyCol}
        })
        newOpts.series[0].markLine.lineStyle.color = greyCol
        return newOpts
    }

    const getOptions = (results, mySelProts) => {

        const params = JSON.parse(props.data.parameters)
        const qValExists = results.data[0].qVal !== undefined

        // we set the default selProts
        const defSelProts = (mySelProts ? mySelProts : params.selProteins)

        const dataWithLabel = results.data.filter(d => {
            return (params.useAdjustedPVal && qValExists) ? d.qVal : d.pVal
        }).map(d => {
            const showLab = defSelProts && defSelProts.includes(d.prot)
            return {...d, showLab: showLab, isUp: d.fc > 0, gene: (d.multiGenes ? d.gene + '*' : d.gene)}
        })

        const valueName = (params.useAdjustedPVal && qValExists) ? "adj. p-value" : "p-value"
        const xAxisName = params.log10PVal ? ("-log10(" + valueName + ")") : valueName
        const comparisonText = " (" + params.comparison.group1 + "/" + params.comparison.group2 + ")"

        const opts = {
            title: {
                text: params.comparison.group1 + " - " + params.comparison.group2,
                left: "center",
                textStyle: {fontSize: 14}
            },
            xAxis: [{
                name: (props.data.commonResult.intColIsLog ? "Log2 fold change" : "Fold change") + comparisonText,
                nameLocation: "center",
                nameTextStyle: {padding: [8, 4, 5, 6]},
            },
            ],
            yAxis: {
                min: 0,
                name: xAxisName,
                position: "left",
                nameRotate: 90,
                nameLocation: "center",
                nameTextStyle: {padding: [8, 4, 5, 6]},
            },
            tooltip: {
                showDelay: 0,
                formatter: function (myParams) {
                    if (myParams.componentType === "markLine") {
                        const text =
                            myParams.data.name + " threshold: " + (myParams.data.name.includes("Fold") ? myParams.data.value : params.pValThresh);
                        return text;
                    } else {
                        const other = myParams.data.other ? myParams.data.other.map(a => {
                            return a.name + ": <strong>" + a.value + "</strong><br>"
                        }) : ""

                        return "Gene: <strong>" + myParams.data.gene + "</strong><br>" +
                            "Protein AC: <strong>" + myParams.data.prot + "</strong><br>" +
                            "p-value: <strong>" + myParams.data.pVal.toPrecision(3) + "</strong><br>" +
                            (myParams.data.qVal ? "adj. p-value: <strong>" + myParams.data.qVal.toPrecision(3) + "</strong><br>" : "") +
                            "fold change: <strong>" + myParams.data.fc.toFixed(2) + "</strong><br>" + other

                    }
                },
            },
            dataset: [
                {
                    dimensions: ["fc", "plotVal", "isSign", "showLab", "qVal", "qIsSign", "isUp"],
                    source: dataWithLabel,
                },
                {
                    transform: [
                        {
                            type: 'filter',
                            config: {
                                dimension: (params.useAdjustedPVal && qValExists) ? 'qIsSign' : 'isSign',
                                value: true
                            }
                        }
                    ]
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: (params.useAdjustedPVal && qValExists) ? 'qIsSign' : 'isSign', value: false}
                    }
                },
                {
                    transform: {
                        type: 'filter',
                        config: {dimension: 'showLab', value: true}
                    }
                },
                {
                    transform: [
                        {
                            type: 'filter',
                            config: {dimension: 'qIsSign', value: true}
                        }
                    ],
                },

            ],
            legend: {
                top: "30px",
                data: [((params.useAdjustedPVal && qValExists) ? "adj. p-values" : "p-values") + " < " + params.pValThresh].concat((!params.useAdjustedPVal && params.showQVal && qValExists) ? ["adj. p-values < " + params.pValThresh] : [])
            },
            series: [
                {
                    name: ((params.useAdjustedPVal && qValExists) ? "adj. p-values" : "p-values") + " < " + params.pValThresh,
                    label: {
                        show: false,
                    },
                    symbolSize: 5,
                    datasetIndex: 1,
                    type: 'scatter',
                    encode: {
                        x: 'fc',
                        y: 'plotPVal'
                    },
                    itemStyle: {
                        color: (params.useAdjustedPVal && qValExists) ? colPalette["up2"] : colPalette["up1"],
                        opacity: 1.0
                    },
                    markLine: {
                        lineStyle: {
                            type: "dashed",
                            color: "#3ba272",
                        },
                        label: {show: false},
                        symbol: ["none", "none"],
                        data: [
                            {
                                xAxis: -1 * params.fcThresh,
                                name: "Fold change",
                            },
                            {
                                xAxis: params.fcThresh,
                                name: "Fold change",
                            },
                        ],
                    },
                },
                {
                    itemStyle: {
                        color: colPalette["none"]
                    },
                    label: {show: false},
                    symbolSize: 5,
                    datasetIndex: 2,
                    large: true,
                    largeThreshold: 1,
                    type: 'scatter',
                    encode: {
                        x: 'fc',
                        y: 'plotPVal'
                    }
                },
                {
                    label: {
                        show: true,
                        formatter: function (v) {
                            return v.data.gene ? v.data.gene : v.data.prot
                        },
                        position: 'right',
                        minMargin: 2,
                        //fontWeight: 'bold',
                        fontSize: 12,
                        color: 'black'

                    },
                    symbolSize: 8,
                    itemStyle: {
                        color: "rgba(0, 128, 0, 0)",
                        borderWidth: 1,
                        borderColor: 'green'
                    },
                    datasetIndex: 3,
                    type: 'scatter',
                },
            ]
        }

        const qValSeries = [
            {
                name: "adj. p-values < " + params.pValThresh,
                itemStyle: {
                    color: colPalette["up2"],
                    opacity: 1.0
                },
                label: {show: false},
                symbolSize: 5,
                datasetIndex: 4,
                type: 'scatter',
                encode: {
                    x: 'fc',
                    y: 'plotPVal'
                }
            },
        ]

        const finalOpts = {
            ...opts,
            series: ((!params.useAdjustedPVal && params.showQVal && qValExists) ? opts.series.concat(qValSeries) : opts.series)
        }

        return finalOpts
    }

    const showToolTipOnClick = useCallback((e) => {
            // don't do anything if the analysis is locked
            if (props.isLocked) return

            const prot = e.data.prot
            const protIndex = (selProts ? selProts.indexOf(prot) : -1)
            const newSelProts = protIndex > -1 ? selProts.filter(e => e !== prot) : selProts.concat(prot)

            setSelProts(newSelProts)
            setLocalParams({...localParams, selProteins: newSelProts})
            const callback = () => {
                setCount(count + 1)
            }
            dispatch(switchSel({resultId: props.resultId, selId: prot, stepId: props.data.id, callback: callback}))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selProts, count]
    );

    const onEvents = {
        click: showToolTipOnClick,
    };

    const showMultiGeneText = () => {
        const params = JSON.parse(props.data.parameters)
        const defSelProts = (selProts ? selProts : params.selProteins)
        const hasMultiGenes = stepResults.data.some( a => a.multiGenes && defSelProts.includes(a.prot))
        return <>
            {hasMultiGenes && <span style={{fontSize: 'x-small', paddingLeft: '20px'}}>* only the first of multiple gene names is displayed</span>}
        </>
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              ref={elementRef}
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
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              echartOptions={options ? options.data : null}
                              setStepParams={setLocalParams}
                              hasPlot={true}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
                              isLocked={props.isLocked}
                              resType={props.resType}
            />
        }>
            {props.data.status === 'done' && <Row>
                <Col span={12}></Col>
                <Col span={12}>
                    <div style={{textAlign: 'right'}}>
                        <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                                icon={<FullscreenOutlined/>}>Expand</Button>
                    </div>
                </Col>
            </Row>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
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
                                     paramType={type} stepId={props.data.id} onEvents={onEvents}
                                     minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}