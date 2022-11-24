import React, {useEffect, useState} from "react";
import {Checkbox, InputNumber, Select, Space} from 'antd';

const {Option} = Select;

export default function RemoveImputedParams(props) {

    const [replaceBy, setReplaceBy] = useState('nan')

    useEffect(() => {
        if(!props.params) {
            props.setParams({replaceBy: "nan"})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function handleChange(value) {
        console.log(value)
        setReplaceBy(value)
        props.setParams({...props.params, replaceBy: value})
    }

    return (
        <>
            <h3>Select value to transform</h3>
            <h3>Transformation</h3>
            <Select value={replaceBy} style={{width: 150}} onChange={handleChange}>
                <Option value={'nan'}>NA</Option>
                <Option value={'zero'}>0</Option>
            </Select>
        </>
    );
}
