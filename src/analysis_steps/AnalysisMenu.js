import React from "react";
import axios from "axios";
import globalConfig from "../globalConfig";
import {Menu, Popconfirm} from "antd";
import {deleteAnalysis} from "../analysis/BackendAnalysis";

export default function AnalysisMenu(props) {

    const clickDuplicate = () => {
        axios.post(globalConfig.urlBackend + "analysis/duplicate/" + props.data.id)
    }

    const clickCopy = () => {
        axios.post(globalConfig.urlBackend + "analysis/copy/" + props.data.id)
    }

    const downloadPdf = (analysisId) => {
        fetch(globalConfig.urlBackend + 'analysis/pdf/' + analysisId)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'analysis_' + analysisId + '.pdf';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    const saveTemplate = (analysisId) => {
        console.log("save template", analysisId)
    }

    const loadTemplate = (templateId) => {
        console.log("run template", templateId)
    }

    return (
        <>
            <Menu selectable={false}>
                <Menu.Item onClick={() => downloadPdf(props.analysisId)}
                           key={'pdf'}>
                    <span>Download PDF</span>
                </Menu.Item>
                <Menu.Divider key={'divider-1'}></Menu.Divider>
                <Menu.Item onClick={() => clickDuplicate()}
                           key={'copy-current'}>
                    <span>Create a copy of analysis</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickCopy()}
                           key={'start-new'}>
                    <span>Start new a new analysis</span>
                </Menu.Item>
                <Menu.Divider key={'divider-2'}></Menu.Divider>
                <Menu.Item onClick={() => loadTemplate(99)}
                           key={'load-template'}>
                    <span>Run analysis from template</span>
                </Menu.Item>
                <Menu.Item onClick={() => saveTemplate(props.analysisId)}
                           key={'save-template'}>
                    <span>Save analysis as template</span>
                </Menu.Item>
                <Menu.Divider key={'divider-3'}></Menu.Divider>
                <Menu.Item key={'delete-analysis'} danger={true}>
                    <Popconfirm
                        title="Are you sure you want to delete this analysis?"
                        onConfirm={() => deleteAnalysis(props.analysisId)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <span>Delete analysis</span>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        </>


    );
}
