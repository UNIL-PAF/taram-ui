import React, {useEffect, useState} from "react";
import {Checkbox, Space} from "antd";
import globalConfig from "../../globalConfig";
import {useDispatch} from "react-redux";
import {setError} from "../../analysis/analysisSlice";

export default function DownloadZipModal(props) {
    const [svg, setSvg] = useState(undefined)
    const [png, setPng] = useState(undefined)
    const [table, setTable] = useState(undefined)
    const [notImputed, setNotImputed] = useState(false)
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
            }
            setTable(props.tableNr ? true : false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, svg])

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis-step/zip/' + props.stepId
            + '?svg=' + svg
            + '&png=' + png
            + '&table=' + table
            + '&notImputed=' + notImputed
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
                //window.location.href = response.url;
            });
    }

    return (
        <>
            <h3>Download ZIP file</h3>
            <Space direction={'vertical'}>
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
                    disabled={typeof props.tableNr === "undefined"}
                    defaultChecked={props.tableNr ? true : false}
                    onChange={(val) => setTable(val.target.checked)}>Table {props.tableNr &&<em>M{props.tableNr}</em>}
                </Checkbox>
                {props.tableNr && props.hasImputed && <Checkbox
                    defaultChecked={false}
                    onChange={(val) => setNotImputed(val.target.checked)}>Table <em>M{props.tableNr}</em> without imputed values
                </Checkbox>}
            </Space>
        </>
    );
}
