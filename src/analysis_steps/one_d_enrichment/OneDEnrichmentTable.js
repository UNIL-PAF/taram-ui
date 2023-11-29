import React from "react";
import {formNum} from "../../common/NumberFormatting"
import "../AnalysisStep.css"

export default function OneDEnrichmentTable(props) {

    const formatVal = (v) => {
        const myV = typeof (v) === "number" ? formNum(v) : v
        return myV
    }

    const plotRow = (row) => {
        return <>
            <tr>
                <td className={"sum-table-cell"}>{row.column}</td>
                <td className={"sum-table-cell"}>{row.type}</td>
                <td className={"sum-table-cell"}>{row.name}</td>
                <td className={"sum-table-cell"}>{row.size}</td>
                <td className={"sum-table-cell"}>{formatVal(row.score)}</td>
                <td className={"sum-table-cell"}>{formatVal(row.pValue)}</td>
                <td className={"sum-table-cell"}>{formatVal(row.qValue)}</td>
                <td className={"sum-table-cell"}>{formatVal(row.mean)}</td>
                <td className={"sum-table-cell"}>{formatVal(row.median)}</td>
            </tr>
        </>
    }
    return (
        <table className={props.zoom ? "sum-table-zoom" : ""} >
            <thead>
                <th className={"sum-table-header"}>Column</th>
                <th className={"sum-table-header"}>Type</th>
                <th className={"sum-table-header"}>Name</th>
                <th className={"sum-table-header"}>Size</th>
                <th className={"sum-table-header"}>Score</th>
                <th className={"sum-table-header"}>p-value</th>
                <th className={"sum-table-header"}>q-value</th>
                <th className={"sum-table-header"}>Mean</th>
                <th className={"sum-table-header"}>Median</th>
            </thead>
            <tbody>
            {props.results && props.results.selResults.map(a => plotRow(a))}
            </tbody>
        </table>
    );
}