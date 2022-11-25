import React, {useEffect, useState} from "react";
import {Tree, Tag} from 'antd';

export default function RemoveColumnsParams(props) {

    const [checkedKeys, setCheckedKeys] = useState();

    useEffect(() => {
        if(!checkedKeys) {
            if (props.params) {
                setCheckedKeys(props.params.keepIdxs)
            } else {
                setCheckedKeys([])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, checkedKeys])

    console.log(props.commonResult)

    const treeData = props.commonResult.headers.reduce((acc, val) => {
        const newVal =   {
            title: val.name,
            key: val.idx,
            type: val.type
        }

        if(val.experiment){
            const treeIdx = acc.findIndex( a => a.key === val.experiment.field)
            if(treeIdx < 0){
                acc.push({title: val.experiment.field, key: val.experiment.field, type: 'EXPERIMENT', children: [newVal]})
            }else{
                acc[treeIdx] = {...acc[treeIdx], children: acc[treeIdx].children.concat(newVal)}
            }
        }else{
            acc.push(newVal)
        }

        return acc
    }, [])

    const getTag = (type) => {
        if(type === "NUMBER"){
            return <Tag color={"cyan"}>Numerical</Tag>
        }else if(type === "CHARACTER"){
            return <Tag color={"gold"}>Character</Tag>
        }else if(type === "EXPERIMENT"){
            return <Tag color={"green"}>Samples</Tag>
        }else{
            return null
        }

    }

    const renderTitle = item => {
      return <div key={item.key}><span>{item.title}&nbsp;&nbsp;&nbsp;{getTag(item.type)}</span></div>
    }

    const checkedToParams = (checkedKeys) => {

        return checkedKeys.filter((a) => {return ! isNaN(a)})
    }

    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
        props.setParams({keepIdxs: checkedToParams(checkedKeysValue)})
    };

    return (
        <>
            <h3>Only keep selected columns</h3>
            <Tree
                checkable
                treeData={treeData}
                titleRender={renderTitle}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
            />

        </>
    );
}
