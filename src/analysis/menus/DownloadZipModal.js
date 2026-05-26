import React, {useEffect, useState} from "react";
import {Checkbox, Modal, Space, Slider} from "antd";
import globalConfig from "../../globalConfig";
import {useDispatch} from "react-redux";
import {setError} from "../analysisSlice";

export default function DownloadZipModal(props) {
    const [svg, setSvg] = useState(undefined)
    const [html, setHtml] = useState(undefined)
    const [png, setPng] = useState(undefined)
    const [zoom, setZoom] = useState(4)
    const dispatch = useDispatch();

    useEffect(() => {
        if(props.startDownload){
            downloadTable()
            props.setStartDownload(false)
        }
        if (typeof svg == "undefined") {
            if(props.hasPlot){
                setSvg(true)
                setPng(true)
                setHtml(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, svg])

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis-step/zip/' + props.stepId
            + '?svg=' + svg
            + '&png=' + png
            + '&html=' + html
            + '&zoom=' + zoom
        )
            .then(response => {
                response.blob().then(blob => {
                    if(blob.size === 0){
                        dispatch(setError("An error occurred while creating ZIP file."))
                    }else{
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download =  props.stepId + "-" + props.type + '.zip';
                        a.click();
                    }
                });
            });
    }

    return (
        <Modal title={"Download ZIP"} onOk={() => props.handleOk()}
               onCancel={() => props.handleCancel()}
               width={500}
               open={true}
        >
            <h3>Download ZIP file</h3>
            <Space direction={'vertical'} style={{width:'100%'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Zoom</span>
                    <Slider
                        min={1}
                        max={10}
                        onChange={a => setZoom(a)}
                        value={zoom}
                        style={{ flex: 1 }}
                    />
                </div>

                <Checkbox
                    disabled={!props.hasPlot}
                    defaultChecked={props.hasPlot}
                    onChange={(val) => setSvg(val.target.checked)}>SVG plot
                </Checkbox>
                <Checkbox
                    disabled={!props.hasPlot}
                    defaultChecked={props.hasPlot}
                    onChange={(val) => setPng(val.target.checked)}>PNG plot
                </Checkbox>
                <Checkbox
                    disabled={!props.hasPlot}
                    defaultChecked={props.hasPlot}
                    onChange={(val) => setHtml(val.target.checked)}>HTML plot
                </Checkbox>
            </Space>
        </Modal>
    );
}
