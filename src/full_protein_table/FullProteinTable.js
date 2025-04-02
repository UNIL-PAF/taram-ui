import React, {useState, useRef, useEffect} from "react";
import {Table, Spin, Input, Space, Button, Tooltip} from "antd";
import {DownloadOutlined, SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {useDispatch} from "react-redux";
import {getFullProteinTable} from "./BackendFullProteinTable";
import {formNum} from "../common/NumberFormatting";
import globalConfig from "../globalConfig";
import SelectTableColumns from "./SelectTableColumns";

export default function FullProteinTable(props) {

    const [selectColumns, setSelectColumns] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchInput = useRef(null);
    const dispatch = useDispatch();
    const [columns, setColumns] = useState()
    const [rows, setRows] = useState()
    const [headers, setHeaders] = useState()
    const [selColIdx, setSelColIdx] = useState(null)

    useEffect(() => {
        dispatch(getFullProteinTable({stepId: props.stepId, callback: (data) => setData(data)}))
        setIsLoading(true)
        setColumns(undefined)
        setRows(undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setData = (data) => {
        setHeaders(data.headers)
        setColumns(getColumns(data.headers))
        setRows(getRows(data))
        setIsLoading(false)
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
                    placeholder={`Search`}
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

    const getColumns = (headers) => {
        const elliThresh = 20
        return headers.map( h => {
            let myCol =  {
                title: h.name,
                dataIndex: h.idx,
                key: h.idx
            }
            if(h.type === "NUMBER"){
                myCol.sorter = (a, b, sortOrder) => {
                    const isAscend = sortOrder === "ascend"
                    const selA = a[h.idx]
                    const selB = b[h.idx]
                    if(isNaN(selA) && isNaN(selB)) return 0
                    if(isNaN(selA)) return isAscend ? 1 : -1
                    if(isNaN(selB)) return isAscend ? -1 : 1
                    return selA - selB
                }
                myCol.render = (text) => formNum(text)
            }else{
                myCol = {...myCol, ...getColumnSearchProps(h.idx)}
                myCol.sorter = (a, b) => a[h.idx].localeCompare(b[h.idx])
                myCol.render = (text) => {
                    if(text.length > elliThresh){
                        const shortText = text.slice(0, elliThresh) + "..."
                        return <Tooltip title={text}>
                            <span style={{whiteSpace: "nowrap"}}>{shortText}</span>
                        </Tooltip>
                    }else{
                        return <span style={{whiteSpace: "nowrap"}}>{text}</span>
                    }
                }
            }
            return myCol
        })
    }

    const getRows = (data) => {
        return data.rows.map( (row, i) => {
            return {
                key: i,
                ...row.cols.reduce((acc, cur, j) => {
                    let newAcc = acc
                    newAcc[j] = data.headers[j].type === "NUMBER" ? Number(cur) : cur
                    return newAcc
                }, {})
                }
        })
    }

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

    const clickSelectColumns = (stepId, tableNr) => {
        setSelectColumns(true)
    }

    const selectColumnsOk = (selectedKeys) => {
        const newColumns = (selectedKeys) ? getColumns(headers.filter(a => selectedKeys.includes(a.idx))) : undefined
        setColumns(newColumns)
        setSelectColumns(false)
        setSelColIdx(newColumns.map(a => a.dataIndex))
    }

    const downloadTable = (stepId, tableNr) => {
        const selColStr = (selColIdx !== null) ? ("?sel-cols=" + selColIdx.join(",")) : ""
        fetch(globalConfig.urlBackend + 'analysis-step/table/' + stepId + selColStr)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'Table-' + tableNr + '.txt';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    return (
        <>
            {isLoading && <Spin tip="Loading..."></Spin>}
            <Button onClick={() => clickSelectColumns(props.stepId, props.tableNr)} type={"primary"} style={{marginLeft: "10px"}}>Select columns</Button>
            <Button onClick={() => downloadTable(props.stepId, props.tableNr)} type={"primary"} style={{marginLeft: "10px"}} icon={<DownloadOutlined />}>Download table</Button>
            {!isLoading && columns && rows && <Table
                style={{marginTop: "20px"}}
                columns={columns}
                dataSource={rows}
                size="small"
            ></Table>}
            {selectColumns && <SelectTableColumns
                setSelectColumns={setSelectColumns}
                headers={headers}
                selectColumnsOk={selectColumnsOk}
            ></SelectTableColumns>}
        </>
    );
}