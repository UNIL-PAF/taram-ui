import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space} from 'antd';
import {getNumCols} from "../CommonStepUtils";

const {Option} = Select;

export default function SummaryStatParams(props) {

    const numCols = getNumCols(props.commonResult.headers)
    const intColName = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()
    const [orderByGroups, setOrderByGroups] = useState()

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                intCol: intColName,
                orderByGroups: true
            })
            setUseDefaultCol(true)
            setOrderByGroups(true)
        } else {
            if (useDefaultCol === undefined) {
                setUseDefaultCol(props.params.inCol ? false : true)
            }
            if(orderByGroups === undefined){
                setOrderByGroups(props.params.orderByGroups)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol, orderByGroups])

    function handleChange(value) {
        props.setParams({...props.params, intCol: numCols[value]})
    }

    function changeUseDefaultCol(e) {
        setUseDefaultCol(e.target.checked)
        if (e.target.checked) props.setParams({...props.params, intCol: null})
    }

    function changeOrderByGroups(e) {
        setOrderByGroups(e.target.checked)
        props.setParams({...props.params, orderByGroups: e.target.checked})
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.intCol || props.intCol} style={{width: 250}}
                        onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}
                </Select>
                <Checkbox
                    onChange={changeOrderByGroups} checked={orderByGroups}>Order experiments by groups
                </Checkbox>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select value</h3>
            {props.params && showOptions()}
        </>
    );
}
