import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Radio, Select, Spin, Alert} from 'antd';
import {addResult, getAvailableDirs} from "./BackendResults"
import _ from "lodash"
import {useDispatch} from "react-redux";

const {Option} = Select;

const CollectionCreateForm = (props) => {
    const [form] = Form.useForm();

    const initialType = "MaxQuant"
    const [resultFiles, setResultFiles] = useState();

    useEffect(() => {
        props.setSelType(initialType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const selType = (e) => {
        props.setSelFile(undefined)
        setResultFiles(undefined)
        props.resetFltDirs(e.target.value)
        props.setSelType(e.target.value)
        props.setSelResDir(undefined)
        form.setFieldsValue({type: e.target.value})
        form.setFieldsValue({resDir: undefined})
    }

    const selectDir = (e) => {
        const resDir = props.fltDirs.find(a => a.path === e)
        props.setSelFile(resDir.resFile)
        setResultFiles(resDir.resFileList.map((f) => {
            return {value: f, label: f}
        }))
        props.setSelResDir(resDir.path)

        const name = resDir.path.replaceAll("/", "-").slice(0,-1)
        form.setFieldsValue({name: name})
    }

    const isDisabled = props.status !== "done"
    const title = <div>Add a new analysis<Button style={{marginLeft: "30px"}} type="primary" onClick={() => props.refreshData()}>Sync with NAS</Button></div>

    return (
        <Modal
            open={props.visible}
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
                            value={props.selResDir}
                            showSearch
                            filterOption={(input, option) =>
                                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                _.map(props.fltDirs, (dir, i) => {
                                    return <Option key={i} value={dir.path}>{dir.path}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Select
                        disabled={isDisabled}
                        placeholder="Select a result file"
                        style={{width: "100%"}}
                        options={resultFiles}
                        value={props.selFile}
                        onSelect={props.setSelFile}
                    >
                    </Select>
                    <br></br>
                    <br></br>
                    <Form.Item name="type" className="collection-create-form_last-form-item" initialValue={initialType}>
                        <Radio.Group onChange={selType} disabled={isDisabled}>
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
                        <Input disabled={isDisabled} />
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

    const [selResDir, setSelResDir] = useState();
    const [fltDirs, setFltDirs] = useState();
    const [selType, setSelType] = useState();
    const [selFile, setSelFile] = useState();
    const [visible, setVisible] = useState(false);
    const [availableDirs, setAvailableDirs] = useState();
    const [status, setStatus] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        getAvailableDirs(setVisible, setAvailableDirs, setStatus)
    }, [])

    const resetFltDirs = (type) => {
        if (availableDirs) {
            setFltDirs(availableDirs.filter((a) => a.type === type))
        }
    }

    useEffect(() => {
        if(status === "loading"){
            setSelFile(undefined)
            setFltDirs(undefined)
            setSelResDir(undefined)
        }else if(status === "done"){
            resetFltDirs(selType)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    const onCreate = (values) => {
        const selDir = availableDirs.find((a) => a.type === values.type && a.path === values.resDir)
        let localVals = values
        localVals.path = selDir.path
        localVals.resFile = selFile
        localVals.fileCreationDate = selDir.fileCreationDate

       dispatch(addResult(localVals))
       setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={() => setVisible(true)}>
                {buttonText}
            </Button>
            <CollectionCreateForm
                selResDir={selResDir}
                setSelResDir={setSelResDir}
                resetFltDirs={resetFltDirs}
                fltDirs={fltDirs}
                selType={selType}
                setSelType={setSelType}
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
        </>
    );
};
