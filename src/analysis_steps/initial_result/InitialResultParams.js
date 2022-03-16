import React, {useEffect, useState} from "react";
import GroupSelection from "./GroupSelection";
import {Divider} from "antd";
import ExperimentsSelection from "./ExperimentsSelection";

export default function InitialResultParams(props) {

    const [expData, setExpData] = useState()

    useEffect(() => {
        const colMapping = props.data.columnMapping

        setExpData(colMapping.experimentNames.map((e) => {
            const exp = colMapping.experimentDetails[e]
            return {
                name: exp.name,
                fileName: exp.fileName, key: exp.originalName, isSelected: exp.isSelected
            }
        }))
    }, [props])

    const onExpSelection = (selRowKeys) => {
        const newExpData = expData.map((exp) => {return {...exp, isSelected: selRowKeys.includes(exp.key)}})
        setExpData(newExpData)
    }

    return (
        <>
            <h3>Experiments</h3>
            <ExperimentsSelection data={expData} onExpSelection={onExpSelection}></ExperimentsSelection>
            <Divider/>
            <h3>Group selection</h3>
            <GroupSelection analysisIdx={props.analysisIdx}
                            data={expData}></GroupSelection>
        </>
    );
}
