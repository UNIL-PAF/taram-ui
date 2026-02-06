import {Alert, Button, Checkbox, Form, Input, Modal, Radio, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import _ from "lodash";

const {Option} = Select;

export default function  BrowseResultForm(props) {
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
        
        const name = resDir.path.replaceAll("/", "-")
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
                        runPTXQC: true
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

                    <Form.Item name="runPTXQC" valuePropName="checked" label={null}>
                        <Checkbox disabled={props.selType !== "MaxQuant"}>Generate PTXQC report</Checkbox>
                    </Form.Item>

                </Form>
            </div>
        </Modal>

    );
};