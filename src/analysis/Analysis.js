import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import './analysis.css'
import {Alert, message} from 'antd';
import {fetchAnalysisByResultId} from "./BackendAnalysis";
import {useDispatch, useSelector} from 'react-redux';
import AnalysisSteps from "../analysis_steps/AnalysisSteps";
import {resetResults} from "../results/ResultsSlice"

export default function Analysis() {
    const dispatch = useDispatch();
    const params = useParams();
    const analysisFetchStatus = useSelector(state => state.analysis.status)
    const analysisStatus = useSelector(state => state.analysis.globalStatus)
    const analysisData = useSelector(state => state.analysis.data)
    const analysisError = useSelector(state => state.analysis.error)
    const resultsId = useSelector(state => state.results.resultId)

    useEffect(() => {
        if(resultsId != null){
            dispatch(resetResults())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultsId])

    useEffect(() => {
        let timeout

        if (analysisFetchStatus === 'idle') {
            dispatch(fetchAnalysisByResultId(params.resultId))
            message.config({top: 60})
        }else{
            if(analysisStatus === 'running' || analysisStatus === 'idle'){
                timeout = setTimeout(() => {
                    dispatch(fetchAnalysisByResultId(params.resultId))
                }, 2000);
            }
        }

        return () => {
            // clears timeout before running the new effect
            clearTimeout(timeout);
        };

    }, [analysisFetchStatus, params.resultId, analysisData, dispatch, analysisStatus])

    return (
        <div>
            {analysisData && <div className={"analysis-container"}>
                {
                    analysisData.map(a => {
                        return <AnalysisSteps analysisIdx={a.idx} data={a} key={a.idx} resType={a.result.type}/>
                    })
                }
            </div>
            }
            {analysisError && <Alert
                message="Error"
                description={analysisError}
                type="error"
                showIcon
                closable
            />}
        </div>
    );
}
