import React, {useEffect, useState} from "react";
import {Button, Checkbox, InputNumber, Popover, Select, Space, Switch, Tree} from 'antd';
import {getNumCols} from "../CommonStepUtils";
import {InfoCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

export default function UmapPlotParams(props) {
    const [useDefaultCol, setUseDefaultCol] = useState()
    const numCols = getNumCols(props.commonResult.headers)

    const groups = Object.values(props.experimentDetails).map( a => a.group).reduce( (a, v) => (v !== null && a.indexOf(v) === -1) ? a.concat(v) : a, [])
    const groupsTreeData = groups.map( group => {return {key: group, title: group}})

    useEffect(() => {
        if (props.params) {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.column ? false : true)
            }
        }else{
            props.setParams({nrOfNeighbors: 2, minDistance: 0.1, useAllGroups: true, selGroups: groups})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, column: null})
    }

    function onChangeSwitch(e) {
        props.setParams({...props.params, useAllGroups: e})
    }

    function changeGroupSelection(newSelGroups){
        props.setParams({...props.params, selGroups: newSelGroups})
    }

    function renderUseGroups(){
        if(props.params.useAllGroups !== false){
            return <span>Use all groups</span>
        } else{
            return <>
                    <span>Use only selected groups:
                         <Tree
                             style={{marginTop: '10px'}}
                             checkable
                             treeData={groupsTreeData}
                             onCheck={changeGroupSelection}
                             checkedKeys={props.params.selGroups}
                         />
                    </span>
            </>
        }
    }

    function showOptions() {
        const selField = props.params.column ? props.params.column : props.intCol
        const nrPoints = props.commonResult.headers.filter( (a) => a.experiment && a.experiment.field === selField).length

        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.column || props.intCol} style={{width: 250}}
                        onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                <span>
                <span>Number of neighbors</span>
                    <Popover overlayStyle={{
                        width: "40vw"
                    }}  content={"This parameter controls how UMAP balances local versus global structure in the data. Low values will force UMAP to concentrate on very local structure (potentially to the detriment of the big picture), while large values will push UMAP to look at larger neighborhoods of each point when estimating the manifold structure of the data, losing fine detail structure for the sake of getting the broader of the data."} placement="right">
                    <Button type="text" shape="circle" icon={<InfoCircleOutlined />} ></Button>
                </Popover>
                <InputNumber
                    min={2} max={nrPoints}
                    value={props.params.nrOfNeighbors}
                    onChange={(val) => valueChange("nrOfNeighbors", val)}></InputNumber>
                <span style={{margin: "10px"}}><em>Range: 2 to {nrPoints}</em></span>
            </span>
                <span>
                <span>Minimum distance</span>
                <Popover overlayStyle={{
                    width: "40vw"
                }}  content={"The minimum distance parameter controls how tightly UMAP is allowed to pack points together. It, quite literally, provides the minimum distance apart that points are allowed to be in the low dimensional representation. This means that low values will result in clumpier embeddings. This can be useful if you are interested in clustering, or in finer topological structure. Larger values will prevent UMAP from packing points together and will focus on the preservation of the broad topological structure instead. The default value is 0.1. You can use a range of values from 0.01 to 0.99."} placement="right">
                    <Button type="text" shape="circle" icon={<InfoCircleOutlined />} ></Button>
                </Popover>
                <InputNumber
                    min={0.0} max={0.99}
                    value={props.params.minDistance}
                    onChange={(val) => valueChange("minDistance", val)}></InputNumber>
                <span style={{margin: "10px"}}><em>Range: 0.01 to 0.99</em></span>
            </span>
                <span>
                    <Switch checked={props.params.useAllGroups !== false} onChange={onChangeSwitch} style={{marginRight: '10px'}}/>
                    {renderUseGroups()}
                </span>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select data column for UMAP</h3>
            {props.params && showOptions()}
        </>
    );
}
