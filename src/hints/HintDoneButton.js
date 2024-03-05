import React from "react";
import './hints.css'
import {Button} from 'antd';
import {CheckCircleTwoTone} from "@ant-design/icons";
import axios from "axios";
import globalConfig from "../globalConfig";
import {fetchAnalysisByResultId} from "../analysis/BackendAnalysis";
import {useDispatch} from "react-redux";

export default function HintDoneButton(props) {

    const dispatch = useDispatch();
    const doneColor = "#52c41a"
    const todoColor = "#ececec"

    const currColor = props.isDone === true ? doneColor : todoColor

    const clickButton = () => {
        axios.put(globalConfig.urlBackend + 'hints/switch-done/' + props.hintId + '/result-id/' + props.resultId)
            .then((response) => {
                dispatch(fetchAnalysisByResultId(props.resultId))
            })
            .catch(function (error) {
                console.log("error", error)
            })
    }

    return (
        <>
            <Button type={"text"} shape="circle"
                    onClick={clickButton}
                    icon={<CheckCircleTwoTone style={{fontSize: "large"}} twoToneColor={currColor}/>}/>
        </>
    );
}
