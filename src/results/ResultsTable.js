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
            sorter: (a, b) =>
                a.fileCreationDate &&
                a.fileCreationDate > b.fileCreationDate &&
                b.fileCreationDate
                    ? 1
                    : -1,
            defaultSortOrder: "ascend"
        }
    ]

    render() {
        return (
            <>
                <Table dataSource={this.props.results} columns={this.columns}/>
            </>
        );
    }
}

export default ResultsTable