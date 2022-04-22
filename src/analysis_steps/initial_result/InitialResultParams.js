import React, {useEffect} from "react";
import GroupSelection from "./GroupSelection";
import {Divider} from "antd";
import ExperimentsSelection from "./ExperimentsSelection";
import {useDispatch, useSelector} from "react-redux";
import {setData} from "../analysisStepParamsSlice";

export default function InitialResultParams(props) {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.analysisStepParams.data)

    useEffect(() => {
        if(! data){
            const colMapping = props.data.columnInfo.columnMapping

            const expData = colMapping.experimentNames.map((e) => {
                const exp = colMapping.experimentDetails[e]
                return {
                    name: exp.name,
                    fileName: exp.fileName,
                    originalName: exp.originalName,
                    key: e,
                    isSelected: exp.isSelected
                }
            })

            const groupData = [{
                name: "Condition",
                alreadySet: false,
                targetKeys: [],
                dataSource: expData.map((exp) => {
                    return {key: exp.key, title: exp.name, disabled: !exp.isSelected}
                })
            }]

            dispatch(setData({expData: expData, groupData: groupData}))
        }
    }, [props, data, dispatch])

    const onExpSelection = (selRowKeys) => {
        const newExpData = data.expData.map((exp) => {
            return {...exp, isSelected: selRowKeys.includes(exp.key)}
        })
        dispatch(setData({...data, expData: newExpData}))
    }

    const onChangeExpName = (row) => {
        const newExpData = data.expData.map(exp => {
            if (exp.key === row.key) {
                return {...exp, name: row.name}
            } else {
                return exp
            }
        })
        const newGroupData = data.groupData.map(tab => {
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
        dispatch(setData({groupData: newGroupData, expData: newExpData}))
    }

    return (
        <>
            <h3>Experiments</h3>
            {data &&
                <>
                    <ExperimentsSelection onChangeExpName={onChangeExpName}
                                          onExpSelection={onExpSelection}></ExperimentsSelection>
                    <Divider/>
                    <h3>Group selection</h3>
                    <GroupSelection></GroupSelection>
                </>
            }
        </>
    );
}
