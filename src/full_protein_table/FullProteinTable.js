import React, {useState, useRef, useEffect} from "react";
import {Table, Spin, Input, Space, Button, Tooltip} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {useDispatch, useSelector} from "react-redux";
import {getFullProteinTable} from "./BackendFullProteinTable";
import {formNum} from "../common/NumberFormatting";

export default function FullProteinTable(props) {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchInput = useRef(null);
    const table = useSelector(state => state.fullProteinTable)
    const dispatch = useDispatch();

    useEffect(() => {
        if(!table || !table.data || table.data.stepId !== props.stepId){
            if(!isLoading){
                dispatch(getFullProteinTable({stepId: props.stepId}))
                setIsLoading(true)
            }
        }else{
            setIsLoading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table, isLoading, props.stepId])

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

    const getColumns = () => {
        const elliThresh = 20

        return table.data.headers.map( h => {
            let myCol =  {
                title: h.name,
                dataIndex: h.idx,
                key: h.idx
            }
            if(h.type === "NUMBER"){
                myCol.sorter = (a, b) => a[h.idx] - b[h.idx]
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

    const getRows = () => {
        return table.data.rows.map( (row, i) => {
            return {
                key: i,
                ...row.cols.reduce((acc, cur, j) => {
                    let newAcc = acc
                    newAcc[j] = table.data.headers[j].type === "NUMBER" ? Number(cur) : cur
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

    return (
        <>
            {isLoading && <Spin tip="Loading..."></Spin>}
            {!isLoading && table && table.data && <Table
                columns={getColumns()}
                dataSource={getRows()}
            ></Table>}
        </>
    );
}