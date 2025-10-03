import React, {useState} from "react";
import {Button, Card, Col, Row} from "antd";
import AnalysisStepMenu from "../../analysis/menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {getStepTitle} from "../CommonStepUtils";
import {typeToName} from "../TypeNameMapping"
import EchartsZoom from "../EchartsZoom";
import ReactECharts from "echarts-for-react";
import {FullscreenOutlined} from "@ant-design/icons";

export default function CorrelationTable(props) {
    const type = "correlation-table"
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const [showZoom, setShowZoom] = useState(null)

    const results = JSON.parse(props.data.results)
    const isDone = props.data.status === "done"

    const corrTypeNames = (name) => {
        return (name === "pearson" ? "Pearson" : "Spearman")
    }

    const computeOptions = () => {
        const data = results.correlationMatrix.map(row => {
            return [
                results.experimentNames[row.x],
                results.experimentNames[row.y],
                row.v,
                (results.groupNames ? (" (" + results.groupNames[row.x] + ")") : ""),
                (results.groupNames ? (" (" + results.groupNames[row.y] + ")") : ""),
                (results.colors ? (results.colors[row.x]) : "#6f6f6f"),
                (results.colors ? (results.colors[row.y]) : "#6f6f6f"),
            ]
        })

        const minVal = Math.min(...results.correlationMatrix.map(item => item.v))

        const myOption = {

            graphic: {
                elements: [
                    {
                        type: 'text',
                        top: 65,
                        left: "25%",
                        style: {
                            text: corrTypeNames(localParams.correlationType) + " R2",
                            font: 'bold 12px sans-serif',
                            fill: '#333'
                        }
                    },
                ]},
            legend: {
                orient: 'horizontal',
                left:'center',
                top: 10,
                data: results.groupsAndColors && results.groupsAndColors.map(a => a.group),
                selectedMode: false
            },
            xAxis: {
                type: 'category',
                data: results.experimentNames,
                axisLabel: {
                    interval: 0,
                    rotate: 50,
                    color: function (_, i) {
                        return results.colors ? results.colors[i] : "black"
                    },
                },
            },
            yAxis: {
                type: 'category',
                data: results.experimentNames,
                axisLabel: {
                    interval: 0,
                    color: function (_, i) {
                        return results.colors ? results.colors[i] : "black"
                    },
                },
            },

            visualMap: {
                type: 'continuous',
                min: minVal,
                max: 1,
                dimension: 2,
                calculable: true,
                orient: 'horizontal',
                top: 65,
                left: "20%",
                formatter: (value) => value.toFixed(2),
            },

            tooltip: {
                position: 'top',
                formatter: function (params) {
                    return `x: <strong>${params.value[0]}</strong><span style="color:${params.value[5]};">${params.value[3]}</span><br>` +
                        `y: <strong>${params.value[1]}</strong><span style="color:${params.value[6]};">${params.value[4]}</span><br>`+
                        `R2: <strong>${params.value[2].toFixed(2)}</strong>`
                }
            },
            series: [{
                type: 'heatmap',
                data,
                label: {
                    show: false,
                    formatter: (params) => params.value[2].toFixed(2)
                }
            }].concat(results.groupsAndColors ? results.groupsAndColors.map( g => {
                return {
                    name: g.group,
                    type: 'heatmap',
                    data: [], // empty data
                    itemStyle: {color: g.color}
                }
            }) : [])
        };

        return myOption
    }

    const myOh = results ? computeOptions() : null

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
            {isDone && myOh && <div style={{textAlign: 'right'}}>
                <Button size={'small'} type='primary' onClick={() => setShowZoom(true)}
                        icon={<FullscreenOutlined/>}>Expand</Button>
            </div>}
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <Row className={"analysis-step-row"}>
                    <Col span={8}>
                    </Col>
                    <Col span={8} className={"analysis-step-middle-col"}>
                    </Col>
                </Row>
            }
            { isDone && myOh &&
                <ReactECharts option={myOh} style={{
                    height: "400px",
                    width: '100%',
                }}/>}
            <StepComment isLocked={props.isLocked} stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
            {isDone && myOh && <EchartsZoom showZoom={showZoom} setShowZoom={setShowZoom} echartsOptions={myOh}
                                     paramType={type} stepId={props.data.id} minHeight={"800px"}></EchartsZoom>}
        </Card>
    );
}