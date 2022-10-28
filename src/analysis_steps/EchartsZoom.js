import React from "react";
import {Modal} from "antd";
import '../analysis/analysis.css'
import ReactECharts from "echarts-for-react";

export default function EchartsZoom(props) {

    const showZoomModal = () => {
        return <>
            {props.echartsOptions &&
                <div>
                    <ReactECharts
                        option={{
                            ...props.echartsOptions, toolbox: {
                                feature: {
                                    dataZoom: {},
                                    saveAsImage: {
                                        name: props.paramType + "_" + props.stepId
                                    }
                                }
                            }
                        }}
                        style={{
                            height: '500px',
                            width: '100%',
                        }}
                    />
                </div>}
        </>
    }

    return (
        <Modal visible={props.showZoom} title="Plot" onCancel={() => props.setShowZoom(false)}
               width={"95%"} height={"95%"} footer={null}
        >
            {showZoomModal()}
        </Modal>
    );
}
