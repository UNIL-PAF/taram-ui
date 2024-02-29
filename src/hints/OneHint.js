import React from "react";
import './hints.css'
import {Card} from 'antd';
import HintDoneButton from "./HintDoneButton";
import HintInfoButton from "./HintInfoButton";

export default function OneHint(props) {

    console.log(props)

    return (
        <div>
            {props.data && <Card className={"hint-card" + (props.isNext ? " hint-card-sel" : "")}
                      onClick={props.onSelect}
                      headStyle={{textAlign: 'left', backgroundColor: '#f4f0ec'}}
                      bodyStyle={{textAlign: 'left', marginLeft: '10px'}}
                >
                    <div className={"hint-done-icon"}>
                        <HintDoneButton isDone={props.data.isDone}></HintDoneButton>
                    </div>
                    <div className={"hint-info-icon"}>
                        <HintInfoButton description={props.data.description}></HintInfoButton>
                    </div>
                    <span className={"hint-name"}>{props.data.name}</span>
                </Card>
            }
        </div>
    );
}
