import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

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

    return (
        <div>
            <h1>Analysis</h1>
            <h2>Analysis data: {analysisData ? analysisData.length : 0}</h2>
            <h2>Analysis status: {analysisStatus}</h2>
            <h2>Analysis error: {analysisError}</h2>

        </div>
    );
}
