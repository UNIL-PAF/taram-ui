import React from "react";
import {Table} from 'antd';

class ResultsTable extends React.Component {

    constructor(props) {
        super(props);
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


    render() {
        return (
            <>
                <Table dataSource={this.props.results} columns={this.columns}/>;
            </>
        );
    }
}

export default ResultsTable