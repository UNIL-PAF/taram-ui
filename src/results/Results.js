import React, {useEffect, useState} from "react";
import {Layout, Space} from 'antd';
import ResultsTable from "./ResultsTable";
import BrowseResults from "./BrowseResults";
import {getResults} from "./BackendResults"

const {Content} = Layout;

export default function Results(props) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        getResults((results) => setResults(results))
    }, [props])

    return (
        <Content>
            <Space direction="vertical">
                <h1>Results</h1>
                <BrowseResults/>
                <ResultsTable results={results}/>
            </Space>
        </Content>
    );

}
