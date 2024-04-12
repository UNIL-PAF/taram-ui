import React, {useEffect, useState, useRef} from "react";
import {Button, Input, Modal, Space, Spin, Table, Typography} from "antd";
import "../AnalysisStep.css"
import {DownloadOutlined, SearchOutlined} from "@ant-design/icons";
import globalConfig from "../../globalConfig";
import axios from "axios";
import Highlighter from "react-highlight-words";
import {formNum} from "../../common/NumberFormatting";
import {switchSel} from "../BackendAnalysisSteps";
import {useDispatch} from "react-redux";

const {Text} = Typography;

export default function OneDErichmentTableZoom(props) {

    const [enrichment, setEnrichment] = useState();
    const [status, setStatus] = useState();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.showZoom && !enrichment) {
            axios.get(globalConfig.urlBackend + "analysis-step/full-enrichment-table/" + props.stepId)
                .then((response) => {
                    // handle success
                    // add a unique key
                    const results = response.data.rows.map((r) => {
                        r.key = r.id
                        return r
                    })
                    setEnrichment(results)
                    setStatus("done")
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    setStatus("error")
                })
                .then(function () {
                    // always executed
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enrichment, props.showZoom])

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

    const columns = [
        {
            title: 'Column',
            dataIndex: 'column',
            key: 'column',
            sorter: (a, b) => a['column'].localeCompare(b['column']),
            ...getColumnSearchProps('column'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a['type'].localeCompare(b['type']),
            ...getColumnSearchProps('type'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a['name'].localeCompare(b['name']),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            sorter: (a, b) =>
                a.size &&
                a.size > b.size &&
                b.size
                    ? 1
                    : -1
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            sorter: (a, b) =>
                a.score &&
                a.score > b.score &&
                b.score
                    ? 1
                    : -1,
            render: (text) => formNum(text)
        },
        {
            title: 'P-value',
            dataIndex: 'pvalue',
            key: 'pvalue',
            sorter: (a, b) =>
                a.pvalue &&
                a.pvalue > b.pvalue &&
                b.pvalue
                    ? 1
                    : -1,
            //defaultSortOrder: "ascend",
            render: (text) => formNum(text)
        },
        {
            title: 'Q-value',
            dataIndex: 'qvalue',
            key: 'qvalue',
            sorter: (a, b) =>
                a.qvalue &&
                a.qvalue > b.qvalue &&
                b.qvalue
                    ? 1
                    : -1,
            render: (text) => formNum(text)
        },
        {
            title: 'Mean',
            dataIndex: 'mean',
            key: 'mean',
            sorter: (a, b) =>
                a.mean &&
                a.mean > b.mean &&
                b.mean
                    ? 1
                    : -1,
            render: (text) => formNum(text)
        },
        {
            title: 'Median',
            dataIndex: 'median',
            key: 'median',
            sorter: (a, b) =>
                a.median &&
                a.median > b.median &&
                b.median
                    ? 1
                    : -1,
            render: (text) => formNum(text)
        },
    ]

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis-step/result/' + props.stepId)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'Enrichment_table-' + props.stepNr + '.txt';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    const getTitle = () => {
        return <>
            <span>Enrichment table <Button onClick={() => downloadTable()} type={"primary"} style={{marginLeft: "10px"}}
                                        icon={<DownloadOutlined/>}>Download table</Button></span>
        </>
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            const addSel = selectedRowKeys.filter(a => !props.params.selResults.includes(a))
            const rmSel = props.params.selResults.filter(a => !selectedRowKeys.includes(a))

            const selIds = addSel.length > 0 ? addSel : rmSel
            addOrRemoveLocalResults(addSel, rmSel)
            props.setParams({...props.params, selResults: selectedRowKeys})
            switchAll(selIds)
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
        selectedRowKeys: props.params.selResults
    };

    // we have to do it with the callback to avoid race conditions
    const switchAll = (selIds) => {
        const myFun = selIds.reverse().reduce((acc, curr) => {
           return dispatchOne(curr, acc)
        }, null)
        myFun()
    }

    const dispatchOne = ( selId, nextFun) => {
        return () => dispatch(switchSel({resultId: props.resultId, selId: selId, stepId: props.stepId, callback: nextFun}))
    }

    const sortByPValue = (a, b) => {
        if(a.median > b.median){
            return -1;
        }else if(b.median > a.median){
            return 1;
        }
        return 0;
    }

    const addOrRemoveLocalResults = (addSel, rmSel) => {
        if(addSel.length > 0){
            const newEl = enrichment.filter( e => addSel.includes(e.id))
            const newRes = props.results.concat(newEl)
            props.setResults(newRes.sort(sortByPValue))
        }else if(rmSel.length > 0){
            const newRes = props.results.filter(r => !rmSel.includes(r.id))
            props.setResults(newRes.sort(sortByPValue))
        }
    }

    return (
        <>
            <Modal open={props.showZoom} title={getTitle()} onCancel={() => props.setShowZoom(false)}
                   width={"95%"} height={"100%"} footer={null} bodyStyle={{overflowY: 'scroll'}}
            >
                <div style={{height: '100%'}}>
                    {status === "done" && enrichment &&
                        <Space direction={"vertical"}>
                            <span><strong>Enrichment table</strong></span>
                            <Table
                                dataSource={enrichment}
                                columns={columns}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection,
                                }}
                                pagination={{ pageSize: 20}}
                            ></Table>
                        </Space>
                    }
                    {status === "loading" &&
                        <span><Spin/> <strong>Loading enrichment table</strong></span>
                    }
                    {status === "error" &&
                        <span><Text type="danger">Unable to load enrichment table from server.</Text></span>
                    }
                </div>
            </Modal>
        </>
    );
}