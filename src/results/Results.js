import React from "react";
import {Layout, Space, Table} from 'antd';
import axios from 'axios';

const {Content} = Layout;

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {results: []};
    }

    columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'File',
            dataIndex: 'resFile',
            key: 'resFile',
        }
    ]

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
                    <Table dataSource={this.state.results} columns={this.columns}/>;
                </Space>
            </Content>
        );
    }
}

export default Results