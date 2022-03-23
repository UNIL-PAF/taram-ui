import React, {useEffect, useState, useRef, useContext} from "react";
import {Table, Input, Form} from 'antd';

const EditableContext = React.createContext(null);

export default function ExperimentsSelection(props) {

    const [selKeys, setSelKeys] = useState()

    useEffect(() => {
        if (props.data) {
            const newSelKeys = props.data.filter((exp) => exp.isSelected).map((exp) => exp.key)
            setSelKeys(newSelKeys)
        }
    }, [props])

    const EditableCell = ({
                              title,
                              editable,
                              children,
                              dataIndex,
                              record,
                              handleSave,
                              ...restProps
                          }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({...record, ...values});
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    const EditableRow = ({index, ...props}) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const handleSave = (row) => {
        console.log("handle save")
        props.onChangeExpName(row)
    };


    const columns = [
        {
            title: 'Experiment name',
            dataIndex: 'name',
            onCell: (record) => {
                return {
                    record,
                    editable: true,
                    dataIndex: 'name',
                    title: 'Experiment name',
                    handleSave: handleSave,
                }
            },
        },
        {
            title: 'Original name',
            dataIndex: 'key',
        },
        {
            title: 'File name',
            dataIndex: 'fileName',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            props.onExpSelection(selectedRowKeys)
        },
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <>
            <Table
                components={components}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selKeys,
                    ...rowSelection,
                }}
                size={"small"}
                columns={columns}
                dataSource={props.data}
                pagination={false}
            />
        </>
    );
}
