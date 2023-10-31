import React, {useEffect, useState} from "react";
import {Input, Select, Tag} from 'antd';
import RenderCharParams from "./RenderCharParams";
import RenderNumExpParams from "./RenderNumExpParams";

const {Option} = Select;

export default function AddColumnParams(props) {

    const [colData, setColData] = useState()
    const [selCol, setSelCol] = useState()

    useEffect(() => {
        if (!colData && props.params) {
            const colData = computeColData()
            setColData(colData)
            if(props.params.selectedColumnIdx){
                const col = colData.find( c => c.key === props.params.selectedColumnIdx)
                if(col) setSelCol(col.title)
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params, colData])

    useEffect(() => {
        if (!props.params) {
            props.setParams({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const computeColData = () => {
        const headersWithoutNew = (props.params && props.params.newColName) ? props.commonResult.headers.filter(h => h.name !== props.params.newColName) : props.commonResult.headers

        return headersWithoutNew.reduce((acc, val) => {
            if (val.experiment) {
                const fieldName = val.experiment.field

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
        if (isExperiment) {
            return <div>{typeTag}&nbsp;<Tag color={"purple"}>Groups</Tag></div>
        } else {
            return <div>{typeTag}</div>
        }
    }

    const getType = (selCol) => {
        const firstPart = (selCol.type === "CHARACTER") ? "char" : "num"
        return selCol.isExperiment ? firstPart + "-exp" : firstPart
    }

    const selectCol = (v, a) => {
        const col = colData[Number(a.key)]
        const type = getType(col)
        props.setParams({...props.params, selectedColumnIdx: col.key, type: type})
        setSelCol(col.title)
    }

    const onChangeNewName = (v) => {
        props.setParams({...props.params, newColName: v})
    }

    const renderNewColSettings = () => {
        const selItem = colData.find(a => a.key === props.params.selectedColumnIdx)
        if(!selItem) return null

        if (selItem.isExperiment) {
            if (selItem.type === "NUMBER") return <RenderNumExpParams
                colData={colData}
                selColumn={props.params.selectedColumn}
                params={props.params}
                setParams={props.setParams}
            ></RenderNumExpParams>
            else return null
        } else {
            if (selItem.type === "CHARACTER") return <RenderCharParams
                colData={colData}
                selColumn={props.params.selectedColumn}
                params={props.params}
                setParams={props.setParams}
            ></RenderCharParams>
            else return null
        }
    }

    return (
        <>
            {colData && props.params && <div>
                <h3>Select a column</h3>
                <Select
                    value={selCol}
                    onChange={(v, a) => selectCol(v, a)}
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
                    {renderNewColSettings()}
                    <h3>New column name</h3>
                    <Input
                        style={{width: 300}}
                        onChange={(e) => onChangeNewName(e.target.value)}
                        value={props.params.newColName}
                    />
                </div>
            </div>}
        </>
    );
}
