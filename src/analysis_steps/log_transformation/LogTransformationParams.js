import React, {useEffect, useState} from "react";
import {Checkbox, Col, Row, Select, Space, Switch, Tree} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function LogTransformationParams(props) {

    //const numCols = getNumCols(props.commonResult.headers)
    const intColName = props.commonResult.intCol

    const [useDefaultCol, setUseDefaultCol] = useState()
    const [colData, setColData] = useState()
    const [checkedKeys, setCheckedKeys] = useState();

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: intColName,
                transformationType: 'log2',
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
    }, [props.params, useDefaultCol, colData])

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

    const onCheck = (e) => {
        console.log(e)
        setCheckedKeys(e)
        if (e.length > 0) {
            if (typeof e[0] === "string") {
                props.setParams({...props.params, intCol: e[0], selColIdxs: null})
            } else {
                props.setParams({...props.params, intCol: null, selColIdxs: e})
            }
        }
    }

    function transChange(value) {
        props.setParams({...props.params, transformationType: value})
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
                    <h3>Transformation</h3>
                    <Select value={props.params.transformationType} style={{width: 250}} onChange={transChange}>
                        <Option value={'log2'}>Log2</Option>
                    </Select>
                </Space>
            </Col>
        </Row>

        /*
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values
                    [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.intCol || props.intCol} style={{width: 250}}
                        onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}
                </Select>
                <h3>Transformation</h3>
                <Select value={props.params.transformationType} style={{width: 250}} onChange={transChange}>
                    <Option value={'log2'}>Log2</Option>
                </Select>
            </Space>
        </>

         */
    }

    return (
        <>
            <h3>Select value to transform</h3>
            {props.params && showOptions()}
        </>
    );
}