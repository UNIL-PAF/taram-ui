import React from "react";
import {formNum} from "../../common/NumberFormatting"
import "../AnalysisStep.css"

export default function OneDEnrichmentTable(props) {

    const formatVal = (v) => {
        const myV = typeof (v) === "number" ? formNum(v) : v
        return myV
    }

    const plotRow = (row) => {
        const pVal = (props.params && props.params.fdrCorrection === true) ? row.qvalue : row.pvalue

        return <tr key={row.id}>
                <td className={"sum-table-cell"}>{row.column}</td>
                <td className={"sum-table-cell"}>{row.type}</td>
                <td className={"sum-table-cell"}>{row.name}</td>
                <td className={"sum-table-cell"}>{row.size}</td>
                <td className={"sum-table-cell"}>{formatVal(row.score)}</td>
                <td className={"sum-table-cell"}>{formatVal(pVal)}</td>
                <td className={"sum-table-cell"}>{formatVal(row.median)}</td>
            </tr>
    }

    const pValHeader = (props.params && props.params.fdrCorrection === true) ? "Adj. p-value" : "P-value"

    return (
        <table className={props.zoom ? "sum-table-zoom" : ""} >
            <thead>
            <tr>
                <th className={"sum-table-header"}>Column</th>
                <th className={"sum-table-header"}>Type</th>
                <th className={"sum-table-header"}>Name</th>
                <th className={"sum-table-header"}>Size</th>
                <th className={"sum-table-header"}>Score</th>
                <th className={"sum-table-header"}>{pValHeader}</th>
                <th className={"sum-table-header"}>Median</th>
            </tr>
            </thead>
            <tbody>
            {props.results && props.results.map(a => plotRow(a))}
            </tbody>
        </table>
    );
}