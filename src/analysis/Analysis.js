import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import './analysis.css'
import {Alert, message, Space} from 'antd';
import {fetchAnalysisByResultId} from "./BackendAnalysis";
import {useDispatch, useSelector} from 'react-redux';
import AnalysisStep from "../analysis_steps/AnalysisStep";
import {selectCols} from "./analysisSlice";

export default function Analysis() {
    const dispatch = useDispatch();
    const params = useParams();
    const analysisStatus = useSelector(state => state.analysis.status)
    const analysisData = useSelector(state => state.analysis.data)
    const analysisError = useSelector(state => state.analysis.error)
    const cols = useSelector(state => selectCols(state))

    let hideLoading;

    useEffect(() => {
        if (analysisStatus === 'idle') {
            dispatch(fetchAnalysisByResultId(params.resultId))
            message.config({top: 60})
        } else if (analysisStatus === 'loading') {
            hideLoading = message.loading("Loading data", 0)
        } else {
            message.destroy(hideLoading)
        }
    }, [analysisStatus, dispatch, params.resultId])

    return (
        <div>
            {analysisError && <Alert
                message="Error"
                description={analysisError}
                type="error"
                showIcon
                closable
            />}
            <h1>Analysis</h1>

            {analysisData && <div className={"analysis-container"}>
                {
                    cols.map(colId => {
                        return <AnalysisStep analysisIdx={colId} data={analysisData[colId]} key={colId}/>
                    })
                }
            </div>
            }

        </div>
    );
}
