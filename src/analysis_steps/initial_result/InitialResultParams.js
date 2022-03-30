import React, {useEffect, useState} from "react";
import GroupSelection from "./GroupSelection";
import {Divider} from "antd";
import ExperimentsSelection from "./ExperimentsSelection";
import {useDispatch, useSelector} from "react-redux";
import {setData} from "../analysisStepParamsSlice";

export default function InitialResultParams(props) {

    const [expData, setExpData] = useState()
    const dispatch = useDispatch();
    const data = useSelector((state) => state.analysisStepParams.data)

    useEffect(() => {
        const colMapping = props.data.columnInfo.columnMapping

        const expData = colMapping.experimentNames.map((e) => {
            const exp = colMapping.experimentDetails[e]
            return {
                name: exp.name,
                fileName: exp.fileName, key: exp.originalName, isSelected: exp.isSelected
            }
        })

        dispatch(setData({expData: expData}))
    }, [props])

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
        dispatch(setData({...data, expData: newExpData}))
    }

    return (
        <>
            <h3>Experiments</h3>
            {data &&
                <>
                <ExperimentsSelection data={data.expData} onChangeExpName={onChangeExpName}
                                           onExpSelection={onExpSelection}></ExperimentsSelection>
                <Divider/>
                <h3>Group selection</h3>
                <GroupSelection data={data.expData}></GroupSelection>
                </>
            }
        </>
    );
}
