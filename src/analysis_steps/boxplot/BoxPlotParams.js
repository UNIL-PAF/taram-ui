import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space, Divider, Row, Col} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {getProteinTable} from "../../protein_table/BackendProteinTable";
import ProteinTable from "../../protein_table/ProteinTable";
import {getNumCols} from "../CommonStepUtils";
import {defaultColors} from "../../common/PlotColors";

const {Option} = Select;

export default function BoxPlotParams(props) {

    const [useDefaultCol, setUseDefaultCol] = useState()
    const [showAll, setShowAll] = useState()
    const numCols = getNumCols(props.commonResult.headers)
    const proteinTable = useSelector(state => state.proteinTable.data)
    const proteinTableError = useSelector(state => state.proteinTable.error)
    const dispatch = useDispatch();
    const nrGroups = Object.values(props.experimentDetails).reduce((a, v) => {
        if(v.group && !a.includes(v.group)) {
            return a.concat(v.group)
        }
       return a
    }, []).length

    useEffect(() => {
        if(!proteinTable && !proteinTableError){
            dispatch(getProteinTable({stepId: props.stepId}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proteinTable, proteinTableError])

    useEffect(() => {
        if (!props.params) {
            props.setParams({logScale: false, groupByCondition: true, showAll: false})
            setUseDefaultCol(true)
            setShowAll(false)
        }else{
            if(useDefaultCol === undefined){
                setUseDefaultCol(!props.params.column)
            }
            if(showAll === undefined){
                setShowAll(props.params.showAll)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function handleChange(value) {
        props.setParams({...props.params, column: numCols[value]})
    }

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, column: null})
    }

    function changeUseShowAll(e){
        setShowAll(e.target.checked)
        props.setParams({...props.params, showAll: e.target.checked})
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Row>
                    <Col span={12}>
                        <h3>Select data column for Boxplot</h3>
                <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
                </Checkbox>
                <Select disabled={useDefaultCol} value={props.params.column || props.intCol} style={{width: 250}} onChange={handleChange}>
                    {numCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                    </Col>
                    <Col span={12}>
                        <h3>Show all data points</h3>
                        <Checkbox
                            onChange={changeUseShowAll} checked={showAll}><span>show all</span>
                        </Checkbox>
                        <br></br>
                        <span style={{color: "red"}}><em><strong>Attention:</strong> this might slow down the interface in datasets with many protein groups.</em></span>
                    </Col>
                </Row>
                <Divider />
                <h3>Protein table</h3>
                <ProteinTable
                    params={props.params}
                    setParams={props.setParams}
                    tableData={proteinTable}
                    paramName={"selProts"}
                    target={"prot"}
                    defaultColors={defaultColors.slice(nrGroups)}>
                </ProteinTable>
            </Space>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );
}
