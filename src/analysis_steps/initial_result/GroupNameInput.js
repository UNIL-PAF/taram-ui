import React, {useEffect, useState} from "react";
import {Input} from 'antd';


export default function GroupNameInput(props) {
    const placeholder = "Condition"

    const [inputVal, setInputVal] = useState();

    useEffect(() => {
        if(props.name) setInputVal(props.name)
    }, [props])

    const onChange = (newInputVal) => {
        setInputVal(newInputVal)
    }

    const keyPressed = (e) => {
        e.stopPropagation()
        if (e.keyCode === 13) {
            e.preventDefault()
            acceptInputName()
        }
    }

    const acceptInputName = () => {
        props.onChange(inputVal, props.idx)
    }

    const renderName = () => {
        if (props.alreadySet) {
            return (<span>{inputVal}</span>)
        } else {
            return (<Input
                    placeholder={placeholder}
                    onBlur={() => acceptInputName()}
                    onKeyDown={(e) => keyPressed(e)}
                    onChange={(e) => onChange(e.target.value)}
                    defaultValue={inputVal}
                />
            )
        }
    }

    return (
        <>
            {renderName()}
        </>
    )
}
