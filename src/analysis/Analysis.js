import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {getAnalysis} from "./BackendAnalysis"

export default function Analysis() {
    let params = useParams();
    const [error, setError] = useState();
    const [analysis, setAnalysis] = useState();
    const [isLoading, setIsLoading] = useState(false)

    getAnalysis(params.analysisId, setAnalysis, setIsLoading, setError)

    return (
        <div>
            <h1>Analysis</h1>
            <h2>AnalysisID: {params.analysisId}</h2>
            <h2>Analysis length: {analysis ? analysis.length : 0}</h2>
            <h2>Is loading: {isLoading}</h2>
            <h2>error: {error}</h2>
        </div>
    );
}
