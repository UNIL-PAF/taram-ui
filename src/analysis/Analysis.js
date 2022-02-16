import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import './analysis.css'
import {message, Collapse, Alert} from 'antd';
import {fetchAnalysisByResultId} from "./BackendAnalysis";
import {useDispatch, useSelector} from 'react-redux';
import {addCol} from "./analysisSlice";

const { Panel } = Collapse;

export default function Analysis() {
    const dispatch = useDispatch();
    const params = useParams();
    const analysisStatus = useSelector(state => state.analysis.status)
    const analysisData = useSelector(state => state.analysis.data)
    const analysisError = useSelector(state => state.analysis.error)

    console.log(analysisStatus)

    const cols = useSelector(state => state.analysis.cols)
    let hideLoading;

    useEffect(() => {
        if (analysisStatus === 'idle') {
            dispatch(fetchAnalysisByResultId(params.resultId))
            message.config({top: 60})
        }else if(analysisStatus === 'loading'){
            hideLoading = message.loading("Loading data", 0)
        }else{
            message.destroy(hideLoading)
        }
    }, [analysisStatus, dispatch, params.resultId])

    return (
        <div>
            { analysisError && <Alert
                message="Error"
                description={analysisError}
                type="error"
                showIcon
                closable
            />}
            <h1>Analysis</h1>

            <div className={"analysis-container"}>
                {
                    cols.map( c => {
                        return   <Collapse accordion className={"analysis-col"}>
                            <Panel header="This is panel header 1" key="1">
                                <p>{"text"}</p>
                            </Panel>
                            <Panel header={<div>coucou <button>bobo</button></div>} key="2">
                                <p>{"text"}</p>
                            </Panel>
                            <Panel header="This is panel header 3" key="3">
                                <p>{"hoho"}</p>
                            </Panel>
                        </Collapse>
                    })
                }
            </div>
        </div>
    );
}
