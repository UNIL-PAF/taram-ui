import React, {useState} from "react";
import globalConfig from "../globalConfig";
import {Button, Col, Input, Menu, message, Modal, Popconfirm, Row} from "antd";
import {useDispatch} from "react-redux";
import {addTemplate} from "../templates/BackendTemplates";
import '../analysis/analysis.css'
import {CloseOutlined} from "@ant-design/icons";
import {deleteAnalysisStep} from "./BackendAnalysisSteps";

export default function AnalysisStepMenuItems(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nameText, setNameText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const dispatch = useDispatch();

    /*
    useEffect(() => {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
     */

    const handleModalOk = () => {
        dispatch(addTemplate({analysisId: props.analysisId, name: nameText, description: descriptionText}))
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const confirmDelete = () => {
        dispatch(deleteAnalysisStep({stepId: props.stepId, resultId: props.resultId}))
        message.success('Delete ' + getType() + '.');
    };

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

    const closeMenu = () => {
        props.setMenuIsVisible(false)
    }

    const getType = () => {
        if(props.type){
            return props.type.charAt(0).toUpperCase() + props.type.slice(1)
        }else{
            return "Initial result"
        }
    }

    return (
        <div align={"center"} className={"analysis-menu"} style={{minWidth: '200px'}}>
            <div><span className={"analysis-menu-title"}>{getType()} menu</span><Button className={"analysis-menu-close"}
                                                                                     onClick={() => closeMenu()}
                                                                                     type={"text"}
                                                                                     icon={<CloseOutlined/>}></Button>
            </div>
            <Menu selectable={false} onClick={() => closeMenu()}>
                <Menu.Item onClick={() => downloadPdf()}
                           key={'zip'}
                >
                    <span>Download ZIP..</span>
                </Menu.Item>
                <Menu.Divider key={'divider-3'}></Menu.Divider>
                {props.type && <Menu.Item key={'delete-analysis'} danger={true}>
                    <Popconfirm
                        title={"Are you sure you want to delete this "+getType()+"?"}
                        onConfirm={() => confirmDelete()}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <span>Delete {getType()}</span>
                    </Popconfirm>
                </Menu.Item>}
            </Menu>
            <Modal title="Save analysis as template" visible={isModalVisible} onOk={() => handleModalOk()}
                   onCancel={() => handleModalCancel()}>
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
