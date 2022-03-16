import React, {useEffect, useState, useRef, useContext} from "react";
import { Table, Input, Form } from 'antd';

const EditableContext = React.createContext(null);

export default function ExperimentsSelection(props) {

    const [data, setData] = useState()
    const [selectedRowsState, setSelectedRowsState] = useState()

    useEffect(() => {
       setData(props.data.experimentNames.map((e) => {
           const exp = props.data.experimentDetails[e]
           return {name: exp.originalName,
               fileName: exp.fileName, key: exp.name}
       }))
        setSelectedRowsState(props.data.experimentNames.map((e) => {
           return  e}))
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
                handleSave({ ...record, ...values });
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
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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

    const EditableRow = ({ index, ...props }) => {
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
        console.log(row)
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
    };


    const columns = [
        {
            title: 'Experiment name',
            dataIndex: 'name',
            onCell: (record) => ({
                record,
                editable: true,
                handleSave: handleSave
            }),
        },
        {
            title: 'File name',
            dataIndex: 'fileName',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowsState(selectedRowKeys)
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
                    selectedRowKeys: selectedRowsState,
                    ...rowSelection,
                }}
                size={"small"}
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </>
    );
}
