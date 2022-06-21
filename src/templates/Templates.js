import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllTemplates} from "./BackendTemplates";
import {Alert, Layout, message, Space, Table} from 'antd';

const {Content} = Layout;

export default function Templates() {
    const dispatch = useDispatch();
    const templatesData = useSelector(state => state.templates.data)
    const templatesStatus = useSelector(state => state.templates.status)
    const templatesError = useSelector(state => state.templates.error)

    useEffect(() => {
        if (templatesStatus === 'idle') {
            dispatch(fetchAllTemplates())
            message.config({top: 60})
        }
    }, [templatesStatus, templatesData, dispatch])

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
            {templatesError && <Alert
                message="Error"
                description={templatesError}
                type="error"
                showIcon
                closable
            />}
            <Content>
                <Space direction="vertical">
                    <Table columns={columns} dataSource={templatesData}/>
                </Space>
            </Content>
        </div>
    );
}
