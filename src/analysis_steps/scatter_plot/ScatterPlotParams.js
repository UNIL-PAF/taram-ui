import React, {useEffect, useState} from "react";
import {Checkbox, Select, Space, Row, Col} from 'antd';
import ProteinTable from "../../protein_table/ProteinTable";
import {useDispatch, useSelector} from "react-redux";
import {getProteinTable} from "../../protein_table/BackendProteinTable";

const {Option} = Select;

export default function ScatterPlotParams(props) {
    const proteinTable = useSelector(state => state.proteinTable.data)
    const proteinTableError = useSelector(state => state.proteinTable.error)
    const dispatch = useDispatch();

    const [useColorBy, setUseColorBy] = useState()

    const dataCols = props.commonResult.headers.filter( h => h.type === "NUMBER").map(h => h.name)

    useEffect(() => {
        if(!proteinTable && !proteinTableError){
            dispatch(getProteinTable({stepId: props.stepId}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proteinTable, proteinTableError])

    useEffect(() => {
        if (props.params) {
            if (useColorBy === undefined) setUseColorBy(props.params.colorBy ? true : false)
        } else {
            props.setParams({xAxis: dataCols[0], yAxis: dataCols[1]})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function handleColorColChange(value) {
        props.setParams({...props.params, colorBy: dataCols[value]})
    }

    function handleAxisChangeX(value){
        props.setParams({...props.params, xAxis: dataCols[value]})
    }

    function handleAxisChangeY(value){
        props.setParams({...props.params, yAxis: dataCols[value]})
    }

    function handleCheckColorBy(e){
        setUseColorBy(e.target.checked)
        if(!e.target.checked){
            let myParams = props.params
            delete myParams.colorBy
            props.setParams(myParams)
        }
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">
                <Row>
                    <Space direction={"horizontal"}>
                        <Col><span><strong>X axis</strong></span></Col>
                        <Col><Select value={props.params.xAxis} style={{width: 250}}
                                     showSearch={true}
                                     filterOption={(input, option) =>
                                         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                     }
                                     onChange={handleAxisChangeX}>
                            {dataCols.map((n, i) => {
                                return <Option key={i} value={i}>{n}</Option>
                            })}</Select></Col>
                    </Space>
                </Row>
                <Row>
                    <Space direction={"horizontal"}>
                        <Col><span><strong>Y axis</strong></span></Col>
                        <Col><Select value={props.params.yAxis} style={{width: 250}}
                                     showSearch={true}
                                     filterOption={(input, option) =>
                                         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                     }
                                     onChange={handleAxisChangeY}>
                            {dataCols.map((n, i) => {
                                return <Option key={i} value={i}>{n}</Option>
                            })}</Select></Col>
                    </Space>
                </Row>
                <Checkbox
                    onChange={handleCheckColorBy} checked={useColorBy}>Color data points by
                </Checkbox>
                <Select disabled={!useColorBy} value={props.params.colorBy} style={{width: 250}}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleColorColChange}>
                    {dataCols.map((n, i) => {
                        return <Option key={i} value={i}>{n}</Option>
                    })}</Select>
                <h3>Protein table</h3>
                <ProteinTable params={props.params} setParams={props.setParams} tableData={proteinTable} paramName={"selProteins"} target={"prot"}></ProteinTable>
            </Space>
        </>
    }

    return (
        <>
            <h3>Select data column for Scatter plot</h3>
            {props.params && showOptions()}
        </>
    );
}
