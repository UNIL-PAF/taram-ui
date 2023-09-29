import React, {useEffect, useState} from "react";
import {Tree, Tag, Input, Button, Checkbox, Select} from 'antd';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const {Option} = Select;

export default function AddColumnParams(props) {

    const [selColumn, setSelColumn] = useState()
    const [colData, setColData] = useState()
    const [compString, setCompString] = useState()
    const [newColName, setNewColName] = useState()

    useEffect(() => {
        const colData = computeColData()
        setColData(colData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

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
        console.log("selectCol", v)
        setSelColumn(v)
    }

    const renderNewColSettings = () => {
        const selItem = colData.find(a => a.title === selColumn)
        if(selItem.isExperiment){
            if(selItem.type === "CHARACTER") return renderExpChar()
            else return renderExpNum()
        }else{
            if(selItem.type === "CHARACTER") return renderChar()
            else return renderNum()
        }
    }

    const renderExpChar = () => {
        return <>
            <span>Render Exp Char</span>
        </>
    }

    const renderExpNum = () => {
        return <>
            <span>Render Exp Num</span>
        </>
    }

    const onChangeComp = (v) => {
        setCompString(v)
    }

    const renderChar = () => {
        return <>
            <span>New column will have a [+] if [<em>{selColumn}</em>]
                <Select size={"small"} style={{width: 150}}>
                    <Option key={"matches"} value={"matches"}>{"matches"}</Option>
                    <Option key={"not"} value={"not"}>{"matches not"}</Option>
                </Select>
            </span>
            <Input
                style={{width: "150px"}}
                onChange={(e) => onChangeComp(e.target.value)}
                value={compString}
            />
        </>
    }

    const renderNum = () => {
        return <>
            <span>Render Num</span>
        </>
    }

    const onChangeNewName = (v) => {
        setNewColName(v)
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
