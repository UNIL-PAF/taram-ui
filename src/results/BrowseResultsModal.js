import React, {useState} from 'react';
import {Button, Form, Input, Modal, Radio, Select} from 'antd';
import {getAvailableDirs, addResult} from "./BackendResults"
import _ from "lodash"

const { Option } = Select;

const CollectionCreateForm = ({ visible, onCreate, onCancel, availableDirs }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Add a new result"
            okText="Add"
            cancelText="Cancel"
            width={1000}
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please specify a name for the result.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item
                    name="resDir"
                    label="Result directory"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a directory.',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a directory from NAS"
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            _.map(availableDirs, (dir, i) => {
                                return <Option key={i} value={i}>{dir.path}</Option>
                        })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="type" className="collection-create-form_last-form-item" initialValue={"MaxQuant"}>
                    <Radio.Group>
                        <Radio value="MaxQuant">MaxQuant</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export function BrowseResultsModal({buttonText}){
    const [visible, setVisible] = useState(false);
    const [availableDirs, setAvailableDirs] = useState(false);

    const onCreate = (values) => {
        const selDir = availableDirs[values.resDir]
        console.log(values)
        console.log(selDir)
        let localVals = values
        localVals.path = selDir.path
        localVals.resFile = selDir.resFile
        localVals.fileCreationDate = selDir.fileCreationDate
        addResult(localVals)
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => getAvailableDirs(setVisible,setAvailableDirs)}
            >
                {buttonText}
            </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                availableDirs={availableDirs}
            />
        </div>
    );
};
