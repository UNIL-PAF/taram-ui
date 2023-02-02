import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';

const {Option} = Select;

export default function BoxPlotParams(props) {

    const [selComp, setSelComp] = useState(0)
    const comparison = props.commonResult.headers.filter( h => h.name.includes("p.value")).map( h => h.experiment.comp)

    useEffect(() => {
        if (!props.params) {
            props.setParams({
                pValThresh: 0.05,
                fcThresh: 2.0,
                useAdjustedPVal: false,
                log10PVal: true,
                comparison: comparison[0]
            })
        }else if(props.params.comparison && selComp === 0){
            const c = props.params.comparison
            const compIdx = comparison.reduce((acc, v, i) => {
                if(c.group1 === v.group1 && c.group2 === v.group2) return i
                else return acc
                    }, 0)
            setSelComp(compIdx)
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

    function showOptions() {
        return <>
            <Space direction="vertical" size="middle">

                <span style={{paddingLeft: "10px"}}>Select comparision &nbsp;<Select value={selComp}
                                                                                     style={{width: 250}}
                                                                                     onChange={handleChange}>
                    {comparison.map((comp, i) => {
                        const name = comp.group1 + " - " + comp.group2
                        return <Option key={i} value={i}>{name}</Option>
                    })}</Select></span>
                <span style={{paddingLeft: "10px"}}>Significance threshold &nbsp;<InputNumber
                    value={props.params.pValThresh}
                    onChange={(val) => valueChange("pValThresh", val)}></InputNumber></span>
                <br></br>
                <span style={{paddingLeft: "10px"}}>Fold change threshold &nbsp;<InputNumber
                    value={props.params.fcThresh}
                    onChange={(val) => valueChange("fcThresh", val)}></InputNumber></span>
                <br></br>
                <Checkbox
                    onChange={(val) => checkboxChange("useAdjustedPVal", val)} checked={props.params.useAdjustedPVal}>Use
                    adjusted p-value
                </Checkbox>
                <br></br>
                <Checkbox
                    onChange={(val) => checkboxChange("log10PVal", val)} checked={props.params.log10PVal}>Use
                    log10(p-value)
                </Checkbox>
            </Space>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );
}
