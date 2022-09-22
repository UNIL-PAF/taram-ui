import React, {useEffect, useState} from "react";
import {Table} from "antd";

export default function ProteinTable(props) {

    const columns = [
        {
            title: 'Protein group',
            dataIndex: 'prot',
            key: 'prot'
        },
        {
            title: 'Gene',
            dataIndex: 'gene',
            key: 'gene',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'Intensity',
            dataIndex: 'int',
            key: 'int',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.int - b.int,
        },
        {
            title: 'IBAQ',
            dataIndex: 'ibaq',
            key: 'ibaq',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.ibaq - b.ibaq,
        }
    ];

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (a , b) => {
            console.log(`selectedRowKeys: ${a}`, 'selectedRows: ', b);
        }
    };

    console.log(props.tableData)

    return (
        <>
            <h3>Protein table</h3>
            { props.tableData && <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                dataSource={props.tableData.table}
                columns={columns}
                size={"small"}/> }
        </>
    );
}