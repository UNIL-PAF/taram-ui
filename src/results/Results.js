import React from "react";
import {Layout, Space} from 'antd';
import axios from 'axios';
import ResultsTable from "./ResultsTable";
import BrowseResults from "./BrowseResults";

const {Content} = Layout;

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {results: []};
    }

    componentDidMount() {
        this.getResults()
    }

    getResults() {
        axios.get('http://localhost:8080/result/list')
            .then((response) => {
                // handle success
                console.log(response);
                // add a unique key
                const results = response.data.map((r) => {
                    r.key = r.id
                    return r
                })
                this.setState({results: results})
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
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