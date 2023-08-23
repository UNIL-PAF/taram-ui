import React from "react";
import {Modal} from "antd";
import '../analysis/analysis.css'
import ReactECharts from "echarts-for-react";

export default function EchartsZoom(props) {

    const showZoomModal = () => {
        return <>
            {props.echartsOptions &&
                <div style={{height: '100%'}}>
                    <ReactECharts
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
            {showZoomModal()}
        </Modal>
    );
}
