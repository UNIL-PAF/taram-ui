import React, {useEffect} from "react";
import {Select} from 'antd';

const {Option} = Select;

export default function RenderNumExpParams(props) {

    useEffect(() => {
        if (!props.params.numExpColParams) {
            props.setParams({...props.params, numExpColParams: {mathOp: "min"}})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params])

    const changeSel = (v) => {
        props.setParams({...props.params, numExpColParams: {...props.params.numExpColParams, mathOp: v}})
    }

    return <>
        {props.params.numExpColParams && <div>
            <span>Compute
                <Select size={"small"} style={{width: 150}} onChange={changeSel}
                        value={props.params.charColParams.charComp}>
                    <Option key={"min"} value={"min"}>{"min"}</Option>
                    <Option key={"max"} value={"max"}>{"max"}</Option>
                    <Option key={"mean"} value={"mean"}>{"mean"}</Option>
                    <Option key={"sum"} value={"sum"}>{"sum"}</Option>
                </Select>
            </span>
        </div>}
    </>
}
