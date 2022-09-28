import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';

const {Option} = Select;

export default function TTestParams(props) {

    const numCols = props.commonResult.numericalColumns
    const intCol = props.commonResult.intCol
    const [useDefaultCol, setUseDefaultCol] = useState()

    useEffect(() => {
        if(!props.params){
            props.setParams({
                field: intCol,
                multiTestCorr: 'BH',
                signThres: 0.05
            })
            setUseDefaultCol(true)
        }else{
        if(useDefaultCol === undefined){
            setUseDefaultCol(props.params.field ? false: true)
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, useDefaultCol])

    function changeUseDefaultCol(e){
        setUseDefaultCol(e.target.checked)
        if(e.target.checked) props.setParams({...props.params, field: null})
    }

    function handleChange(value) {
        props.setParams({...props.params, field: numCols[value]})
    }

    function valueChange(field, value) {
        let newParams = {...props.params}
        newParams[[field]] = value
        props.setParams(newParams)
    }

    function filterInGroupChange(value) {
        props.setParams({...props.params, filterInGroup: value})
    }

    function showOptions(){
        return <>
            <Space direction="vertical" size="middle">
            <Checkbox
                    onChange={changeUseDefaultCol} checked={useDefaultCol}>Use default intensity values [{props.intCol}]
            </Checkbox>
            <Select
                disabled={useDefaultCol}
                value={props.params.field || props.intCol} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
            <span>
            <span style={{paddingRight: "10px"}}>Significance threshold</span>
            <InputNumber
                value={props.params.signThres}
                onChange={(val) => valueChange("signThres", val)}></InputNumber>
        </span>
            <span>
            <span style={{paddingRight: "10px"}}>Multiple testing correction</span>
            <Select value={props.params.multiTestCorr} style={{width: 250}} onChange={filterInGroupChange}>
                <Option value={'BH'}>Benjamini & Hochberg (FDR)</Option>
                <Option value={'bonferroni'}>Bonferroni</Option>
            </Select>
        </span>
            </Space>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );

}
