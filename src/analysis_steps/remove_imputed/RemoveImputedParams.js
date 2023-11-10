import React, {useEffect} from "react";
import {Select} from 'antd';

const {Option} = Select;

export default function RemoveImputedParams(props) {

    useEffect(() => {
        if(!props.params) {
            props.setParams({replaceBy: "nan"})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function handleChange(value) {
        props.setParams({...props.params, replaceBy: value})
    }

    return (
        <>
            <h3>Replace imputed values by</h3>
            {props.params && props.params.replaceBy && <Select value={props.params.replaceBy} style={{width: 150}} onChange={handleChange}>
                <Option value={'nan'}>NaN</Option>
                <Option value={'zero'}>0</Option>
            </Select>}
        </>
    );
}
