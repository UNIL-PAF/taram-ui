import React, {useEffect, useState} from "react";
import {Button, Checkbox, Select, Input, Tag} from 'antd';
import {Col, Row, Space} from 'antd';
import {CloseCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import Annotations from "./Annotations";

const {Option} = Select;

export default function OneDEnrichmentParams(props) {

    const dataCols = props.commonResult.headers.filter(h => h.type === "NUMBER").map(h => {
        return {name: h.name, idx: h.idx}
    })

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                fdrCorrection: true,
                threshold: 0.02,
                categoryNames: ["GOCC name", "GOBP name"]
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params])

    const handleSelCol = (e) => {
        props.setParams({...props.params, colIdx: e})
    }

    function handleChange(field, checked) {
        let newParams = {...props.params}
        newParams[field] = checked
        props.setParams(newParams)
    }

    return (<>
        {props.params &&
            <Row>
                <Col span={8}>
                    <Space direction={"vertical"}>
                        <span><strong>Column</strong></span>
                        <Select value={props.params.xAxis} style={{width: 250}}
                                showSearch={true}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={handleSelCol}>
                            {dataCols.map((n, i) => {
                                return <Option key={i} value={n.idx}>{n.name}</Option>
                            })}</Select>
                    </Space>
                </Col>
                <Col span={8}>
                    <Annotations params={props.params} setParams={props.setParams}>
                    </Annotations>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.params.fdrCorrection}
                              onChange={(e) => handleChange("fdrCorrection", e.target.checked)}>
                    </Checkbox>
                    <span style={{paddingLeft: "20px"}}>FDR correction</span>
                </Col>
            </Row>}
    </>);
}
