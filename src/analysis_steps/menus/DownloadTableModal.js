import React, {useEffect, useState} from "react";
import {Switch} from 'antd';
import globalConfig from "../../globalConfig";

export default function DownloadTableModal(props) {

    const [noImputed, setNoImputed] = useState(false)

    useEffect(() => {
        if(props.startDownload){
            downloadTable()
            props.setStartDownload(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const onChange = (checked) => {
        setNoImputed(checked)
    }

    const downloadTable = () => {
        const noImputedStr = noImputed ? '?noImputed=' + noImputed : ''
        fetch(globalConfig.urlBackend + 'analysis-step/table/' + props.stepId + noImputedStr)
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
                        checkedChildren="No Imputed"
                        unCheckedChildren="Original"
                        onChange={onChange}
                        defaultChecked={false}
                        disabled={!props.hasImputed}/> values
                </span>
            }
        </>
    );
}
