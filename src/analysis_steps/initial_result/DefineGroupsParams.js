import React from "react";
import GroupSelection from "./GroupSelection";
import {Divider, Select} from "antd";
import ExperimentsSelection from "./ExperimentsSelection";

const {Option} = Select;

export default function DefineGroupsParams(props) {

    const numCols = props.commonResult.numericalColumns

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    const onExpSelection = (selRowKeys) => {
        const newExpData = props.params.expData.map((exp) => {
            return {...exp, isSelected: selRowKeys.includes(exp.key)}
        })
        props.setParams({...props.params, expData: newExpData})
    }

    const onChangeExpName = (row) => {
        const newExpData = props.params.expData.map(exp => {
            if (exp.key === row.key) {
                return {...exp, name: row.name}
            } else {
                return exp
            }
        })
        const newGroupData = props.params.groupData.map(tab => {
            return {
                ...tab, dataSource: tab.dataSource.map(d => {
                    if (d.key === row.key) {
                        return {...d, title: row.name}
                    } else {
                        return d
                    }
                })
            }

        })
        props.setParams({groupData: newGroupData, expData: newExpData})
    }

    return (
        <>
            <h3>Default intensity column</h3>
            <Select value={props.params.column} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}</Select>
            <Divider/>
            <h3>Experiments</h3>
            {props.params &&
                <>
                    <ExperimentsSelection onChangeExpName={onChangeExpName}
                                          onExpSelection={onExpSelection}
                                          expData={props.params.expData}
                    ></ExperimentsSelection>
                    <Divider/>
                    <h3>Group selection</h3>
                    <GroupSelection groupData={props.params.groupData}
                                    expData={props.params.expData}
                                    setGroupData={(gd) => props.setParams({...props.params,
                                        groupData: gd
                                    })}
                    ></GroupSelection>
                </>
            }
        </>
    );
}
