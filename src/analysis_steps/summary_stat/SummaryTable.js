import React from "react";
import {formNum} from "../../common/NumberFormatting"
import "../AnalysisStep.css"

export default function SummaryTable(props) {

    const plotTr = (name, field, nrEntries) => {
        const myData = (props.results[field] ? props.results[field] : Array.apply(null, Array(nrEntries)).map((x) => { return "" }))
        const l = myData.map((a, i) => {
            const v = typeof (a) === "number" ? formNum(a) : a
            return <td className={"sum-table-cell"} key={i}>{v}</td>
        })

        return <tr key={field}>
            <th>{name}</th>
            {l}
        </tr>
    }

    const nrEntries = props.results.min.length

    return (
        <table className={props.zoom ? "sum-table-zoom" : ""} >
            <tbody>
                {plotTr("Name", "expNames", nrEntries)}
                {plotTr("Group", "groups", nrEntries)}
                {plotTr("Min", "min", nrEntries)}
                {plotTr("Max", "max", nrEntries)}
                {plotTr("Mean", "mean", nrEntries)}
                {plotTr("Median", "median", nrEntries)}
                {plotTr("Sum", "sum", nrEntries)}
                {plotTr("Std dev", "stdDev", nrEntries)}
                {plotTr("Std err", "stdErr", nrEntries)}
                {plotTr("Coef of var", "coefOfVar", nrEntries)}
                {plotTr("Nr of valid", "nrValid", nrEntries)}
                {plotTr("Nr of NaN", "nrNaN", nrEntries)}
            </tbody>
        </table>
    );
}