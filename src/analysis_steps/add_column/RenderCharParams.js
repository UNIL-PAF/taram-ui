import React, {useEffect} from "react";
import {Input, Select} from 'antd';

const {Option} = Select;

export default function RenderCharParams(props) {

    useEffect(() => {
        if (!props.params.charColParams) {
            props.setParams({...props.params, charColParams: {compOp: "matches", compVal: "", compSel: "any"}})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params])

    const onChangeStr = (v) => {
        props.setParams({...props.params, charColParams: {...props.params.charColParams, compVal: v}})
    }

    const changeSel = (v) => {
        props.setParams({...props.params, charColParams: {...props.params.charColParams, compSel: v}})
    }

    const changeOp = (v) => {
        props.setParams({...props.params, charColParams: {...props.params.charColParams, compOp: v}})
    }

    return <>
        {props.params.charColParams && <div>
            <span>New column will have a [+] if
                <Select size={"small"} style={{width: 150}} onChange={changeSel}
                        value={props.params.charColParams.compSel}>
                    <Option key={"any"} value={"any"}>{"any"}</Option>
                    <Option key={"all"} value={"all"}>{"all"}</Option>
                </Select>

                of the selected columns

                <Select size={"small"} style={{width: 150}} onChange={changeOp}
                        value={props.params.charColParams.compOp}>
                    <Option key={"matches"} value={"matches"}>{"matches"}</Option>
                    <Option key={"matches-not"} value={"matches-not"}>{"matches not"}</Option>
                </Select>
            </span>
            <Input
                style={{width: "150px"}}
                onChange={(e) => onChangeStr(e.target.value)}
                value={props.params.charColParams.compVal}
            />
        </div>}
    </>
}
