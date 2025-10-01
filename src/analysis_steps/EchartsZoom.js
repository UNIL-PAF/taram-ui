import React, {useState, useEffect, useRef} from "react";
import {Modal} from "antd";
import '../analysis/analysis.css'
import ReactECharts from "echarts-for-react";

export default function EchartsZoom(props) {

    const [myTimeout, setMyTimeout] = useState(true)
    const myChart = useRef(null);

    useEffect(() => {
        if(props.showZoom && myTimeout && props.echartsOptions){
            setTimeout(() => {
                setMyTimeout(false)
            }, 100)
        }
    }, [props, myTimeout])

    useEffect(() => {
        if(props.postRendering && myChart.current){
            props.postRendering(myChart.current.getEchartsInstance())
        }
    });

    const showZoomModal = () => {
        return <>
            {props.echartsOptions &&
                <div style={{height: '100%'}}>
                    <ReactECharts
                        ref={myChart}
                        onEvents={props.onEvents}
                        option={{
                            ...props.echartsOptions, toolbox: {
                                right: 40,
                                feature: {
                                    dataZoom: {},
                                    saveAsImage: {
                                        name: props.paramType + "_" + props.stepId
                                    }
                                }
                            }
                        }}
                        style={{
                            height: props.minHeight ? props.minHeight : '100%',
                            width: '100%',
                        }}
                    />
                </div>}
        </>
    }

    return (
        <Modal open={props.showZoom} title="Plot" onCancel={() => props.setShowZoom(false)}
               width={"95%"} height={"100%"} footer={null}
        >
            {!myTimeout && showZoomModal()}
        </Modal>
    );
}
