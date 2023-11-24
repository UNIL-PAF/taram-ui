import React, {useEffect, useState} from "react";
import {Button, Checkbox, Select, Input, Tag, Spin, Typography} from 'antd';
import {Col, Row, Space} from 'antd';
import {CloseCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import globalConfig from "../../globalConfig";
const { Text } = Typography;

const {Option} = Select;

export default function Annotations(props) {
    const [annotations, setAnnotations] = useState();
    const [status, setStatus] = useState();

    const handleSelCol = (e) => {
        console.log(e)
        props.setParams({...props.params, annotationId: e})
    }

    useEffect(() => {
        axios.get(globalConfig.urlBackend + "annotation/list")
            .then((response) => {
                // handle success
                // add a unique key
                const results = response.data.map((r) => {
                    r.key = r.id
                    return r
                })
                console.log(results)
                setAnnotations(results)
                setStatus("done")
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                setStatus("error")
            })
            .then(function () {
                // always executed
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annotations])

    return (<>
        {status === "done" && annotations &&
            <Space direction={"vertical"}>
                <span><strong>Annotation</strong></span>
                <Select value={props.selAnnotation} style={{width: 250}}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleSelCol}>
                    {annotations.map((n, i) => {
                        return <Option key={i} value={n.id}>{n.name}</Option>
                    })}</Select>
                <Button type="primary" onClick={() => props.refreshData()}>Upload annotation file</Button>
            </Space>
        }
        { status === "loading" &&
            <span><Spin /> <strong>Loading available annotations</strong></span>
        }
        { status === "error" &&
            <span><Text type="danger">Unable to load annotations from server.</Text></span>
        }

    </>);
}
