import React, {useEffect, useState} from "react";
import {Tree, Tag, Input, Button, Checkbox} from 'antd';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

export default function RenameColumnsParams(props) {

    const [selItem, setSelItem] = useState()
    const [editName, setEditName] = useState()
    const [treeData, setTreeData] = useState()

    const groupsDefined = (Object.values(props.experimentDetails).find(a => a.group)) ? true : false

    useEffect(() => {
        setTreeData(computeTreeData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const computeTreeData = () => {
        return props.commonResult.headers.reduce((acc, val) => {
            if (val.experiment) {
                const renameItem = (props.params && props.params.rename) ? props.params.rename.find(r => r.idx === val.experiment.field) : undefined
                const fieldName = renameItem ? renameItem.name : val.experiment.field

                const newVal = {
                    title: renameItem ? val.experiment.name + "." + renameItem.name : val.name,
                    key: val.idx,
                    type: val.type,
                    inExperiment: true
                }

                const treeIdx = acc.findIndex(a => a.key === fieldName)
                if (treeIdx < 0) {
                    acc.push({title: fieldName, key: fieldName, type: 'EXPERIMENT', children: [newVal]})
                } else {
                    acc[treeIdx] = {...acc[treeIdx], children: acc[treeIdx].children.concat(newVal)}
                }
            } else {
                const renameItem = (props.params && props.params.rename) ? props.params.rename.find(r => r.idx === val.idx) : undefined

                const newVal = {
                    title: (renameItem ? renameItem.name : val.name),
                    key: val.idx,
                    type: val.type
                }

                acc.push(newVal)
            }

            return acc
        }, [])
    }

    const getTag = (type) => {
        if (type === "NUMBER") {
            return <Tag color={"green"}>Numerical</Tag>
        } else if (type === "CHARACTER") {
            return <Tag color={"gold"}>Character</Tag>
        } else if (type === "EXPERIMENT") {
            return null
        } else {
            return null
        }

    }

    const onClick = (e, a) => {
        if (!a.node.inExperiment) {
            setEditName(a.node.title)
            setSelItem(a.node)
        }
    }

    const setName = (s) => {
        setEditName(s)
    }

    const save = (e) => {
        e.stopPropagation()
        const oldRename = (props.params && props.params.rename) ? props.params.rename : []
        const newItem = {idx: selItem.key, name: editName}
        const fltRename = oldRename.filter(r => r.idx !== newItem.idx)
        const newRename = fltRename.concat(newItem)
        props.setParams({...props.stepParams, rename: newRename})
        setSelItem(undefined)
        setEditName(undefined)
    }

    const cancel = (e) => {
        e.stopPropagation()
        setSelItem(undefined)
        setEditName(undefined)
    }

    const renderTitle = item => {
        // if we're editing we give back the input
        if (selItem && selItem.key === item.key) {
            return <div key={item.key} style={{whiteSpace: "nowrap"}}>
                <Input defaultValue={item.title}
                       onPressEnter={save}
                       onChange={(e) => setName(e.target.value)}
                       onBlur={save}/>
                <Button shape="circle" icon={<CheckOutlined style={{fontSize: '10px'}}/>} onClick={(e) => save(e)}
                        size={"small"}></Button>
                <Button shape="circle" icon={<CloseOutlined style={{fontSize: '10px'}}/>} onClick={(e) => cancel(e)}
                        size={"small"} danger></Button>
            </div>
        }

        //otherwise we give back the node element
        return <div key={item.key}><span>{item.title}&nbsp;&nbsp;&nbsp;{getTag(item.type)}</span></div>
    }

    const reset = () => {
        props.setParams(undefined)
        setSelItem(undefined)
        setEditName(undefined)
    }

    const handleChange = (status) => {
        props.setParams({...props.params, addConditionNames: status})
    }

    return (
        <>
            <div><Button type="primary" onClick={() => reset()}>Reset</Button></div>
            <br></br>
            <span>
                <Checkbox disabled={!groupsDefined} checked={props.params && props.params.addConditionNames}
                          onChange={(e) => handleChange(e.target.checked)}>
                </Checkbox>
                <span style={{paddingLeft: "20px"}}>Add conditions to table headers.</span>
            </span>
            <br></br>
            <br></br>
            <h3>Only keep selected columns</h3>
            <Tree
                treeData={treeData}
                titleRender={renderTitle}
                onSelect={onClick}
            />

        </>
    );
}
