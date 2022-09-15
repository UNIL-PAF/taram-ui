import React, {useEffect} from "react";
import {InputNumber, Select} from 'antd';

const {Option} = Select;

export default function TTestParams(props) {

    const numCols = props.commonResult.numericalColumns
    const intCol = props.commonResult.intCol

    useEffect(() => {
        if(!props.params){
            props.setParams({
                field: intCol,
                multiTestCorr: 'BH',
                signThres: 0.05
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

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
            <span>
            <span style={{paddingRight: "10px"}}>Compute t-test based on </span>
            <Select
                value={props.params.field} style={{width: 250}} onChange={handleChange}>
                {numCols.map((n, i) => {
                    return <Option key={i} value={i}>{n}</Option>
                })}
            </Select>
        </span>
            <br/>
            <br/>
            <span>
            <span style={{paddingRight: "10px"}}>Significance threshold</span>
            <InputNumber
                value={props.params.signThres}
                onChange={(val) => valueChange("signThres", val)}></InputNumber>
        </span>
            <br/>
            <br/>
            <span>
            <span style={{paddingRight: "10px"}}>Multiple testing correction</span>
            <Select value={props.params.multiTestCorr} style={{width: 250}} onChange={filterInGroupChange}>
                <Option value={'BH'}>Benjamini & Hochberg (FDR)</Option>
                <Option value={'bonferroni'}>Bonferroni</Option>
            </Select>
        </span>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );

}
