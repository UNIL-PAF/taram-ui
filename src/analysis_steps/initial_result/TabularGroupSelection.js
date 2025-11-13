import React, {useEffect, useState} from "react";
import { Input } from 'antd';
const { TextArea } = Input;

export default function TabularGroupSelection(props) {

    const [text, setText] = useState("")

    useEffect(() => {
        const initialTxt = perpareTable(props.params)
        setText(initialTxt)
        props.setParams({...props.params, tabTxt: initialTxt})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const changeText = (text) => {
        setText(text)
        props.setParams({...props.params, tabTxt: text})
    }

    const perpareTable = (params) => {
        return params.groupsOrdered.concat(["experiments"]).flatMap( group =>
            params.groupData[group].items.map(item => item.name
                + "\t"
                + (group === "experiments" ? "" : group.replace(/^\d+-/, "")))
        ).join("\n")
    }

    return (
        <>
            <br></br>
            <br></br>
            <TextArea
                rows={24}
                value={text}
                onChange={e => {
                    changeText(e.target.value)
                }}
            >
            </TextArea>
        </>
    )

}
