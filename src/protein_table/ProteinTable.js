import React, {useState, useMemo} from "react";
import {Table, Spin, Input, Alert, Switch} from "antd";
import Highlighter from 'react-highlight-words';

export default function ProteinTable(props) {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [globalSearchText, setGlobalSearchText] = useState('');

    const target = props.target

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
                render: (text, a, _) => {
                    const selProtIdx = props.params.selProts ? props.params.selProts.indexOf(a[target]) : -1
                    const selProtColor = selProtIdx >= 0 ? (props.params.selProtColors && props.params.selProtColors.length >= (selProtIdx+1) ? props.params.selProtColors[selProtIdx] : props.defaultColors[selProtIdx]): a.color
                    return (selProtIdx >= 0 ? <input type="color" className={"color-input"} value={selProtColor}
                                      onChange={e => setProtColor(selProtIdx, e.target.value)}/> : null)
                },
            }) : myCols
    }

    const getGlobalSearchProps = (dataIndex) => {
        return {
            render: (text, _) => {
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

    const setRowKeysAfterFiltering = (myResults) => {
        const selProts = new Set(props.params[props.paramName])
        const newRowKeys = myResults.filter(a => selProts.has(a.prot)).map(a => a.key)
        setSelectedRowKeys(newRowKeys)
    }

    const filteredResults = useMemo(() => {
        if(!props.tableData) return null

        if (!globalSearchText.trim()) {
            setRowKeysAfterFiltering(props.tableData.table)
            return props.tableData.table;
        }

        const lowerCaseSearch = globalSearchText.toLowerCase().trim();

        const newResults =  props.tableData.table.filter(record =>
            // Check Gene
            (record.gene && record.gene.toLowerCase().includes(lowerCaseSearch)) ||
            (record.protGroup && record.protGroup.toLowerCase().includes(lowerCaseSearch)) ||
            // Check Description
            (record.desc && record.desc.toLowerCase().includes(lowerCaseSearch))
        );

        setRowKeysAfterFiltering(newResults)

        return newResults

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tableData, globalSearchText]);

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        selectedRowKeys,
        onChange: (a, b) => {
            const oldSelProts = props.params[props.paramName] ? props.params[props.paramName] : []

            // we have to keep the entries which are not in the current filteredResults
            const currentFilteredRes = new Set(filteredResults.map(a => a.prot))

            const selProts = b.map((r) => r[target])
            const oldProtsStillHere = oldSelProts.filter(x => x !== undefined && (selProts.includes(x) || !currentFilteredRes.has(x)))

            // the new prot, if one was added
            const newProt = selProts.find(a => !oldProtsStillHere.includes(a))
            const newSelProts = newProt ? oldProtsStillHere.concat(newProt) : oldProtsStillHere

            setSelectedRowKeys(a)
            const newParams = {...props.params}
            newParams[props.paramName] = newSelProts

            if(props.defaultColors){
                // first we have to check if there is a row removed or added
                const missingIndexes = oldSelProts.reduce((a, v, i) => newSelProts.includes(v) ? a : a.concat(i), [])

                const nextColor = (colorArray) => {
                    const used = new Set(colorArray);
                    return props.defaultColors.find(c => !used.has(c));
                }

                const mySelProts = missingIndexes.length > 0 ? oldSelProts : newSelProts

                const newColors = mySelProts.reduce((a,_,i) => {
                    if(missingIndexes.includes(i)) return a
                    if(props.params.selProtColors && props.params.selProtColors[i]){
                        a.push(props.params.selProtColors[i])
                        return a
                    }

                    a.push(nextColor(a))
                    return a
                }, [])

                newParams['selProtColors'] = newColors
            }

            props.setParams(newParams)
        }
    };

    const errorMessage = props.loadingError ? "Could not load table: " + props.loadingError : ""

    return (
        <>
            <h3>Protein table</h3>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <div style={{marginTop: '10px'}}>
                    <Input
                        placeholder="Search by Protein group, Gene or Description..."
                        size="normal"
                        value={globalSearchText}
                        onChange={(e) => searchGlobalText(e.target.value)}
                        style={{marginBottom: 16, width: 330}}
                    />
                </div>
                <div>Label with &nbsp;<Switch onChange={(val) => changeLabelSwitch(!val)} checkedChildren="Gene name"
                                              unCheckedChildren="Protein AC"
                                              checked={!props.showProteinACs}/>
                </div>
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