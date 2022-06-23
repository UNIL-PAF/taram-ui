import React, {useEffect, useState} from "react";
import globalConfig from "../globalConfig";
import {Alert, Button, Col, Input, Menu, message, Modal, Popconfirm, Row, Tooltip} from "antd";
import {copyAnalysis, deleteAnalysis, duplicateAnalysis} from "../analysis/BackendAnalysis";
import {useDispatch, useSelector} from "react-redux";
import {addTemplate, fetchAllTemplates} from "../templates/BackendTemplates";
import '../analysis/analysis.css'
import {CloseOutlined} from "@ant-design/icons";

export default function AnalysisMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nameText, setNameText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const dispatch = useDispatch();

    const templatesData = useSelector(state => state.templates.data)
    const templatesStatus = useSelector(state => state.templates.status)
    const templatesError = useSelector(state => state.templates.error)

    useEffect(() => {
        if (templatesStatus === 'idle') {
            dispatch(fetchAllTemplates())
            message.config({top: 60})
        }
    }, [templatesStatus, templatesData, dispatch])

    const handleModalOk = () => {
        dispatch(addTemplate({analysisId: props.analysisId, name: nameText, description: descriptionText}))
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const clickDelete = () => {
        dispatch(deleteAnalysis({analysisId: props.analysisId, resultsId: props.resultsId}))
    }

    const clickDuplicate = () => {
        dispatch(duplicateAnalysis({analysisId: props.analysisId, resultsId: props.resultsId}))
    }

    const clickCopy = () => {
        dispatch(copyAnalysis({analysisId: props.analysisId, resultsId: props.resultsId}))
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
        props.setMenuIsVisible(false)
    }

    return (
        <div align={"right"} className={"analysis-menu"}>
            {templatesError && <Alert
                message="Error"
                description={templatesError}
                type="error"
                showIcon
                closable
            />}
            <Button onClick={() => closeMenu()} type={"text"} icon={<CloseOutlined/>}></Button>
            <Menu selectable={false} onClick={() => closeMenu()}>
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
                <Menu.SubMenu key={"sub-1"} title={"Run analysis from template"}>
                    {templatesData && templatesData.map(t =>
                        <Menu.Item
                            key={t.id}
                            onClick={() => loadTemplate(t.id)}>
                            <Tooltip title={t.description} placement={"right"}>
                                <span>{t.name}</span>
                            </Tooltip>
                        </Menu.Item>)}
                </Menu.SubMenu>
                <Menu.Item onClick={() => setIsModalVisible(true)}
                           key={'save-template'}>
                    <span>Save analysis as template</span>
                </Menu.Item>
                <Menu.Divider key={'divider-3'}></Menu.Divider>
                <Menu.Item key={'delete-analysis'} danger={true}>
                    <Popconfirm
                        title="Are you sure you want to delete this analysis?"
                        onConfirm={() => clickDelete()}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <span>Delete analysis</span>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
            <Modal title="Save analysis as template" visible={isModalVisible} onOk={() => handleModalOk()}
                   onCancel={() => handleModalCancel()}
            >
                    <Row gutter={[16, 16]}>
                        <Col span={8}><span>Name</span></Col>
                        <Col span={16}><Input onChange={(e) => setNameText(e.target.value)}></Input></Col>

                        <Col span={8}><span>Description</span></Col>
                        <Col span={16}><Input onChange={(e) => setDescriptionText(e.target.value)}></Input></Col>
                    </Row>
            </Modal>
        </div>


    )
        ;
}
