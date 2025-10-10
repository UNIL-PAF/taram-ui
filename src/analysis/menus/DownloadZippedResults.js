import React, {useEffect, useState} from "react";
import {Checkbox, Modal, Table} from "antd";
import globalConfig from "../../globalConfig";
import {typeToName} from "../../analysis_steps/TypeNameMapping";
import {useDispatch} from "react-redux";
import {setText, setError, setIdle} from "../../navigation/loadingSlice"

export default function DownloadZippedResults(props) {

    const [selItems, setSelItems] = useState({'mainTables': [], 'specialTables': [], 'plots': []})
    const [selRowKeys, setSelRowKeys] = useState()

    const dispatch = useDispatch();

    useEffect(() => {
        if (!selRowKeys && props.data && props.data.analysisSteps) {
            setSelRowKeys(props.data.analysisSteps.map(s => s.id))
            const mainTableIds = props.data.analysisSteps.filter(s => (s.modifiesResult && s.tableNr)).map(s => s.id)
            const specialTableIds = props.data.analysisSteps.filter(s => hasOtherTable(s)).map(s => s.id)
            const allPlotIds = props.data.analysisSteps.filter(s => s.results == null).map(s => s.id)
            setSelItems({...selItems, mainTables: mainTableIds, specialTables: specialTableIds, plots: allPlotIds})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, selRowKeys])

    const hasOtherTable = (step) => {
        return (step.type === "summary-stat" ||
            step.type === "correlation-table" ||
            step.type === "one-d-enrichment")
    }

    const greyItem = (text, item) => {
        if (!selRowKeys) return <span></span>
        return (selRowKeys.includes(item.key)) ? <span>{text}</span> : <span style={{color: "grey"}}>{text}</span>
    }

    const greyCheckbox = (item, field) => {
        if (!selRowKeys) return <span></span>
        if (item[field]) return renderCheckbox(item[field], field, item.key, selRowKeys.includes(item.key))
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
            title: 'Table',
            dataIndex: 'table',
            render: (text, item) => {
                return <>
                    {item.mainTables && greyCheckbox(item, "mainTables")}
                    {item.specialTables && greyCheckbox(item, "specialTables")}
                    </>
            }
        },
        {
            title: 'Plots',
            dataIndex: 'plots',
            render: (text, item) => greyCheckbox(item, "plots")
        },
    ];

    const getSpecialTable = (step, idx) => {
        if(step.type === "summary-stat"){
            return "Summary-table-" + idx
        }else if(step.type === "one-d-enrichment"){
            return "Enrichment-table-" + idx
        }else if(step.type === "correlation-table"){
            return "Correlation-table-" + idx
        }
        return undefined
    }

    const data = props.data.analysisSteps.map((s, i) => {
        console.log(s)
        const hasPlot = (s.results == null) ? true : false
        const idx = i + 1
        return {
            key: s.id,
            type: typeToName(s.type),
            idx: idx,
            mainTables: (s.modifiesResult && idx) ? "Table-" + idx : undefined,
            specialTables: getSpecialTable(s, idx),
            plots: hasPlot ? s.type + "-" + idx : undefined,
        }
    })

    const rowSelection = {
        selectedRowKeys: selRowKeys,
        onChange: (selectedRowKeys) => setSelRowKeys(selectedRowKeys)
    };

    const startZipDownload = () => {
        // keep only table and plots that are part of selected steps
        const selPlots = selItems.plots.filter(s => selRowKeys.includes(s))
        const selMainTables = selItems.mainTables.filter(s => selRowKeys.includes(s))
        const selSpecialTables = selItems.specialTables.filter(s => selRowKeys.includes(s))
        const mergedSelItems = {plots: selPlots, mainTables: selMainTables, specialTables: selSpecialTables, steps: selRowKeys, analysisId: props.analysisId}
        dispatch(setText("Prepare ZIP file.."))
        const fileName = (props.resultName + (props.analysisName ? ("-" + props.analysisName) : "")).replace(/\s+/, "-").replace(/--+/, "-")

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
