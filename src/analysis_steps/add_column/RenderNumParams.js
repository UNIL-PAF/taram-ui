import React, {useEffect} from "react";
import {Checkbox, Select} from 'antd';

const {Option} = Select;

export default function RenderNumParams(props) {

    useEffect(() => {
        if (!props.params.numColParams) {
            props.setParams({...props.params, numColParams: {mathOp: "min", removeNaN: true}})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params])

    const changeSel = (v) => {
        props.setParams({...props.params, numColParams: {...props.params.numColParams, mathOp: v}})
    }

    const changeRemoveNaN = (e) => {
        console.log(e)
        props.setParams({...props.params, numColParams: {...props.params.numColParams, removeNaN: e.target.checked}})
    }

    return <>
        {props.params.numColParams && <div>
            <span>Compute
                <Select size={"small"} style={{width: 150}} onChange={changeSel}
                        value={props.params.numColParams.mathOp}>
                    <Option key={"min"} value={"min"}>{"min"}</Option>
                    <Option key={"max"} value={"max"}>{"max"}</Option>
                    <Option key={"mean"} value={"mean"}>{"mean"}</Option>
                    <Option key={"sum"} value={"sum"}>{"sum"}</Option>
                </Select>
            </span>
            <span>
            <Checkbox
                onChange={(e) => changeRemoveNaN(e)}
                checked={props.params.numColParams.removeNaN}
            >Remove NaN values
            </Checkbox>
            </span>
        </div>}
    </>
}
