import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, Input, Radio, Select } from 'antd';
const { Option } = Select;

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
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
                    name="resultName"
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
                        <Option value="jack">Lopez 14084-87-14120-23 and total digest/14030-14033_SP3 digestion/proteinGroups.txt</Option>
                        <Option value="lucy">Lopez 14084-87-14120-23 and total digest/total in solution digests/proteinGroups.txt</Option>
                        <Option value="tom">TIMS our instrument - test DEMO 2020 samples/txt/proteinGroups.txt</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="type" className="collection-create-form_last-form-item" initialValue={"maxquant"}>
                    <Radio.Group>
                        <Radio value="maxquant">MaxQuant</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export function BrowseResultsModal({buttonText}){
    const [visible, setVisible] = useState(false);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                {buttonText}
            </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
};
