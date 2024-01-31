import React, {useState, useEffect, useRef} from "react";
import {Button, message, Modal, Popconfirm, Space, Table, Form, Input} from 'antd';
import {DeleteOutlined, LockTwoTone, EditOutlined, SearchOutlined} from "@ant-design/icons";
import {deleteResult, updateInfo} from "./BackendResults";
import Highlighter from "react-highlight-words";

export default function ResultsTable(props) {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentResult, setCurrentResult] = useState()
    const [hasFormError, setHasFormError] = useState();
    const searchInput = useRef(null);
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm, dataIndex) => {
        setSearchText('');
        setSearchedColumn(dataIndex);
        clearFilters();
        confirm();
    };

    const getColumnSearchProps = (dataIndex, isTitle) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            const myRec = record[dataIndex]
            return myRec ? myRec.toString().toLowerCase().includes(value.toLowerCase()) : false
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text, record) => {
            const myText = searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            )
            return isTitle ? <a href={'/viewer/' + record.id}>{myText} {record.status === "done" ?
                <>&nbsp;<LockTwoTone style={{fontSize: "large"}} twoToneColor={"#d4b106"}/></>: <></>}</a> : myText
        },
    });


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', true)
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
            ...getColumnSearchProps('description')
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

    /*
    initialValues={{
        ["name"]: currentResult.name,
            ["description"]: currentResult.description,
    }}

     */

    return (
        <>
            <Table dataSource={props.results} columns={columns}/>
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