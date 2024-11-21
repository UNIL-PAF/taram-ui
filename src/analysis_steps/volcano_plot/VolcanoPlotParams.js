import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space, Switch, Divider} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {getProteinTable} from "../../protein_table/BackendProteinTable";
import ProteinTable from "../../protein_table/ProteinTable";

const {Option} = Select;

export default function VolcanoPlotParams(props) {
    const proteinTable = useSelector(state => state.proteinTable.data)
    const proteinTableError = useSelector(state => state.proteinTable.error)
    const dispatch = useDispatch();

    const [selComp, setSelComp] = useState(0)
    const comparison = props.commonResult.headers.filter( h => h.name.match("^p.value")).map( h => h.experiment.comp)

    useEffect(() => {
        if(!proteinTable && !proteinTableError){
            dispatch(getProteinTable({stepId: props.stepId}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proteinTable, proteinTableError])

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                pValThresh: 0.05,
                fcThresh: 2.0,
                useAdjustedPVal: false,
                log10PVal: true,
                comparison: comparison[0],
                showQVal: true
            })
        }else if(props.params.comparison && selComp === 0){
            const c = props.params.comparison
            const compIdx = comparison.reduce((acc, v, i) => {
                if(c.group1 === v.group1 && c.group2 === v.group2) return i
                else return acc
                    }, undefined)

            if(typeof(compIdx) === "undefined"){
                props.setParams({...props.params, comparison: comparison[0]})
                setSelComp(0)
            }else setSelComp(compIdx)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function checkboxChange(field, e) {
        let newParams = {...props.params}
        newParams[[field]] = e.target.checked
        props.setParams(newParams)
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function handleChange(index) {
        let newParams = {...props.params, comparison: comparison[index]}
        props.setParams(newParams)
        setSelComp(index)
    }

    function changeSwitch(val){
        let newParams = {...props.params, useAdjustedPVal: val}
        props.setParams(newParams)
    }

    function fcText(){
        return props.commonResult.intColIsLog ? "log2 " : ""
    }

    function selValText(){
        return props.params.useAdjustedPVal ? "adj. p-values" : "p-values"
    }

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">

                <span style={{paddingLeft: "10px"}}>Select comparision &nbsp;<Select value={selComp}
                                                                                     style={{width: 400}}
                                                                                     onChange={handleChange}>
                    {comparison.map((comp, i) => {
                        const name = comp.group1 + " - " + comp.group2
                        return <Option key={i} value={i}>{name}</Option>
                    })}</Select></span>
                <span style={{paddingLeft: "10px"}}>Significance threshold &nbsp;<InputNumber
                    value={props.params.pValThresh}
                    onChange={(val) => valueChange("pValThresh", val)}></InputNumber></span>
                <span style={{paddingLeft: "10px"}}>Absolute {fcText()}fold change threshold &nbsp;<InputNumber
                    value={props.params.fcThresh}
                    onChange={(val) => valueChange("fcThresh", val)}></InputNumber></span>
                <span>Use &nbsp;
                    <Switch onChange={(val) => changeSwitch(val)} checkedChildren="q-values" unCheckedChildren="p-values" checked={props.params.useAdjustedPVal} />
                    &nbsp;on the y-axis.
                </span>
                <Checkbox
                    disabled={props.params.useAdjustedPVal}
                    onChange={(val) => checkboxChange("showQVal", val)} checked={props.params.showQVal}>
                    Show significant adjusted p-values above the selected absolute {fcText()} fold change with a different color.
                </Checkbox>
                <Checkbox
                    onChange={(val) => checkboxChange("log10PVal", val)} checked={props.params.log10PVal}>Use
                    -log10 {selValText()} on the y-axis.
                </Checkbox>
                <Divider />
                <h3>Protein table</h3>
                <ProteinTable params={props.params} setParams={props.setParams} tableData={proteinTable} paramName={"selProteins"} target={"prot"}></ProteinTable>
            </Space>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );
}
