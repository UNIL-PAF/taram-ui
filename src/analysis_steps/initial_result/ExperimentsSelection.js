import React, {useEffect, useState} from "react";
import { Table, Input, Divider } from 'antd';

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

    const columns = [
        {
            title: 'Experiment name',
            dataIndex: 'name',
            render: (text) => <Input type="text" defaultValue={text}/>
        },
        {
            title: 'File name',
            dataIndex: 'fileName',
        },
    ];

// rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowsState(selectedRowKeys)
        },
    };

    return (
        <>
            <Table
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
