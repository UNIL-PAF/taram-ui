import React, {useEffect, useState, useRef} from "react";
import {Button, Input, Modal, Space, Spin, Table, Typography} from "antd";
import "../AnalysisStep.css"
import {DownloadOutlined, SearchOutlined} from "@ant-design/icons";
import globalConfig from "../../globalConfig";
import axios from "axios";
import Highlighter from "react-highlight-words";
import {formNum} from "../../common/NumberFormatting";

const {Text} = Typography;

export default function OneDErichmentTableZoom(props) {

    const [enrichment, setEnrichment] = useState();
    const [status, setStatus] = useState();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);

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

                    console.log(props.params)

                    setEnrichment(results)
                    setStatus("done")
                    console.log(results)
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
            ...getColumnSearchProps('column'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'size',
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
            title: 'score',
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
            title: 'pvalue',
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
            title: 'qvalue',
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
            title: 'mean',
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
            title: 'median',
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
            <span>Summary table <Button onClick={() => downloadTable()} type={"primary"} style={{marginLeft: "10px"}}
                                        icon={<DownloadOutlined/>}>Download table</Button></span>
        </>
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //props.setParams({...props.params, categoryNames: selectedRows.map(a => a.name)})
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
        selectedRowKeys: props.params.selResults
    };

    return (
        <>
            <Modal open={props.showZoom} title={getTitle()} onCancel={() => props.setShowZoom(false)}
                   width={"95%"} height={"100%"} footer={null} bodyStyle={{overflowY: 'scroll'}}
                   afterClose={console.log("OneDEnrichmentTableZoom closed.")}
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