import React, {useState} from "react";
import {Button, Modal, Popconfirm, Space, Spin, Table} from 'antd';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

import EditAnnotation from "./EditAnnotation";
import AnnotationUpload from "./AnnotationUpload";

export default function ManageAnnotations(props) {

    const [currentAnnotation, setCurrentAnnotation] = useState();
    const [showEditModal, setShowEditModal] = useState();
    const [showUploadModal, setShowUploadModal] = useState();
    const [isUploading, setIsUploading] = useState(false);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Nr of entries',
            dataIndex: 'nrEntries',
            key: 'nrEntries',
        },
        {
            title: 'Original filename',
            dataIndex: 'origFileName',
            key: 'origFileName',
            ellipsis: true
        },
        {
            title: 'In use',
            dataIndex: 'inUse',
            key: 'inUse',
        },
        {
            title: 'Creation date',
            dataIndex: 'creationDate',
            key: 'creationDate',
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
                    <Button onClick={() => editAnnotation(record)} type={"text"} icon={<EditOutlined />}></Button>
                    <Popconfirm
                        title="Are you sure to delete this result?"
                        onConfirm={() => confirmDelete(record.id)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <Button type={"text"} icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                </Space>
            },
        },
    ]

    const confirmDelete = (annoId) => {
        console.log("delete " + annoId)
        /*
        deleteAnnotation(resultId, props.refreshAnnotations)
        message.success('Delete result [' + resultId + '].');

         */
    };

    const editAnnotation = (anno) => {
        setCurrentAnnotation(anno)
        setShowEditModal(true)
    }

    return (<>
        <Modal open={true} title={"Manage annotations"} onCancel={() => props.setModalOpen(false)}
               width={"95%"} height={"100%"} footer={null}>
                <Button disabled={isUploading} type="primary" onClick={() => setShowUploadModal(true)} style={{marginBottom: "15px"}}>
                    {isUploading ? <div>Uploading annotation.. <Spin size={"small"}></Spin></div> : "Add new annotation"}
                </Button>
            {showUploadModal && <AnnotationUpload
                setShowUploadModal={setShowUploadModal}
                refreshAnnotations={props.refreshAnnotations}
                setIsUploading={setIsUploading}
            ></AnnotationUpload>
            }
            <Table dataSource={props.annotations} columns={columns}/>
            {showEditModal && <EditAnnotation
                annotation={currentAnnotation}
                setAnnotation={setCurrentAnnotation}
                setShowEditModal={setShowEditModal}
                refreshAnnotations={props.refreshAnnotations}
            ></EditAnnotation>}
        </Modal>
    </>);
}
