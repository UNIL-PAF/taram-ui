import React, {useEffect, useState} from "react";
import {Layout, Space} from 'antd';
import ResultsTable from "./ResultsTable";
import BrowseResults from "./BrowseResults";
import {getResults} from "./BackendResults"

const {Content} = Layout;

export default function Results(props) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        refreshResults()
    }, [props])

    const refreshResults = () => {
        getResults((results) => setResults(results))
    }

    return (
        <Content>
            <Space direction="vertical">
                <BrowseResults refreshResults={refreshResults}/>
                <ResultsTable results={results}/>
            </Space>
        </Content>
    );

}
