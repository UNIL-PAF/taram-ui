import React, {useState} from "react";
import {Transfer, Tabs} from 'antd';
import GroupNameInput from "./GroupNameInput";

const {TabPane} = Tabs;

export default function GroupSelection(props) {
    const [selectedKeys, setSelectedKeys] = useState([])

    const getRemainingDataSource = (targetKeys, selKeys) => {
        return props.expData.map((exp) => {
            return {key: exp.key, title: exp.name, disabled: (! targetKeys.includes(exp.key)) && selKeys.includes(exp.key)}
        })
    }

    const addTab = () => {
        const newTabs = props.groupData.concat({
            name: "Condition",
            alreadySet: false,
            targetKeys: [],
            dataSource: getRemainingDataSource([], selectedKeys)
        })
        props.setGroupData(newTabs)
    };

    const removeTab = (tabKey) => {
        const tabIdx = Number(tabKey)
        const newTabs = props.groupData.filter((t, i) => {
            return i !== tabIdx
        })
        props.setGroupData(newTabs)
    }

    const onEdit = (targetKey, action) => {
        if (action === "add") {
            addTab()
        } else if (action === "remove") {
            removeTab(targetKey)
        }
    };

    const onInputChange = (newVal, idx) => {
        let newTabs = props.groupData.map((t, i) => {
            if (i === idx) {
                return {...t, name: newVal, alreadySet: true}
            } else {
                return t
            }
        })
        props.setGroupData(newTabs)
    }

    const renderTab = (tabObj, i) => {
        return (
            <TabPane
                tab={<GroupNameInput onChange={onInputChange} alreadySet={tabObj.alreadySet} idx={i}/>}
                key={i.toString()} closable={true}>
                <span>{tabObj.name}</span>
                {renderTransfer(tabObj)}
            </TabPane>
        )
    }

    const somethingIsTransfered = (nextTargetKeys, tabObj) => {
        const selKeys = nextTargetKeys.concat(selectedKeys)
        setSelectedKeys(selKeys)

        let newTabs = props.groupData.map((t) => {
            if (t.name === tabObj.name) {
                return {...t, targetKeys: nextTargetKeys}
            } else {
                return {...t, dataSource: getRemainingDataSource(t.targetKeys, selKeys)}
            }
        })
        props.setGroupData(newTabs)
    }

    const renderTransfer = (tabObj) => {
        return <Transfer
            dataSource={tabObj.dataSource}
            titles={['', tabObj.name]}
            render={item => item.title}
            disabled={!tabObj.alreadySet}
            targetKeys={tabObj.targetKeys}
            listStyle={{width: 450}}
            onChange={(nextnextTargetKeys) => somethingIsTransfered(nextnextTargetKeys, tabObj)}
        >
        </Transfer>
    }

    return (
        <>
            <Tabs
                type="editable-card"
                onEdit={onEdit}
            >
                {props.groupData && props.groupData.map((t, i) => {
                    return renderTab(t, i)
                })}
            </Tabs>
        </>
    )
}
