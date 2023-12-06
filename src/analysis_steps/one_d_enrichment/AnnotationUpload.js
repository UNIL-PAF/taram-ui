import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Upload} from 'antd';
import axios from "axios";
import globalConfig from "../../globalConfig";
import {UploadOutlined} from "@ant-design/icons";

export default function AnnotationUpload(props) {

    const [resultForm] = Form.useForm();
    const [hasFormError, setHasFormError] = useState();
    const [file, setFile] = useState();

    useEffect(() => {
        if(hasFormError === false){
            handleUpload()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasFormError])

    const handleUpload = async () => {
        props.setIsUploading(true)
        const formVals = resultForm.getFieldsValue()

        const formData = new FormData();
        formData.append('name', formVals.name)
        formData.append('description', formVals.description)
        formData.append('file', file)

        // You can use any AJAX library you like
        axios.post( globalConfig.urlBackend + 'annotation/new', formData)
            .then(() => {
                setFile(undefined);
                message.success('upload successfully.');
            })
            .catch(() => {
                console.log("failed")
                message.error('upload failed.');
            })
            .finally(() => {
                props.setShowUploadModal(false)
                props.refreshAnnotations()
                setHasFormError(undefined)
                props.setIsUploading(false)
            });

    };

    const fileProps = {
        onRemove: (file) => {
            setFile(undefined)
        },
        beforeUpload: (file) => {
            setFile(file);
            return false;
        },
        file,
    };

    const cancelModal = () => {
        props.setShowUploadModal(false)
    }

    const onCheck = async () => {
        try {
            if(file === undefined){
                setHasFormError(true)
                message.error('Please add a file.')
            }else{
                setHasFormError(false)
            }
        } catch (errorInfo) {
            setHasFormError(true)
        }
    };

    const saveResult = () => {
        onCheck()
    }


    return (<>
        <Modal open={true} title={"Add new annotation"} onCancel={() => cancelModal()} onOk={() => saveResult()}>
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
                >
                    <Upload {...fileProps}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please give this annotation a name.',
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
        </Modal>
    </>);
}
