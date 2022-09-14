import React from "react";
import GroupSelection from "./GroupSelection";
import {Divider} from "antd";
import ExperimentsSelection from "./ExperimentsSelection";

export default function InitialResultParams(props) {

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
                                    setGroupData={(gd) => props.setParams({
                                        expData: props.params.expData,
                                        groupData: gd
                                    })}
                    ></GroupSelection>
                </>
            }
        </>
    );
}
