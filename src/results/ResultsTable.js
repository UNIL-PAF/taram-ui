import React from "react";
import {Table} from 'antd';

class ResultsTable extends React.Component {

    columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a href={'/analysis/'+ record.id}>{text}</a>,
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'File path',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: 'File creation date',
            dataIndex: 'fileCreationDate',
            key: 'fileCreationDate',
        }
    ]


    render() {

        console.log(this.props.results)

        return (
            <>
                <Table dataSource={this.props.results} columns={this.columns}/>;
            </>
        );
    }
}

export default ResultsTable