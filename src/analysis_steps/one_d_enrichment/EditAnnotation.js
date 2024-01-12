import React, {useEffect, useState} from "react";
import {Modal, Form, Input} from 'antd';
import axios from "axios";
import globalConfig from "../../globalConfig";


export default function EditAnnotation(props) {

    const [resultForm] = Form.useForm();
    const [hasFormError, setHasFormError] = useState();

    useEffect(() => {
        if(hasFormError === false){
            const newName = resultForm.getFieldValue("name")
            const newDesc = resultForm.getFieldValue("description")
            updateInfo(props.annotation.id, newName, newDesc, props.refreshAnnotations)
            props.setShowEditModal(false)
            setHasFormError(undefined)
            props.setAnnotation(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasFormError, props.annotation])

    useEffect(() => {
        resultForm.setFieldValue("name", props.annotation.name)
        resultForm.setFieldValue("description", props.annotation.description)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.annotation])

    const cancelModal = () => {
        props.setShowEditModal(false)
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

    function updateInfo(annoId, name, description, refreshAnnotations){
        axios.put(globalConfig.urlBackend + 'annotation/update-info/' + annoId + "?name=" + name + (description ? ("&description="+description) : ""))
            .then((response) => {
                // handle success
            })
            .catch(function (error) {
                // handle error
                console.log("error")
                console.log(error);
            })
            .then(function () {
                refreshAnnotations()
            });
    }

    return (<>
        <Modal open={true} title={"Edit annotation"} onCancel={() => cancelModal()} onOk={() => saveResult()}>
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
