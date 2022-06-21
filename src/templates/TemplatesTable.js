import React from "react";
import {Layout, Space, Table} from "antd";

const {Content} = Layout;

export default function TemplatesTable(props) {
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Last modification',
            dataIndex: 'lastModifDate',
            key: 'lastModifDate',
            sorter: (a, b) =>
                a.lastModifDate &&
                a.lastModifDate > b.lastModifDate &&
                b.lastModifDate
                    ? 1
                    : -1,
            defaultSortOrder: "ascend"
        },
        {
            title: 'Nr of steps',
            dataIndex: 'nrSteps',
            key: 'nrSteps',
        },
    ]

    return (
        <div>
            <Content>
                <Space direction="vertical">
                    <Table columns={columns} dataSource={props.data}/>
                </Space>
            </Content>
        </div>
    );
}