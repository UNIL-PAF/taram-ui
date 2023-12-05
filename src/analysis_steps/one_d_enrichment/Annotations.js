import React, {useEffect, useState} from "react";
import {Button, Table, Select, Spin, Typography} from 'antd';
import {Col, Space} from 'antd';
import axios from "axios";
import globalConfig from "../../globalConfig";
import ManageAnnotations from "./ManageAnnotations";

const {Text} = Typography;
const {Option} = Select;

export default function Annotations(props) {
    const [annotations, setAnnotations] = useState();
    const [fields, setFields] = useState();
    const [status, setStatus] = useState();
    const [manageAnnoOpen, setManageAnnoOpen] = useState(false)

    const handleSelCol = (e) => {
        props.setParams({...props.params, annotationId: e, categoryIds: null})
        setFields(getHeaders(annotations, e))
    }

    const getHeaders = (annotations, selId) => {
        const selAnnot = annotations.find(a => a.id === selId)
        if (selAnnot.headers) {
            const headers = selAnnot.headers.map((h) => {
                return {key: h.id, name: h.name, id: h.id}
            })
            return headers
        }else{
            console.log("No headers available for annotation: [" + selId + "].")
            return null
        }
    }

    const refreshAnnotations = () => {
        axios.get(globalConfig.urlBackend + "annotation/list")
            .then((response) => {
                // handle success
                // add a unique key
                const results = response.data.map((r) => {
                    r.key = r.id
                    return r
                })

                setAnnotations(results.map(a => {return {...a, inUse: a.usedBy ? "true" : ""}}))
                setStatus("done")
                if(props.params.annotationId){
                    setFields(getHeaders(results, props.params.annotationId))
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                setStatus("error")
            })
            .then(function () {
                // always executed
            });
    }

    useEffect(() => {
        if (!annotations) {
            refreshAnnotations()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annotations])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            props.setParams({...props.params, categoryIds: selectedRows.map(a => a.id)})
        },
        getCheckboxProps: (record) => ({
            id: record.id,
        }),
        selectedRowKeys: props.params.categoryIds
    };

    return (<>
        <Col span={8}>
            {status === "done" && annotations &&
                <Space direction={"vertical"}>
                    <span><strong>Annotation</strong></span>
                    <Select value={props.params.annotationId} style={{width: 250}}
                            showSearch={true}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleSelCol}>
                        {annotations.map((n, i) => {
                            return <Option key={i} value={n.id}>{n.name}</Option>
                        })}</Select>
                    <Button type="primary" onClick={() => setManageAnnoOpen(true)}>Manage annotations</Button>
                </Space>
            }
            {status === "loading" &&
                <span><Spin/> <strong>Loading available annotations</strong></span>
            }
            {status === "error" &&
                <span><Text type="danger">Unable to load annotations from server.</Text></span>
            }
        </Col>
        <Col span={8}>
            {fields &&
                <div style={{overflowY: "scroll", maxHeight: "400px"}}>
                    <Table
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'name',
                            }]}
                        dataSource={fields}
                    />
                </div>}
        </Col>
        {manageAnnoOpen && <ManageAnnotations
            setModalOpen={setManageAnnoOpen}
            annotations={annotations}
            refreshAnnotations={refreshAnnotations}
        ></ManageAnnotations>}
    </>);
}
