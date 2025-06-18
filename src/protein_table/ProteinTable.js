import React, {useState, useRef, useEffect} from "react";
import {Table, Spin, Input, Space, Button} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function ProteinTable(props) {

    const [proteinTable, setProteinTable] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [columns, setColumns] = useState();
    const searchInput = useRef(null);

    const param = props.paramName
    const target = props.target

    useEffect(() => {
        if (props.tableData && !columns) {
            setColumns(getColumns())
        }

        if (props.tableData && props.params && props.params[param] && props.params[param].length > 0 && selectedRowKeys.length === 0) {
            const selRows = props.tableData.table.filter((r) => {
                return r.sel
            }).map((r) => {
                return r.key
            })
            setSelectedRowKeys(selRows)
            setProteinTable(props.tableData.table)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, selectedRowKeys.length, columns])

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const getColumns = () => {
        return defaultColumns.concat({
                title: props.tableData.intField,
                dataIndex: 'int',
                key: 'int',
                //defaultSortOrder: 'descend',
                sorter: (a, b) => a.int - b.int,
                render: (text) => text ? text.toExponential(2) : 0,
            },
            {
                title: "Color",
                dataIndex: 'color',
                key: 'color',
                width: 70,
                //defaultSortOrder: 'descend',
                render: (text, a, b) => {
                    console.log(a.color);
                    if (a.sel) {
                        return <input type="color" className={"color-input"} value={a.color}
                                      onChange={e => props.setGroupColor(e.target.value)}/>
                    }
                },
            },
        )
    }

    const defaultColumns = [
        {
            title: 'Protein group',
            dataIndex: 'protGroup',
            key: 'protGroup',
            ellipsis: true,
            ...getColumnSearchProps('protGroup'),
        },
        {
            title: 'Gene',
            dataIndex: 'gene',
            key: 'gene',
            ellipsis: true,
            ...getColumnSearchProps('gene'),
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
            ellipsis: true,
            ...getColumnSearchProps('desc'),
        }
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm, dataIndex) => {
        setSearchText('');
        setSearchedColumn(dataIndex);
        clearFilters();
        confirm();
    };

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        selectedRowKeys,
        onChange: (a, b) => {
            console.log(a, b, props.protColors)
            const selProts = b.map((r) => r[target])
            setSelectedRowKeys(a)
            const newParams = {...props.params}
            newParams[param] = selProts
            props.setParams(newParams)
            let newTable = [...proteinTable].map((row) => {return {...row, sel: false}})
            a.forEach(aKey => {
                const i = newTable.findIndex((e) => e.key === aKey)
                newTable[i] = {...newTable[i], sel: true}
            })
            let colIdx = 0
            newTable.map((row) => {
                if(row.color) console.log(row.color)
                const newRow = {...row, color: (row.color ? row.color: props.protColors[colIdx])}
                if(row.sel) colIdx = colIdx + 1
                return newRow
            })
            console.log(newTable)
            setProteinTable(newTable)
        }
    };

    return (
        <>
            {!props.tableData && <Spin tip="Loading..."></Spin>}
            {proteinTable && <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                dataSource={proteinTable}
                columns={columns}
                size={"small"}/>}
        </>
    );
}