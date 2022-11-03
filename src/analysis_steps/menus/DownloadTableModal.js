import React from "react";
import {Switch} from 'antd';
import globalConfig from "../../globalConfig";

export default function DownloadTableModal(props) {

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis/pdf/' + props.analysisId)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'analysis_' + props.analysisId + '.pdf';
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
                    <Switch checkedChildren="Imputed" unCheckedChildren="Original" defaultChecked={props.hasImputed} disabled={!props.hasImputed}/> values
                </span>
            }
        </>
    );
}
