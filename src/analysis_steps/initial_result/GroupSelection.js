import React, {useState, useEffect} from "react";
import {Transfer, Tabs} from 'antd';
import GroupNameInput from "./GroupNameInput";

const {TabPane} = Tabs;

export default function GroupSelection(props) {
    const [tabs, setTabs] = useState()

    useEffect(() => {
        setTabs([{
            name: "Condition",
            alreadySet: false,
            targetKeys: [],
            dataSource: props.data.columnMapping.experiments.map((exp) => {
                return {key: exp, title: exp}
            })
        }]);
    }, [props])

    const [selectedKeys, setSelectedKeys] = useState([])

    const getRemainingDataSource = (targetKeys, selKeys) => {
        return props.data.columnMapping.experiments.map((exp) => {
            return {key: exp, title: exp, disabled: (! targetKeys.includes(exp)) && selKeys.includes(exp)}
        })
    }

    const onTabSwitch = () => {
        console.log("onTabSwitch")
    }

    const addTab = () => {
        setTabs(tabs.concat({
            name: "Condition",
            alreadySet: false,
            targetKeys: [],
            dataSource: getRemainingDataSource([], selectedKeys)
        }))
    };

    const removeTab = (tabKey) => {
        const tabIdx = Number(tabKey)
        const newTabs = tabs.filter((t, i) => {
            return i !== tabIdx
        })
        setTabs(newTabs)
    }

    const onEdit = (targetKey, action) => {
        if (action === "add") {
            addTab()
        } else if (action === "remove") {
            removeTab(targetKey)
        }
    };

    const onInputChange = (newVal, idx) => {
        let newTabs = tabs.map((t, i) => {
            if (i === idx) {
                return {...t, name: newVal, alreadySet: true}
            } else {
                return t
            }
        })
        setTabs(newTabs)
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

        let newTabs = tabs.map((t) => {
            if (t.name === tabObj.name) {
                return {...t, targetKeys: nextTargetKeys}
            } else {
                return {...t, dataSource: getRemainingDataSource(t.targetKeys, selKeys)}
            }
        })

        setTabs(newTabs)
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
                onChange={onTabSwitch}
                onEdit={onEdit}
            >
                {tabs && tabs.map((t, i) => {
                    return renderTab(t, i)
                })}
            </Tabs>
        </>
    )
}
