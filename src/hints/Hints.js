import React from "react";
import './hints.css'
import OneHint from "./OneHint";

export default function Hints(props) {
    return (
        <div>
            {props.data && <div className={"hints-box"}>
                {
                    props.data.hintList.map(a => {
                        return <OneHint key={a.id} isNext={props.data.nextHintId === a.id} data={a}></OneHint>
                    })
                }
            </div>
            }
        </div>
    );
}
