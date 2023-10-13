import React, {useEffect, useState} from "react";
import {Tree, Tag, Input, Button, Checkbox, Select} from 'antd';
import RenderCharParams from "./RenderCharParams";

const {Option} = Select;

export default function AddColumnParams(props) {

    const [selColumn, setSelColumn] = useState()
    const [colData, setColData] = useState()
    const [newColName, setNewColName] = useState()

    console.log(props)

    useEffect(() => {
        const colData = computeColData()
        setColData(colData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    useEffect(() => {
     if(!props.params){
         props.setParams({})
     }
    }, [])

    const computeColData = () => {
        return props.commonResult.headers.reduce((acc, val) => {
            if (val.experiment) {
                const fieldName =  val.experiment.field

                const newVal = {
                    title: fieldName,
                    key: val.idx,
                    type: val.type,
                    isExperiment: true
                }

                const treeIdx = acc.findIndex(a => a.isExperiment && a.title === fieldName)

                if (treeIdx < 0) {
                    acc.push(newVal)
                }
            } else {
                const newVal = {
                    title: val.name,
                    key: val.idx,
                    type: val.type
                }

                acc.push(newVal)
            }

            return acc
        }, [])
    }

    const getTag = (type, isExperiment) => {
        const typeTag = (type === "NUMBER") ? <Tag color={"green"}>Numerical</Tag> : <Tag color={"gold"}>Character</Tag>
        if(isExperiment){
            return <div>{typeTag}&nbsp;<Tag color={"purple"}>Groups</Tag></div>
        } else {
            return <div>{typeTag}</div>
        }
    }

    const selectCol = (v) => {
        props.setParams({...props.params, selectedColumn: v})
        setSelColumn(v)
    }

    const onChangeNewName = (v) => {
        props.setParams({...props.params, newColName: v})
        setNewColName(v)
    }

    const renderNewColSettings = () => {
        const selItem = colData.find(a => a.title === selColumn)
        if(selItem.isExperiment){
            if(selItem.type === "CHARACTER") return null
            else return null
        }else{
            if(selItem.type === "CHARACTER") return <RenderCharParams
                colData={colData}
                selColumn={selColumn}
                params={props.params}
                setParams={props.setParams}
            ></RenderCharParams>
            else return null
        }
    }

    return (
        <>
            <h3>Select a column</h3>
            <Select
                value={selColumn}
                onChange={(v) => selectCol(v)}
                size={"small"}
                style={{width: 400}}
                showSearch={true}
                filterOption={(input, option) =>
                    option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {colData && colData.map((n, i) => {
                    const myTag = getTag(n.type, n.isExperiment)
                    return <Option key={i} value={n.title}>{n.title}{myTag}</Option>
                })}
            </Select>
            <div>
                {colData && selColumn && renderNewColSettings()}
            <h3>New column name</h3>
            <Input
                style={{width: 300}}
                onChange={(e) => onChangeNewName(e.target.value)}
                value={newColName}
            />
            </div>
        </>
    );
}
