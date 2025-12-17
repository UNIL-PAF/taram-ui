import React, {useState, useRef, useEffect} from "react";
import {Table, Spin, Input, Space, Button, Alert, Switch} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function ProteinTable(props) {

    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const param = props.paramName
    const target = props.target

    useEffect(() => {
        if (props.tableData && props.params && props.params[param] && props.params[param].length > 0 && selectedRowKeys.length === 0) {
            const selRows = props.tableData.table.filter((r) => {
                return r.sel
            }).map((r) => {
                return r.key
            })
            setSelectedRowKeys(selRows)

            if(props.defaultColors){
                // let's create selProtColors if they aren't already
                const mySelColors = props.params.selProts.map((p, i) => {
                    return (props.params.selProtColors && props.params.selProtColors.length >= (i + 1)) ? props.params.selProtColors[i] : props.defaultColors[i]
                })
                const newParams = {...props.params}
                newParams['selProtColors'] = mySelColors
                props.setParams(newParams)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, selectedRowKeys.length])

    function changeLabelSwitch(val){
        let newParams = {...props.params, showProteinACs: val}
        props.setParams(newParams)
    }

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

    const setProtColor = (idx, color) => {
        const newParams = {...props.params}
        const myCols = props.params.selProtColors
        myCols[idx] = color
        newParams['selProtColors'] = myCols
        props.setParams(newParams)
    }

    const getColumns = () => {
        const myCols = defaultColumns.concat({
            title: props.tableData.intField,
            dataIndex: 'int',
            key: 'int',
            //defaultSortOrder: 'descend',
            sorter: (a, b) => a.int - b.int,
            render: (text) => text ? text.toExponential(2) : 0,
        })

        return props.defaultColors ? myCols.concat({
                title: "Color",
                dataIndex: 'color',
                key: 'color',
                width: 70,
                //defaultSortOrder: 'descend',
                render: (text, a, b) => {
                    const selProtIdx = props.params.selProts ? props.params.selProts.indexOf(a[target]) : -1
                    const selProtColor = selProtIdx >= 0 ? (props.params.selProtColors && props.params.selProtColors.length >= (selProtIdx+1) ? props.params.selProtColors[selProtIdx] : props.defaultColors[selProtIdx]): a.color
                    return (selProtIdx >= 0 ? <input type="color" className={"color-input"} value={selProtColor}
                                      onChange={e => setProtColor(selProtIdx, e.target.value)}/> : null)
                },
            }) : myCols
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

    const columns = props.tableData ? getColumns() : undefined

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
            const selProts = b.map((r) => r[target])
            setSelectedRowKeys(a)
            const newParams = {...props.params}
            newParams[param] = selProts

            if(props.defaultColors){
                // first we have to check if there is a row removed or added
                const missingIndexes = props.params[param] ? props.params[param]
                    .map((item, index) => selProts.includes(item) ? null : index)
                    .filter(index => index !== null) : []

                let mySelColors = props.params.selProts ? props.params.selProts.map((p, i) => {
                    return (props.params.selProtColors && props.params.selProtColors.length >= (i + 1)) ? props.params.selProtColors[i] : props.defaultColors[i]
                }) : null

                if(missingIndexes.length >= 1) {
                    mySelColors.splice(1, missingIndexes[0]);
                }

                newParams['selProtColors'] = mySelColors
            }

            props.setParams(newParams)
        }
    };

    const errorMessage = props.loadingError ? "Could not load table: " + props.loadingError : ""

    return (
        <>
            <h3>Protein table</h3>
            <span>Label with &nbsp;<Switch onChange={(val) => changeLabelSwitch(!val)} checkedChildren="Gene name"
                                           unCheckedChildren="Protein AC"
                                           checked={!props.showProteinACs}/></span>
            {(!props.tableData && !props.loadingError) && <Spin tip="Loading..."></Spin>}
            {props.loadingError && <Alert message={errorMessage} type="error"></Alert>}
            {props.tableData && props.tableData.table && <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                dataSource={props.tableData.table}
                columns={columns}
                size={"small"}/>}
        </>
    );
}