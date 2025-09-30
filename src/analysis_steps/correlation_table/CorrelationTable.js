import React, {useState, useRef, useEffect} from "react";
import {Card, Col, Row} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle, getTable, getTableCol} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"
import EchartsZoom from "../EchartsZoom";
import ReactECharts from "echarts-for-react";

export default function CorrelationTable(props) {
    const type = "correlation-table"
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const [options, setOptions] = useState(params)
    const [showZoom, setShowZoom] = useState(null)
    const [chartInstance, setChartInstance] = useState(null)
    const myChart = useRef(null);

    const results = JSON.parse(props.data.results)

    const [showTable, setShowTable] = useState(false)
    const isDone = props.data.status === "done"

    useEffect(() => {
        const handleResize = () => {

            setTimeout(() => {
                addChartLabels()
            }, 500)


        };

        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        if(myChart.current){
            setChartInstance(myChart.current.getEchartsInstance())
        }
    });

    const corrTypeNames = (name) => {
        return (name === "pearson" ? "Pearson" : "Spearman")
    }

    const computeOptions = () => {

        const xData = results.experimentNames.map(n => {
            return {
                value: n
            }
        })

        const yData = [...xData]

        const data = results.correlationMatrix.map(row => {
            return [results.experimentNames[row.x], results.experimentNames[row.y], row.v]
        })

        const minVal = Math.min(...results.correlationMatrix.map(item => item.v))

        const axisElementsX = results.experimentNames.map((n, i) => {
            return [i, 0, n, "x", results.colors ? results.colors[i] : null, results.groupNames ? results.groupNames[i] : null]
        })

        const axisElementsY = results.experimentNames.map((n, i) => {
            return [0, i, n, "y", results.colors ? results.colors[i] : null, results.groupNames ? results.groupNames[i] : null]
        })

        const myOption = {
            legend: {
                orient: 'horizontal',
                left: 'center',
                bottom: 10,
                data: results.groupsAndColors && results.groupsAndColors.map(a => a.group),
                selectedMode: false
            },

            matrix: {
                x: {
                    data: xData,
                    show: false
                },
                y: {
                    data: yData,
                    show: false
                },
                top: 110,
                left: 80
            },
            visualMap: {
                type: 'continuous',
                min: minVal,
                max: 1,
                dimension: 2,
                calculable: true,
                orient: 'horizontal',
                top: 5,
                left: 'center',
                formatter: (value) => value.toFixed(2),
            },
            tooltip: {
                position: 'top',
                formatter: function (x) {
                    return "x: <strong>" + x.value[0] + "</strong><br>y: <strong>" + x.value[1] + "</strong><br>R2: <strong>" + x.value[2].toFixed(2) + "</strong>"
                }
            },
            series: [{
                type: 'heatmap',
                coordinateSystem: 'matrix',
                data,
                label: {
                    show: false,
                    formatter: (params) => params.value[2].toFixed(2)
                }
            }].concat(results.groupsAndColors ? results.groupsAndColors.map( g => {
                return {
                    name: g.group,
                    type: 'heatmap', // must use a type compatible with 'matrix'
                    coordinateSystem: 'matrix',
                    data: [], // empty data
                    itemStyle: {color: g.color}
                }
            }) : [])
        };
        return {
            x: axisElementsX,
            y: axisElementsY,
            options: myOption
        }
    }

    const myOh = results ? computeOptions() : null


    function shortenString(s) {
        return s.length > 10 ? s.slice(0, 10) + ".." : s;
    }

    const addChartLabels = () => {
        setTimeout(function () {
            const elements = myOh.x.concat(myOh.y).map((row) => {
                const center = chartInstance.convertToPixel(
                    {
                        matrixIndex: 0
                    },
                    row.slice(0, 2)
                );

                const left = chartInstance.convertToPixel(
                    {
                        matrixIndex: 0
                    },
                    [0,0]
                );

                const cellWidth = (chartInstance.convertToPixel(
                    {
                        matrixIndex: 0
                    },
                    [1,0]
                )[0] - left[0]) / 2

                const cellHeight = (chartInstance.convertToPixel(
                    {
                        matrixIndex: 0
                    },
                    [0,1]
                )[1] - left[1]) / 2


                return {
                    type: 'text',
                    style: {
                        text: shortenString(row[2]),
                        fill: row[4] || '#333',
                        font: '12px sans-serif',
                        textAlign: row[3] === 'x' ? 'left' : "right",
                        textVerticalAlign: 'middle',
                    },
                    x: row[3] === 'x' ? center[0] - cellWidth  : left[0] - cellWidth - 5,
                    y: center[1] + (row[3] === 'x' ? - cellHeight - 5 : 0),
                    rotation: row[3] === "x" ? (Math.PI / 7) : 0,

                    tooltip: {
                        show: true,
                        position: 'right',
                        formatter: () => {
                            return row[2] + "<br>" + row[5]
                        }
                    }

                };
            });

            chartInstance.setOption({
                graphic: {
                    elements: [
                        {
                            type: 'text',
                            left: 'center',
                            top: 5,
                            style: {
                                text: corrTypeNames(localParams.correlationType) + ' R2',
                                font: 'bold 12px sans-serif',
                                fill: '#333'
                            },
                            rotation: 0
                        },

                    ].concat(elements)
                },
            });
        });
    }


    if(chartInstance){
        addChartLabels()
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={getStepTitle(props.data.nr, typeToName(type))}
              headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              key={props.data.id + "-" + props.data.nextId ? props.data.nextId : ""}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={type}
                              commonResBefore={props.commonResBefore}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              tableNr={props.data.nr}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
                              isLocked={props.isLocked}
                              resType={props.resType}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row className={"analysis-step-row"}>
                    <Col span={8}>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                    </Col>
                    {isDone && getTableCol(props.data.nrProteinGroups, props.data.nr, setShowTable)}
                </Row>
            }
            { myOh &&
                <ReactECharts ref={myChart} option={myOh.options} style={{
                    height: "400px",
                    width: '100%',
                }}/>}
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {showTable && getTable(props.data.id, props.data.nr, setShowTable)}

        </Card>
    );
}