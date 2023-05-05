import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Radio, Select} from 'antd';
import {addResult, getAvailableDirs} from "./BackendResults"
import _ from "lodash"
import {useDispatch} from "react-redux";

const { Option } = Select;

const CollectionCreateForm = ({ visible, onCreate, onCancel, availableDirs, setSelFile, selFile }) => {
    const [form] = Form.useForm();

    const [fltDirs, setFltDirs] = useState(availableDirs);
    const [resultFiles, setResultFiles] = useState(availableDirs);

    const initialType = "MaxQuant"

    useEffect(() => {
        if(availableDirs){
            setFltDirs(availableDirs.filter((a) => a.type === initialType))
        }
    }, [availableDirs])

    const onChangeType = (e) => {
        setFltDirs(availableDirs.filter((a) => a.type === e.target.value))
    }

    const selectDir = (e) => {
        const resDir = fltDirs[e]
        setSelFile(resDir.resFile)
        setResultFiles(resDir.resFileList.map( (f, i) => { return {value: f, label: f}}))
    }

    return (
        <Modal
            visible={visible}
            title="Add a new analysis"
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
                        onSelect={selectDir}
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            _.map(fltDirs, (dir, i) => {
                                return <Option key={i} value={i}>{dir.path}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Select
                    placeholder="Select a result file"
                    style={{width: "50%"}}
                    options={resultFiles}
                    value={selFile}
                    onSelect={setSelFile}
                >
                </Select>
                <br></br>
                <br></br>
                <Form.Item name="type" className="collection-create-form_last-form-item" initialValue={initialType}>
                    <Radio.Group onChange={onChangeType}>
                        <Radio value="MaxQuant">MaxQuant</Radio>
                        <Radio value="Spectronaut">Spectronaut</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please specify a name for the analysis.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input type="textarea" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export function BrowseResultsModal({buttonText, refreshResults}){
    const [visible, setVisible] = useState(false);
    const [availableDirs, setAvailableDirs] = useState();
    const [selFile, setSelFile] = useState();
    const dispatch = useDispatch();

    const onCreate = (values) => {
        const selDir = availableDirs.filter((a) => a.type === values.type)[values.resDir]
        let localVals = values
        localVals.path = selDir.path
        localVals.resFile = selFile
        localVals.fileCreationDate = selDir.fileCreationDate

        dispatch(addResult(localVals))
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
                setSelFile={setSelFile}
                selFile={selFile}
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
