import React, {useEffect, useState} from "react";
import {Switch} from 'antd';
import globalConfig from "../../globalConfig";

export default function DownloadTableModal(props) {

    const [imputed, setImputed] = useState()

    useEffect(() => {
        if(props.startDownload){
            downloadTable()
            props.setStartDownload(false)
        }
        if(props && typeof(imputed) == "undefined"){
            setImputed(props.hasImputed)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, imputed])

    const onChange = (checked) => {
        setImputed(checked)
    }

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis-step/table/' + props.stepId + '?imputed=' + imputed)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'M' + props.tableNr + '.txt';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    return (
        <>
            <h3>Table M{props.tableNr}</h3>
            { props.tableNr &&
                <span>
                    <Switch
                        checkedChildren="Imputed"
                        unCheckedChildren="Original"
                        onChange={onChange}
                        defaultChecked={props.hasImputed}
                        disabled={!props.hasImputed}/> values
                </span>
            }
        </>
    );
}
