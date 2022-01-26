import React from "react";
import {Layout, Space} from 'antd';
import axios from 'axios';
import ResultsTable from "./ResultsTable";
import BrowseResults from "./BrowseResults";
import {getResults} from "./BackendResults"

const {Content} = Layout;

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {results: []};
    }

    componentDidMount() {
        getResults((results) => this.setState({results: results}))
    }

    render() {
        return (
            <Content>
                <Space direction="vertical">
                    <h1>Results</h1>
                    <BrowseResults/>
                    <ResultsTable results={this.state.results}/>
                </Space>
            </Content>
        );
    }
}

export default Results