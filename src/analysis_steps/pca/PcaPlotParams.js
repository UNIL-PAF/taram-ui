import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space, Switch, Tree} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function PcaPlotParams(props) {

    const groups = Object.values(props.experimentDetails).map( a => a.group).reduce( (a, v) => (v !== null && a.indexOf(v) === -1) ? a.concat(v) : a, [])
    const groupsTreeData = groups.map( group => {return {key: group, title: group}})

    const [useDefaultCol, setUseDefaultCol] = useState()
    const numCols = getNumCols(props.commonResult.headers)

    useEffect(() => {
        if (props.params) {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.column ? false : true)
            }
        }else{
            props.setParams({useAllGroups: true, selGroups: groups})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function onChangeSwitch(e) {
        props.setParams({...props.params, useAllGroups: e})
    }

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, column: null})
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
                    <Switch checked={props.params.useAllGroups !== false} onChange={onChangeSwitch} style={{marginRight: '10px'}}/>
                    {renderUseGroups()}
                </span>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select data column for PCA</h3>
            {props.params && showOptions()}
        </>
    );
}
