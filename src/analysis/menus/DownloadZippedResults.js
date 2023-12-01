import React, {useEffect, useState} from "react";
import {Checkbox, Modal, Table} from "antd";
import globalConfig from "../../globalConfig";
import {typeToName} from "../../analysis_steps/TypeNameMapping";
import {useDispatch} from "react-redux";
import {setText, setError, setIdle} from "../../navigation/loadingSlice"

export default function DownloadZippedResults(props) {

    const [selItems, setSelItems] = useState({'table': [], 'plots': []})
    const [selRowKeys, setSelRowKeys] = useState()

    const dispatch = useDispatch();

    useEffect(() => {
        if (!selRowKeys && props.data && props.data.analysisSteps) {
            setSelRowKeys(props.data.analysisSteps.map(s => s.id))
            const allTableIds = props.data.analysisSteps.filter(s => s.modifiesResult && s.tableNr).map(s => s.id)
            const allPlotIds = props.data.analysisSteps.filter(s => s.results == null).map(s => s.id)
            setSelItems({...selItems, table: allTableIds, plots: allPlotIds})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, selRowKeys])

    const greyItem = (text, item) => {
        if (!selRowKeys) return <span></span>
        return (selRowKeys.includes(item.key)) ? <span>{text}</span> : <span style={{color: "grey"}}>{text}</span>
    }

    const greyCheckbox = (text, item, field) => {
        if (!selRowKeys) return <span></span>
        if (item[field]) return renderCheckbox(text, field, item.key, selRowKeys.includes(item.key))
    }

    const switchSelection = (field, id) => {
        let newSelItems = {...selItems}
        newSelItems[field] = selItems[field].includes(id) ? selItems[field].filter(s => s !== id) : selItems[field].concat(id)
        setSelItems(newSelItems)
    }

    const renderCheckbox = (text, field, id, active) => {
        return <Checkbox disabled={!active} onChange={() => switchSelection(field, id)}
                         checked={selItems[field].includes(id)}>
            {active ? <span>{text}</span> : <span style={{color: "grey"}}>{text}</span>}
        </Checkbox>
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'idx',
            render: greyItem
        },
        {
            title: 'Step name',
            dataIndex: 'type',
            render: greyItem
        },
        {
            title: 'Save table',
            dataIndex: 'table',
            render: (text, item) => greyCheckbox(text, item, "table")
        },
        {
            title: 'Save plot (SVG and PNG)',
            dataIndex: 'plots',
            render: (text, item) => greyCheckbox(text, item, "plots")
        },
    ];

    const data = props.data.analysisSteps.map((s, i) => {
        const hasPlot = (s.results == null) ? true : false
        return {
            key: s.id,
            type: typeToName(s.type),
            idx: i + 1,
            table: (s.modifiesResult && s.tableNr) ? "Table-" + s.tableNr : undefined,
            plots: hasPlot ? s.type + "-" + (i + 1) : undefined,
        }
    })

    const rowSelection = {
        selectedRowKeys: selRowKeys,
        onChange: (selectedRowKeys) => setSelRowKeys(selectedRowKeys)
    };

    const startZipDownload = () => {
        // keep only table and plots that are part of selected steps
        const selPlots = selItems.plots.filter(s => selRowKeys.includes(s))
        const selTables = selItems.table.filter(s => selRowKeys.includes(s))
        const mergedSelItems = {plots: selPlots, tables: selTables, steps: selRowKeys, analysisId: props.analysisId}
        dispatch(setText("Prepare ZIP file.."))
        const fileName = props.resultName + "-" + (props.analysisName ? props.analysisName : "").replace(/\\s+/, "-").replace(/--+/, "-")

        fetch(globalConfig.urlBackend + 'analysis/zip/' + props.analysisId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mergedSelItems)
        }).then(response => {
                if(response.ok){
                    response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = fileName + '.zip';
                        a.click();
                    })
                    dispatch(setIdle())
                }else {
                    response.text().then(text => {
                        const err = JSON.parse(text).message
                        console.error("ZIP download error: " + err)
                        dispatch(setError({title: "Error while creating ZIP file", text: text}))
                        //props.setError(err)
                    })
                }
            })

        props.handleCancel()
    }

    return (
        <Modal title={"Download results as ZIP"} onOk={() => startZipDownload()}
               onCancel={() => props.handleCancel()}
               open={true}
               width={800}
        >
            <h3>Select steps to include:</h3>
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                size={"small"}
                pagination={false}
            />
        </Modal>
    );
}