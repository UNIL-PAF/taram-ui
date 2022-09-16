import React, {useEffect} from "react";
import {Checkbox, InputNumber} from 'antd';

export default function BoxPlotParams(props) {

    useEffect(() => {
        if(!props.params){
            props.setParams({
                pValThresh: 0.05,
                fcThresh: 2.0,
                useAdjustedPVal: false,
                log10PVal: true
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function checkboxChange(field, e){
        let newParams = {...props.params}
        newParams[[field]] = e.target.checked
        props.setParams(newParams)
    }

    function valueChange(field, value) {
        let newParams = {...props.params.imputationParams}
        newParams[[field]] = value
        props.setParams({...props.params, imputationParams: newParams})
    }

    function showOptions(){
        return <>
           <span style={{paddingLeft: "10px"}}>Significance threshold<InputNumber
               value={props.params.pValThresh}
               onChange={(val) => valueChange("pValThresh", val)}></InputNumber></span>
            <br></br>
            <span style={{paddingLeft: "10px"}}>Fold change threshold<InputNumber
                value={props.params.fcThresh}
                onChange={(val) => valueChange("fcThresh", val)}></InputNumber></span>
            <br></br>
            <Checkbox
                onChange={(val) => checkboxChange("useAdjustedPVal", val)} checked={props.params.useAdjustedPVal}>Use adjusted p-value
            </Checkbox>
            <br></br>
            <Checkbox
                onChange={(val) => checkboxChange("log10PVal", val)} checked={props.params.log10PVal}>Use log10(p-value)
            </Checkbox>
        </>
    }

    return (
        <>
            {props.params && showOptions()}
        </>
    );
}
