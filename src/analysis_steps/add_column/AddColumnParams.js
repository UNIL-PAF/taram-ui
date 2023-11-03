import React, {useEffect, useState} from "react";
import {Input, Tag, Switch, Tree} from 'antd';
import RenderCharParams from "./RenderCharParams";
import RenderNumParams from "./RenderNumParams";


export default function AddColumnParams(props) {

    const [colData, setColData] = useState()
    const [checkedKeys, setCheckedKeys] = useState();
    const [numIsSel, setNumIsSel] = useState(true)

    useEffect(() => {
        if (!colData && props.params) {
            const myColData = computeColData()
            setColData(myColData)
            setNumIsSel(props.params.type === "char" ? false : true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params, colData])

    useEffect(() => {
        const myColData = computeColData(numIsSel)
        setColData(myColData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numIsSel])

    useEffect(() => {
        if (!props.params) {
            props.setParams({type: 'num'})
        }else{
            setCheckedKeys(props.params.selIdxs)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const computeColData = (myNumIsSel) => {
        return props.commonResult.headers.reduce((acc, val) => {
            const newVal =   {
                title: val.name,
                key: val.idx,
                type: val.type
            }

            if((myNumIsSel && val.type !== "NUMBER") || (!myNumIsSel && val.type !== "CHARACTER")) return acc

            if(val.experiment){
                const treeIdx = acc.findIndex( a => a.key === val.experiment.field)
                if(treeIdx < 0){
                    acc.push({title: val.experiment.field, key: val.experiment.field, type: val.type, children: [newVal]})
                }else{
                    acc[treeIdx] = {...acc[treeIdx], children: acc[treeIdx].children.concat(newVal)}
                }
            }else{
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

    const onChangeNewName = (v) => {
        props.setParams({...props.params, newColName: v})
    }

    const renderNewColSettings = (myNumIsSel) => {
        if(myNumIsSel){
         return <RenderNumParams
                colData={colData}
                selColumn={props.params.selectedColumn}
                params={props.params}
                setParams={props.setParams}
            ></RenderNumParams>
        } else {
            return <RenderCharParams
                colData={colData}
                selColumn={props.params.selectedColumn}
                params={props.params}
                setParams={props.setParams}
            ></RenderCharParams>
        }
    }

    const renderTitle = item => {
        return <div key={item.key}><span>{item.title}&nbsp;&nbsp;&nbsp;{getTag(item.type)}</span></div>
    }

    const switchType = (e) => {
        setNumIsSel(e)
        props.setParams({...props.params, type: (e ? 'num' : 'char')})
    }

    const checkedToParams = (checkedKeys) => {
        return checkedKeys.filter((a) => {return ! isNaN(a)})
    }

    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
        props.setParams({...props.params, selIdxs: checkedToParams(checkedKeysValue)})
    };

    return (
        <>
            {colData && props.params && <div>
            <h3>New column name</h3>
            <Input
                style={{width: 300}}
                onChange={(e) => onChangeNewName(e.target.value)}
                value={props.params.newColName}
            />
                <h3>Select columns</h3>
                <Switch checkedChildren={"Numerical"} unCheckedChildren={"Character"} onChange={switchType} checked={numIsSel}></Switch>
                <Tree
                    checkable
                    treeData={colData}
                    titleRender={renderTitle}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                />
                <div>
                    {renderNewColSettings(numIsSel)}
                </div>
            </div>}
        </>
    );
}
