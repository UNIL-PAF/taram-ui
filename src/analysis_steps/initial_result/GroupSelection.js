import React, {useState} from "react";
import {Transfer, Tabs} from 'antd';
import GroupNameInput from "./GroupNameInput";

const {TabPane} = Tabs;

export default function GroupSelection(props) {
    const [tabs, setTabs] = useState([{name: "Condition", alreadySet: false}])
    const [selectedSources, setSelectedSources] = useState([])

    const dataSource = props.data.columnMapping.experiments.map((exp) => {
        return {key: exp, title: exp}
    })

    const onTabSwitch = () => {
        console.log("onTabSwitch")
    }

    const addTab = () => {
        setTabs(tabs.concat({name: "Condition", alreadySet: false}))
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
                return {name: newVal, alreadySet: true}
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
                {renderTransfer(tabObj)}
            </TabPane>
        )
    }

    const renderTransfer = (tabObj) => {
        return <Transfer
            dataSource={dataSource}
            titles={['', tabObj.name]}
            render={item => item.title}
            disabled={true}
            listStyle={{width: 450}}
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
                {tabs.map((t, i) => {
                    return renderTab(t, i)
                })}
            </Tabs>
        </>
    )
}
