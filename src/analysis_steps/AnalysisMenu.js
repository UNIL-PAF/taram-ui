import React, {useEffect, useState} from "react";
import globalConfig from "../globalConfig";
import {Alert, Button, Col, Input, Menu, message, Modal, Popconfirm, Row, Tooltip} from "antd";
import {copyAnalysis, deleteAnalysis, duplicateAnalysis} from "../analysis/BackendAnalysis";
import {useDispatch, useSelector} from "react-redux";
import {addTemplate, fetchAllTemplates, runTemplate} from "../templates/BackendTemplates";
import DefineGroupsParams from "./initial_result/DefineGroupsParams";
import '../analysis/analysis.css'
import {CloseOutlined} from "@ant-design/icons";
import {setStepParameters} from "./BackendAnalysisSteps";

export default function AnalysisMenu(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [localParams, setLocalParams] = useState()
    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
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

    useEffect(() => {
        if (props.initialStep) {
            const colMapping = props.initialStep.columnInfo.columnMapping

            const expData = colMapping.experimentNames.map((e) => {
                const exp = colMapping.experimentDetails[e]
                return {
                    name: exp.name,
                    fileName: exp.fileName,
                    originalName: exp.originalName,
                    key: e,
                    isSelected: exp.isSelected
                }
            })

            const newGroupData = [{
                name: "Condition",
                alreadySet: false,
                targetKeys: [],
                dataSource: expData.map((exp) => {
                    return {key: exp.key, title: exp.name, disabled: !exp.isSelected}
                })
            }]

            const expList = Object.values(colMapping.experimentDetails)
            const groups = [...new Set(expList.map((e) => e.group))].filter((e) => e != null)

            //const initialGroups = groups.map((e) => ({e : {name: e, "alreadySet": true, targetKeys: [], dataSource: []}}))
            const initialGroups = groups.reduce((acc, cur) => ({
                ...acc,
                [cur]: {name: cur, "alreadySet": true, targetKeys: [], dataSource: []}
            }), {})

            const loadedGroupData = expList.reduce((acc, cur) => {
                const cleaned = {key: cur.originalName, title: cur.name, disabled: true}
                groups.forEach((g) => {
                    const sameGroup = (g === cur.group)
                    const dataSource = sameGroup ? {...cleaned, disabled: false} : cleaned
                    acc[g].dataSource.push(dataSource)
                    if (sameGroup) acc[g].targetKeys.push(cleaned.key)
                })
                return acc
            }, initialGroups)

            const groupData = (groups.length >= 1) ? Object.values(loadedGroupData) : newGroupData
            setLocalParams({expData: expData, groupData: groupData, column: colMapping.intCol})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])


    // format the data for the backend
    const prepareParams = (params) => {
        const experimentDetails = params.expData.reduce((sum, d) => {
            const group = params.groupData.find((g) => {
                return g.targetKeys.includes(d.key)
            })
            sum[d.key] = {fileName: d.fileName, name: d.name, isSelected: d.isSelected, originalName: d.originalName}
            if (group) {
                sum[d.key].group = group.name
            }
            return sum
        }, {})
        return {experimentDetails: experimentDetails, intCol: params.column}
    }

    const handleModalOk = () => {
        dispatch(addTemplate({analysisId: props.analysisId, name: nameText, description: descriptionText}))
        setIsModalVisible(false);
    };

    const handleGroupModalOk = () => {
        dispatch(setStepParameters({
            resultId: props.resultId,
            stepId: props.initialStep.id,
            params: prepareParams(localParams)
        }))
        setIsGroupModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleGroupModalCancel = () => {
        setIsGroupModalVisible(false);
    };

    const clickDelete = () => {
        dispatch(deleteAnalysis({analysisId: props.analysisId, resultsId: props.resultId}))
    }

    const clickDuplicate = () => {
        dispatch(duplicateAnalysis({analysisId: props.analysisId, resultsId: props.resultId}))
    }

    const clickCopy = () => {
        dispatch(copyAnalysis({analysisId: props.analysisId, resultsId: props.resultId}))
    }

    const setGroups = () => {
        setIsGroupModalVisible(true);
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
        dispatch(runTemplate({analysisId: props.analysisId, templateId: templateId, resultsId: props.resultId}))
    }

    const closeMenu = () => {
        props.setMenuIsVisible(false)
    }

    return (
        <div align={"center"} className={"analysis-menu"}>
            {templatesError && <Alert
                message="Error"
                description={templatesError}
                type="error"
                showIcon
                closable
            />}
            <div><span className={"analysis-menu-title"}>Analysis menu</span>
                <Button className={"analysis-menu-close"}
                        onClick={() => closeMenu()}
                        type={"text"}
                        icon={<CloseOutlined/>}></Button>
            </div>
            <Menu selectable={false} onClick={() => closeMenu()}>
                <Menu.Item onClick={() => setGroups()}
                           key={'groups'}
                >
                    <span>Groups and intensity...</span>
                </Menu.Item>
                <Menu.Item onClick={() => downloadPdf()}
                           key={'pdf'}
                >
                    <span>Download PDF</span>
                </Menu.Item>
                <Menu.Divider key={'divider-1'}></Menu.Divider>
                <Menu.Item onClick={() => clickDuplicate()}
                           key={'copy-current'}>
                    <span>Duplicate analysis</span>
                </Menu.Item>
                <Menu.Item onClick={() => clickCopy()}
                           key={'start-new'}>
                    <span>Start a new analysis</span>
                </Menu.Item>
                <Menu.Divider key={'divider-2'}></Menu.Divider>
                <Menu.SubMenu key={"sub-1"} title={"Run template"}>
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
                    <span>Save analysis as template...</span>
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
                   onCancel={() => handleModalCancel()}>
                <Row gutter={[16, 16]}>
                    <Col span={8}><span>Name</span></Col>
                    <Col span={16}><Input onChange={(e) => setNameText(e.target.value)}></Input></Col>

                    <Col span={8}><span>Description</span></Col>
                    <Col span={16}><Input onChange={(e) => setDescriptionText(e.target.value)}></Input></Col>
                </Row>
            </Modal>
            <Modal visible={isGroupModalVisible} onOk={() => handleGroupModalOk()}
                   onCancel={() => handleGroupModalCancel()} width={1000}>
                <DefineGroupsParams analysisIdx={props.analysisIdx}
                                    params={localParams} commonResult={props.initialStep.commonResult}
                                    prepareParams={prepareParams}
                                    setParams={setLocalParams}>
                </DefineGroupsParams>
            </Modal>
        </div>


    )
        ;
}
