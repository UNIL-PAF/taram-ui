import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

import {increment, selectCount,} from './analysisSlice'
import {fetchAnalysisByResultId} from "./BackendAnalysis";
import {useDispatch, useSelector} from 'react-redux';

export default function Analysis() {
    const dispatch = useDispatch();
    const params = useParams();
    const analysisStatus = useSelector(state => state.analysis.status)
    const analysisData = useSelector(state => state.analysis.data)
    const analysisError = useSelector(state => state.analysis.error)

    useEffect(() => {
        if (analysisStatus === 'idle') {
            dispatch(fetchAnalysisByResultId(params.resultId))
        }
    }, [analysisStatus, dispatch, params.resultId])

    const count = useSelector(selectCount);

    return (
        <div>
            <button onClick={() => dispatch(increment())}>increment</button>
            <span>{count}</span>
            <h1>Analysis</h1>
            <h2>Analysis data: {analysisData ? analysisData.length : 0}</h2>
            <h2>Analysis status: {analysisStatus}</h2>
            <h2>Analysis error: {analysisError}</h2>

        </div>
    );
}
