import React, {useState} from "react";
import {Button, Modal, Tree, Tag} from "antd";

export default function SelectTableColumns(props) {

    const [checkedKeys, setCheckedKeys] = useState();

    const treeData = props.headers.reduce((acc, val) => {
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

    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const getTag = (type) => {
        if(type === "NUMBER"){
            return <Tag color={"green"}>Numerical</Tag>
        }else if(type === "CHARACTER"){
            return <Tag color={"gold"}>Character</Tag>
        }else if(type === "EXPERIMENT"){
            return null
        }else{
            return null
        }

    }

    const renderTitle = item => {
        return <div key={item.key}><span>{item.title}&nbsp;&nbsp;&nbsp;{getTag(item.type)}</span></div>
    }

    const selectAll = () => {
        setCheckedKeys(treeData.map(a => a.key))
    }

    const deselectAll = () => {
        setCheckedKeys(undefined)
    }

   return <Modal open={true} title={"Select columns"} onCancel={() => props.setSelectColumns(false)}
                 onOk={() => props.selectColumnsOk(checkedKeys)}
                 width={"70%"} height={"90%"} bodyStyle={{overflowX: 'scroll'}}
   >
       <Button onClick={() => selectAll()} type={"primary"} style={{marginLeft: "10px"}}>Select all</Button>
       <Button onClick={() => deselectAll()} type={"primary"} style={{marginLeft: "10px"}}>Deselect all</Button>
       <Tree
           checkable
           treeData={treeData}
           titleRender={renderTitle}
           onCheck={onCheck}
           checkedKeys={checkedKeys}
           style={{marginTop: "20px"}}
       />
   </Modal>
}