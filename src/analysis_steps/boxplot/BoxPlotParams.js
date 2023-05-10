import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space, Divider} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {getProteinTable} from "../../protein_table/BackendProteinTable";
import ProteinTable from "../../protein_table/ProteinTable";
import {getNumCols} from "../CommonStep";

const {Option} = Select;

export default function BoxPlotParams(props) {

    const [useDefaultCol, setUseDefaultCol] = useState()
    const numCols = getNumCols(props.commonResult.headers)
    const proteinTable = useSelector(state => state.proteinTable.data)
    const proteinTableError = useSelector(state => state.proteinTable.error)
    const dispatch = useDispatch();

    useEffect(() => {
        if(!proteinTable && !proteinTableError){
            dispatch(getProteinTable({stepId: props.stepId}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proteinTable, proteinTableError])

    useEffect(() => {
        if (!props.params) {
            props.setParams({logScale: props.commonResult.intColIsLog ? false : true})
            setUseDefaultCol(true)
        }else{
            if(useDefaultCol === undefined){
                setUseDefaultCol(props.params.column ? false: true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function checkboxChange(e) {
        props.setParams({...props.params, logScale: e.target.checked})
    }

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, column: null})
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.column || props.intCol} style={{width: 250}} onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                <Checkbox
                    onChange={checkboxChange} checked={props.params.logScale}>Use logarithmic scale (log2)
                </Checkbox>
                <Divider />
                <h3>Protein table</h3>
                <ProteinTable params={props.params} setParams={props.setParams} tableData={proteinTable}></ProteinTable>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select data column for Boxplot</h3>
            {props.params && showOptions()}
        </>
    );
}
