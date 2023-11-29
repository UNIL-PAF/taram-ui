import React, {useEffect} from "react";
import {Checkbox, Select, InputNumber} from 'antd';
import {Col, Row, Space} from 'antd';
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
                threshold: 0.02
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

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    return (<>
        {props.params &&
            <Row>
                <Col span={8}>
                    <Space direction={"vertical"}>
                        <span><strong>Column</strong></span>
                        <Select value={props.params.colIdx} style={{width: 250}}
                                showSearch={true}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={handleSelCol}>
                            {dataCols.map((n, i) => {
                                return <Option key={i} value={n.idx}>{n.name}</Option>
                            })}</Select>
                        <span>
                        <Checkbox checked={props.params.fdrCorrection}
                                  onChange={(e) => handleChange("fdrCorrection", e.target.checked)}>
                        </Checkbox>
                            <span style={{paddingLeft: "8px"}}>FDR correction</span>
                        </span>
                        <span>
                        <span style={{paddingRight: "10px"}}>Significance threshold</span>
                        <InputNumber
                            min={0.000001} max={0.999}
                            value={props.params.threshold}
                            onChange={(val) => valueChange("threshold", val)}></InputNumber>
                            </span>
                    </Space>
                </Col>
                <Annotations params={props.params} setParams={props.setParams}>
                </Annotations>
            </Row>}
    </>);
}
