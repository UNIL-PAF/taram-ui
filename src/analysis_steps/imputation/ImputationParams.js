import React, {useEffect, useState} from "react";
import {InputNumber, Row, Select, Space, Switch, Tree, Col} from 'antd';

const {Option} = Select;

export default function ImputationParams(props) {
    const [useDefaultCol, setUseDefaultCol] = useState()
    const [colData, setColData] = useState()
    const [checkedKeys, setCheckedKeys] = useState();

    useEffect(() => {
            if (!props.params) {
                props.setParams({
                    intCol: null,
                    imputationType: 'normal',
                    normImputationParams: {
                        width: 0.3,
                        downshift: 1.8,
                        seed: 1
                    }
                })
                setUseDefaultCol(true)
                setCheckedKeys([props.intCol])
            } else {
                parseAndSetLocalParams()

                if (!colData) {
                    const myColData = computeColData()
                    setColData(myColData)
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.params, useDefaultCol, colData]
    )

    const parseAndSetLocalParams = () => {
        // set Columns
        if (useDefaultCol === undefined) {
            if (props.params.intCol === null) {
                if(!props.params.selColIdxs){
                    setUseDefaultCol(true)
                    setCheckedKeys([props.intCol])
                }else{
                    setUseDefaultCol(false)
                    setCheckedKeys(props.params.selColIdxs)
                }
            } else {
                setUseDefaultCol(false)
                setCheckedKeys([props.params.intCol])
            }
        }
    }

    const computeColData = () => {
        return props.commonResult.headers.reduce((acc, val) => {
            const newVal = {
                title: val.name,
                key: val.idx,
                type: val.type
            }

            if (val.type !== "NUMBER") return acc

            if (val.experiment) {
                const treeIdx = acc.findIndex(a => a.key === val.experiment.field)
                if (treeIdx < 0) {
                    acc.push({
                        title: val.experiment.field,
                        key: val.experiment.field,
                        type: val.type,
                        children: [newVal]
                    })
                } else {
                    acc[treeIdx] = {...acc[treeIdx], children: acc[treeIdx].children.concat(newVal)}
                }
            } else {
                acc.push(newVal)
            }

            return acc
        }, [])
    }

    function impChange(value) {
        props.setParams({...props.params, imputationType: value})
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function valueParams() {
        return <span style={{paddingLeft: "10px"}}>
            <InputNumber value={props.params.replaceValue} onChange={(val) => valueChange("replaceValue", val)}/>
        </span>
    }

    function normalParams() {
        return <span style={{paddingLeft: "10px"}}>
                <span style={{paddingLeft: "10px"}}>Width <InputNumber
                    value={props.params.normImputationParams.width}
                    onChange={(val) => valueChange("width", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Downshift <InputNumber
                    value={props.params.normImputationParams.downshift}
                    onChange={(val) => valueChange("downshift", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Seed <InputNumber
                    value={props.params.normImputationParams.seed}
                    onChange={(val) => valueChange("seed", val)}></InputNumber></span>
            </span>
    }

    const onCheck = (e) => {
        setCheckedKeys(e)
        if (e.length > 0) {
            if (typeof e[0] === "string") {
                props.setParams({...props.params, intCol: e[0], selColIdxs: null})
            } else {
                props.setParams({...props.params, intCol: null, selColIdxs: e})
            }
        }
    }

    const switchDefault = (e) => {
        setUseDefaultCol(e)
        if (e) {
            props.setParams({...props.params, intCol: null, selColIdxs: null})
            setCheckedKeys([props.intCol])
        } else setCheckedKeys(undefined)
    }

    function showOptions() {
        return <Row>
            <Col span={12}>
                <h3>Select columns</h3>
                <span><Switch onChange={switchDefault}
                              checked={useDefaultCol}></Switch>&nbsp;Use default intensity values
                    [{props.intCol}]</span><br></br><br></br>
                <Tree
                    checkable
                    disabled={useDefaultCol}
                    treeData={colData}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                />
            </Col>
            <Col span={12}>
                <Space direction="vertical" size="middle">
                    <h3>Imputation</h3>
                    <span>
                <Select value={props.params.imputationType} style={{width: 250}} onChange={impChange}>
                    <Option value={'normal'}>Normal distribution</Option>
                    <Option value={'nan'}>Replace by NaN</Option>
                    <Option value={'value'}>Fix value</Option>
                </Select>
                        {props.params.imputationType === "value" && valueParams()}
                        {props.params.imputationType === "normal" && normalParams()}
                </span>
                </Space>
            </Col>
        </Row>
    }

    return (
        <>
            <h3>Select value to transform</h3>
            {props.params && showOptions()}
        </>
    );
}
