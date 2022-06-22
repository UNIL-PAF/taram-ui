import React, {useState} from "react";
import axios from "axios";
import globalConfig from "../globalConfig";
import {Button, Menu, Modal, Popconfirm} from "antd";
import {deleteAnalysis} from "../analysis/BackendAnalysis";

export default function AnalysisMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const clickDuplicate = () => {
        axios.post(globalConfig.urlBackend + "analysis/duplicate/" + props.analysisId)
    }

    const clickCopy = () => {
        axios.post(globalConfig.urlBackend + "analysis/copy/" + props.analysisId)
    }

    const downloadPdf = () => {
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

    const loadTemplate = (templateId) => {
        console.log("run template", templateId)
    }

    const closeMenu = () => {
        console.log("close menu")
        props.setMenuIsVisible(false)
    }

    return (
        <div align={"right"}>
            <Button onClick={() => closeMenu()}>Close</Button>
            <Menu selectable={false} onClick={() => closeMenu()} >
                <Menu.Item onClick={() => downloadPdf()}
                           key={'pdf'}
                >
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
                <Menu.Item onClick={() => setIsModalVisible(true)}
                           key={'save-template'}>
                    <span>Save analysis as template</span>
                </Menu.Item>
                <Menu.Divider key={'divider-3'}></Menu.Divider>
                <Menu.Item key={'delete-analysis'} danger={true}>
                    <Popconfirm
                        title="Are you sure you want to delete this analysis?"
                        onConfirm={() => deleteAnalysis()}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <span>Delete analysis</span>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
            <Modal title="Save analysis as template" visible={isModalVisible} onOk={() => handleModalOk()}
                   onCancel={() => handleModalCancel()} width={1000}
            >
                <span>Template name</span>
            </Modal>
        </div>


    );
}
