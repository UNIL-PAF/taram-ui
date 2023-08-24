import React from "react";
import {Button, message, Popconfirm, Space, Table} from 'antd';
import {DeleteOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {deleteResult} from "./BackendResults";

export default function ResultsTable(props) {

    const confirmDelete = (resultId) => {
        deleteResult(resultId, props.refreshResults)
        message.success('Delete result [' + resultId + '].');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                console.log(record)
                return <a href={'/viewer/' + record.id}>{text} {record.status === "done" ?
                    <>&nbsp;<CheckCircleTwoTone style={{fontSize: "large"}} twoToneColor={"#52c41a"}/></> : <></>}</a>
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
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
            title: 'Result file',
            dataIndex: 'resFile',
            key: 'resFile',
            ellipsis: true
        },
        {
            title: 'Creation date',
            dataIndex: 'lastModifDate',
            key: 'lastModifDate',
            sorter: (a, b) =>
                a.lastModifDate &&
                a.lastModifDate > b.lastModifDate &&
                b.lastModifDate
                    ? 1
                    : -1,
            defaultSortOrder: "descend"
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure to delete this result?"
                        onConfirm={() => confirmDelete(record.id)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <Button type={"text"} icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <>
            <Table dataSource={props.results} columns={columns}/>
        </>
    );
}