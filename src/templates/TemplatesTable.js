import React, {useState} from "react";
import {Button, Layout, message, Popconfirm, Space, Table, Input} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {deleteTemplate, updateTemplate} from "./BackendTemplates";
import {useDispatch} from "react-redux";

const {Content} = Layout;

export default function TemplatesTable(props) {
    const [editField, setEditField] = useState(undefined);
    const [editFieldValue, setEditFieldValue] = useState(undefined);
    const dispatch = useDispatch();

    const confirmDelete = (templateId) => {
        dispatch(deleteTemplate(templateId))
        message.success('Delete template [' + templateId + '].');
    };

    const editEntry = (record, field) => {
        setEditField({id: record.id, field: field})
        setEditFieldValue(record[field])
    }

    const saveEntry = () => {
        if(editFieldValue && editField){
            dispatch(updateTemplate({id: editField.id, name: editField.field, value: editFieldValue}))
            setEditField(undefined)
            setEditFieldValue(undefined)
        }
    }

    const pressedKey = (ev) => {
        if (ev.key === "Enter") {
            saveEntry()
        }
    }

    const renderEditField = (field) => {
        return (_, record) => {
            {
                if (editField && editField.field === field && record.id === editField.id) {
                    return (
                        <Space onKeyPress={(ev) => pressedKey(ev)} onBlur={() => saveEntry()}>
                            <Input defaultValue={_} onChange={(e) => setEditFieldValue(e.target.value)}/>
                        </Space>
                    )
                } else {
                    return (
                        <Space>
                            {_}
                        </Space>
                    )

                }
            }
        }
    }

    const onCellEditField = (field) => {
        return (record) => {
            return {
                onClick: () => {
                    editEntry(record, field)
                },
            };
        }
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '200px',
            render: renderEditField('name'),
            onCell: onCellEditField('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '200px',
            render: renderEditField('description'),
            onCell: onCellEditField('description'),
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
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure to delete this step?"
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
        <div>
            <Content>
                <Space direction="vertical">
                    <Table columns={columns} dataSource={props.data}/>
                </Space>
            </Content>
        </div>
    );
}