import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Radio, Select, Spin, Alert} from 'antd';
import {addResult, getAvailableDirs} from "./BackendResults"
import _ from "lodash"
import {useDispatch} from "react-redux";

const {Option} = Select;

const CollectionCreateForm = (props) => {
    const [form] = Form.useForm();

    const [fltDirs, setFltDirs] = useState(props.availableDirs);
    const [resultFiles, setResultFiles] = useState(props.availableDirs);

    const initialType = "MaxQuant"

    useEffect(() => {
        if (props.availableDirs) {
            setFltDirs(props.availableDirs.filter((a) => a.type === initialType))
        }
    }, [props.availableDirs])

    const onChangeType = (e) => {
        setFltDirs(props.availableDirs.filter((a) => a.type === e.target.value))
    }

    const selectDir = (e) => {
        const resDir = fltDirs[e]
        props.setSelFile(resDir.resFile)
        setResultFiles(resDir.resFileList.map((f, i) => {
            return {value: f, label: f}
        }))
    }

    const isDisabled = props.status !== "done"
//<Button style={"primary"} onClick={() => props.refreshData()}>Sync with NAS</Button>
    const title = <div>Add a new analysis<Button style={{marginLeft: "30px"}} type="primary" onClick={() => props.refreshData()}>Sync with NAS</Button></div>

    return (
        <Modal
            visible={props.visible}
            title={title}
            okText="Add"
            cancelText="Cancel"
            width={1000}
            onCancel={props.onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        props.onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <div>
                {props.status === "loading" &&
                    <Spin tip="Loading" style={{marginLeft: "20px"}}>
                        <div className="content"/>
                    </Spin>
                }
                {
                    props.status === "error" &&
                    <Alert
                        message="An error occured while trying to check for available results."
                        type="error"
                        closable
                        style={{marginLeft: "20px"}}
                    />
                }
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
                            disabled={isDisabled}
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
                        disabled={isDisabled}
                        placeholder="Select a result file"
                        style={{width: "50%"}}
                        options={resultFiles}
                        value={props.selFile}
                        onSelect={props.setSelFile}
                    >
                    </Select>
                    <br></br>
                    <br></br>
                    <Form.Item name="type" className="collection-create-form_last-form-item" initialValue={initialType}>
                        <Radio.Group onChange={onChangeType} disabled={isDisabled}>
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
                        <Input disabled={isDisabled}/>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input type="textarea" disabled={isDisabled}/>
                    </Form.Item>
                </Form>
            </div>
        </Modal>

    );
};

export function BrowseResultsModal({buttonText, refreshResults}) {

    const [selFile, setSelFile] = useState();
    const [visible, setVisible] = useState(false);
    const [availableDirs, setAvailableDirs] = useState();
    const [status, setStatus] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        getAvailableDirs(setVisible, setAvailableDirs, setStatus)
    }, [])

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
            <span style={{display: "inline-flex"}}>
                    <Button
                        type="primary"
                        onClick={() => setVisible(true)}
                    >
                        {buttonText}
                    </Button>
            </span>
            <CollectionCreateForm
                status={status}
                setSelFile={setSelFile}
                selFile={selFile}
                visible={visible}
                onCreate={onCreate}
                refreshData={() => getAvailableDirs(setVisible, setAvailableDirs, setStatus)}
                onCancel={() => {
                    setVisible(false);
                }}
                availableDirs={availableDirs}
            />
        </div>
    );
};
