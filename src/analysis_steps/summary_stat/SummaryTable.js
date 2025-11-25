import React from "react";
import {formNum} from "../../common/NumberFormatting"
import "../AnalysisStep.css"

export default function SummaryTable(props) {

    const plotHeaders = () => {
        return <tr key={"header"}>
            <th className={"sum-table-header"}>{"Name"}</th>
            <th className={"sum-table-header"}>{"Group"}</th>
            <th className={"sum-table-header"}>{"Min"}</th>
            <th className={"sum-table-header"}>{"Max"}</th>
            <th className={"sum-table-header"}>{"Median"}</th>
            <th className={"sum-table-header"} style={{color: "#ff4d4f"}}>{"Nr of valid"}</th>
            <th className={"sum-table-header"}>{"Nr of NaN"}</th>
            {props.results.nrOfPeps && <th className={"sum-table-header"}>{"Nr of peptides *"}</th>}
        </tr>
    }

    const plotAllTr = () => {
        return props.results.expNames.map((name, i) => {
            return <tr key={name}>
                <td className={"sum-table-cell"} key={i + "-1"}>{name}</td>
                <td className={"sum-table-cell"}
                    key={i + "-2"}>{props.results.groups ? props.results.groups[i] : ""}</td>
                <td className={"sum-table-cell"} key={i + "-3"}>{formNum(props.results.min[i])}</td>
                <td className={"sum-table-cell"} key={i + "-4"}>{formNum(props.results.max[i])}</td>
                <td className={"sum-table-cell"} key={i + "-5"}>{formNum(props.results.median[i])}</td>
                <td className={"sum-table-cell"} style={{color: "#ff4d4f"}}
                    key={i + "-6"}>{formNum(props.results.nrValid[i])}</td>
                <td className={"sum-table-cell"} key={i + "-7"}>{formNum(props.results.nrNaN[i])}</td>
                {props.results.nrOfPeps && <td className={"sum-table-cell"} key={i + "-8"}>{props.results.nrOfPeps[i]}</td>}
            </tr>
        })
    }

    const addPeptideSource = () => {
        const pepSource = (props.resType === "MaxQuant") ? "Razor.unique.peptides" : "NrOfPrecursorsIdentified"
        return <div style={{textAlign: "center", fontSize: "small"}}>
            <span><em>* {pepSource}</em></span>
        </div>
    }

    return (
        <>
            <table className={props.zoom ? "sum-table-zoom" : ""}>
                <tbody>
                {plotHeaders()}
                {plotAllTr()}
                </tbody>
            </table>
            {props.results.nrOfPeps && props.resType && addPeptideSource()}
        </>
    );
}