import React, {useEffect, useState} from "react";
import {Alert, Layout, Space} from 'antd';
import ResultsTable from "./ResultsTable";
import {getResults} from "./BackendResults"
import {useSelector} from "react-redux";
import { Navigate } from "react-router-dom";

const {Content} = Layout;

export default function Results(props) {
    const [results, setResults] = useState([]);

    const newResultsId = useSelector(state => state.results.resultId)
    const resultsError = useSelector(state => state.results.error)

    useEffect(() => {
        refreshResults()
    }, [props])

    const refreshResults = () => {
        getResults((results) => setResults(results))
    }

    return (
        <Content>
            {resultsError && <Alert
                message="Error"
                description={resultsError}
                type="error"
                showIcon
                closable
            />}
            {newResultsId && <Navigate to={"/viewer/"+newResultsId} replace={true} />}
            <div>
                <ResultsTable results={results} refreshResults={refreshResults}/>
            </div>
        </Content>
    );

}
