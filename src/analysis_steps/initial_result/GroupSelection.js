import React from "react";
import {Transfer, Tabs} from 'antd';
const { TabPane } = Tabs;


export default function GroupSelection(props) {
    console.log(props.data)

    const dataSource = props.data.columnMapping.experiments.map((exp, i) => {
        console.log(i)
        return {key: exp, title: exp}
    })

    const onTabSwitch = () => {
        console.log("onTabSwitch")
    }

    const add = () => {
        const {panes} = this.state;
        const activeKey = `newTab${this.newTabIndex++}`;
        const newPanes = [...panes];
        newPanes.push({title: 'New Tab', content: 'Content of new Tab', key: activeKey});
        this.setState({
            panes: newPanes,
            activeKey,
        });
    };

    return (
        <>
            <Tabs
                type="editable-card"
                onChange={onTabSwitch}
                activeKey={"pane.key"}
            >
                <TabPane tab={"pane.title"} key={"pane.key"} closable={true}>
                    <Transfer
                        dataSource={dataSource}
                        titles={['', 'Target']}
                        render={item => item.title}
                        disabled={true}
                    >
                    </Transfer>
                </TabPane>
            </Tabs>
        </>
    )
}
