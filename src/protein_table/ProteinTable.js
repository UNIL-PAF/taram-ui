import React, {useState, useEffect, useMemo} from "react";
import {Table, Spin, Input, Alert, Switch} from "antd";
import Highlighter from 'react-highlight-words';

export default function ProteinTable(props) {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [globalSearchText, setGlobalSearchText] = useState('');

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

    const searchGlobalText = (searchText) => {
        setGlobalSearchText(searchText);
    }

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

    const getGlobalSearchProps = (dataIndex) => {
        return {
            render: (text, record) => {
                const searchWords = globalSearchText.trim() ? [globalSearchText] : [];

                const highlighter = (
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: '#ffc069',
                            padding: 0,
                        }}
                        searchWords={searchWords}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                );

                return highlighter;
            },
        };
    };

    const defaultColumns = [
        {
            title: 'Protein group',
            dataIndex: 'protGroup',
            key: 'protGroup',
            ellipsis: true,
            ...getGlobalSearchProps('protGroup'),
        },
        {
            title: 'Gene',
            dataIndex: 'gene',
            key: 'gene',
            ellipsis: true,
            ...getGlobalSearchProps('gene'),
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
            ellipsis: true,
            ...getGlobalSearchProps('desc'),
        }
    ];

    const columns = props.tableData ? getColumns() : undefined

    const filteredResults = useMemo(() => {
        if(!props.tableData) return null

        if (!globalSearchText.trim()) {
            return props.tableData.table;
        }

        const lowerCaseSearch = globalSearchText.toLowerCase().trim();

        return props.tableData.table.filter(record =>
            // Check Gene
            (record.gene && record.gene.toLowerCase().includes(lowerCaseSearch)) ||
            (record.protGroup && record.protGroup.toLowerCase().includes(lowerCaseSearch)) ||
            // Check Description
            (record.desc && record.desc.toLowerCase().includes(lowerCaseSearch))
        );
    }, [props.tableData, globalSearchText]);

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
            <div style={{marginTop: '10px'}}>
                <Input
                    placeholder="Search by Protein group, Gene or Description..."
                    size="normal"
                    value={globalSearchText}
                    onChange={(e) => searchGlobalText(e.target.value)}
                    style={{marginBottom: 16, width: 330}}
                />
            </div>
            {(!props.tableData && !props.loadingError) && <Spin tip="Loading..."></Spin>}
            {props.loadingError && <Alert message={errorMessage} type="error"></Alert>}
            {props.tableData && props.tableData.table && <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                dataSource={filteredResults}
                columns={columns}
                size={"small"}/>}
        </>
    );
}