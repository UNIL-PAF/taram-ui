import React, {useEffect} from "react";
import {Input, Select} from 'antd';

const {Option} = Select;

export default function RenderCharParams(props) {

    useEffect(() => {
        if (!props.params.charColParams) {
            props.setParams({...props.params, charColParams: {charComp: "matches", strVal: ""}})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.params])

    const onChangeStr = (v) => {
        props.setParams({...props.params, charColParams: {...props.params.charColParams, strVal: v}})
    }

    const changeSel = (v) => {
        props.setParams({...props.params, charColParams: {...props.params.charColParams, charComp: v}})
    }

    return <>
        {props.params.charColParams && <div>
            <span>New column will have a [+] if [<em>{props.selColumn}</em>]
                <Select size={"small"} style={{width: 150}} onChange={changeSel}
                        value={props.params.charColParams.charComp}>
                    <Option key={"matches"} value={"matches"}>{"matches"}</Option>
                    <Option key={"matches-not"} value={"matches-not"}>{"matches not"}</Option>
                </Select>
            </span>
            <Input
                style={{width: "150px"}}
                onChange={(e) => onChangeStr(e.target.value)}
                value={props.params.charColParams.strVal}
            />
        </div>}
    </>
}
