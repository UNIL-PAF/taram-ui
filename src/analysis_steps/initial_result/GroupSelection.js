import React, {useState} from "react";
import {Transfer, Tabs} from 'antd';
import GroupNameInput from "./GroupNameInput";
import {useDispatch, useSelector} from "react-redux";
import {setData} from "../analysisStepParamsSlice";

const {TabPane} = Tabs;

export default function GroupSelection(props) {
    const data = useSelector((state) => state.analysisStepParams.data)
    const dispatch = useDispatch();
    const [selectedKeys, setSelectedKeys] = useState([])

    const getRemainingDataSource = (targetKeys, selKeys) => {
        return data.expData.map((exp) => {
            return {key: exp.key, title: exp.name, disabled: (! targetKeys.includes(exp.key)) && selKeys.includes(exp.key)}
        })
    }

    const addTab = () => {
        const newTabs = data.groupData.concat({
            name: "Condition",
            alreadySet: false,
            targetKeys: [],
            dataSource: getRemainingDataSource([], selectedKeys)
        })
        dispatch(setData({...data, groupData: newTabs}))
    };

    const removeTab = (tabKey) => {
        const tabIdx = Number(tabKey)
        const newTabs = data.groupData.filter((t, i) => {
            return i !== tabIdx
        })
        dispatch(setData({...data, groupData: newTabs}))
    }

    const onEdit = (targetKey, action) => {
        if (action === "add") {
            addTab()
        } else if (action === "remove") {
            removeTab(targetKey)
        }
    };

    const onInputChange = (newVal, idx) => {
        let newTabs = data.groupData.map((t, i) => {
            if (i === idx) {
                return {...t, name: newVal, alreadySet: true}
            } else {
                return t
            }
        })
        dispatch(setData({...data, groupData: newTabs}))
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

        let newTabs = data.groupData.map((t) => {
            if (t.name === tabObj.name) {
                return {...t, targetKeys: nextTargetKeys}
            } else {
                return {...t, dataSource: getRemainingDataSource(t.targetKeys, selKeys)}
            }
        })
        dispatch(setData({...data, groupData: newTabs}))
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
                {data && data.groupData.map((t, i) => {
                    return renderTab(t, i)
                })}
            </Tabs>
        </>
    )
}
