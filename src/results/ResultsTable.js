import React, {useState, useEffect, useMemo} from "react";
import {Button, message, Modal, Popconfirm, Space, Table, Form, Input} from 'antd';
import {DeleteOutlined, LockTwoTone, EditOutlined} from "@ant-design/icons";
import {deleteResult, updateInfo} from "./BackendResults";
import Highlighter from "react-highlight-words";
import {BrowseResultsModal} from "./BrowseResultsModal";

export default function ResultsTable(props) {

    const [globalSearchText, setGlobalSearchText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentResult, setCurrentResult] = useState()
    const [hasFormError, setHasFormError] = useState();
    const [resultForm] = Form.useForm();

    useEffect(() => {
        if(hasFormError === false){
            const newName = resultForm.getFieldValue("name")
            const newDesc = resultForm.getFieldValue("description")
            updateInfo(currentResult.id, newName, newDesc, props.refreshResults)
            setShowEditModal(false)
            setHasFormError(undefined)
            setCurrentResult(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasFormError, currentResult])

    const confirmDelete = (resultId) => {
        deleteResult(resultId, props.refreshResults)
        message.success('Delete result [' + resultId + '].');
    };

    const editResult = (result) => {
        setCurrentResult(result)
        resultForm.setFieldValue("name", result.name)
        resultForm.setFieldValue("description", result.description)
        setShowEditModal(true)
    }

    const onCheck = async () => {
        try {
            setHasFormError(false)
        } catch (errorInfo) {
            setHasFormError(true)
        }
    };

    const saveResult = () => {
        onCheck()
    }

    const cancelModal = () => {
        setHasFormError(undefined)
        setShowEditModal(false)
        setCurrentResult(undefined)
    }

    const searchGlobalText = (searchText) => {
        setGlobalSearchText(searchText);

    }

    const getGlobalSearchProps = (dataIndex, isTitle) => {
        return {
            render: (text, record) => {
                const searchWords = globalSearchText.trim() ? [globalSearchText] : [];

                const highlighter = (
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: '#ffc069',
                            padding: 0,
                        }}
                        searchWords={searchWords}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                );

                if (isTitle) {
                    return <a href={'/viewer/' + record.id}>
                        {highlighter}
                        {record.status === "done" ?
                            <>&nbsp;<LockTwoTone style={{fontSize: "large"}} twoToneColor={"#d4b106"}/></> : <></>}
                    </a>;
                }

                return highlighter;
            },
        };
    };

    const filteredResults = useMemo(() => {
        if (!globalSearchText.trim()) {
            return props.results;
        }

        const lowerCaseSearch = globalSearchText.toLowerCase().trim();

        return props.results.filter(record =>
            // Check Name
            (record.name && record.name.toLowerCase().includes(lowerCaseSearch)) ||
            // Check Description
            (record.description && record.description.toLowerCase().includes(lowerCaseSearch))
        );
    }, [props.results, globalSearchText]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getGlobalSearchProps('name', true)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ...getGlobalSearchProps('description')
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
            render: (_, record) => {
                return <Space size="middle">
                    <Button onClick={() => editResult(record)} type={"text"} icon={<EditOutlined />}></Button>
                    {record.status === "running" && <Popconfirm
                        title="Are you sure to delete this result?"
                        onConfirm={() => confirmDelete(record.id)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <Button type={"text"} icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>}
                </Space>
            },
        },
    ]

    return (
        <>
            <div style={{display: 'flex'}}>
                <div style={{marginLeft: '18px', marginRight: '10px'}}>
                    <Input
                        placeholder="Search by Name or Description..."
                        size="large"
                        value={globalSearchText}
                        onChange={(e) => searchGlobalText(e.target.value)}
                        style={{marginBottom: 16, width: 300}}
                    />
                </div>
                <div style={{marginLeft: '10px'}}>
                    <BrowseResultsModal buttonText={'Add new analysis'} refreshResults={props.refreshResults}/>
                </div>
            </div>
            <Table dataSource={filteredResults} columns={columns}/>
            {currentResult && <Modal open={showEditModal} title={"Edit analysis info"} onCancel={() => cancelModal()} onOk={() => saveResult()}
            >
                <Form
                    form={resultForm}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please give this analysis a name.',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input />
                    </Form.Item>
            </Form>
            </Modal>}
        </>
    );
}