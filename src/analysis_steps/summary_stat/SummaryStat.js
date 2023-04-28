import React, {useState} from "react";
import {Card} from "antd";
import AnalysisStepMenu from "../menus/AnalysisStepMenu";
import StepComment from "../StepComment";
import {formNum} from "../../common/NumberFormatting"
import "../AnalysisStep.css"

export default function SummaryStat(props) {
    const params = JSON.parse(props.data.parameters)
    const [localParams, setLocalParams] = useState(params)
    const results = JSON.parse(props.data.results)

    const plotTr = (name, field) => {
        const l = results[field].map((a, i) => {
            const v = typeof (a) === "number" ? formNum(a) : a
            return <td className={"sum-table-cell"} key={i}>{v}</td>
        })

        return <tr key={field}>
            <th>{name}</th>
            {l}
        </tr>
    }

    return (
        <Card className={"analysis-step-card" + (props.isSelected ? " analysis-step-sel" : "")}
              onClick={props.onSelect}
              title={props.data.nr + " - Summary"}
              headStyle={{textAlign: 'left'}}
              bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisStepMenu stepId={props.data.id}
                              resultId={props.resultId}
                              status={props.data.status}
                              error={props.data.error}
                              paramType={"summary-stat"}
                              commonResult={props.data.commonResult}
                              stepParams={localParams}
                              intCol={props.data.columnInfo.columnMapping.intCol}
                              setStepParams={setLocalParams}
                              experimentDetails={props.data.columnInfo.columnMapping.experimentDetails}
                              isSelected={props.isSelected}
                              hasImputed={props.data.imputationTablePath != null}
            />
        }>
            {props.data.copyDifference && <span className={'copy-difference'}>{props.data.copyDifference}</span>}
            {results &&
                <div>
                    <table>
                        <tbody>
                        {plotTr("Name", "expNames")}
                        {plotTr("Group", "groups")}
                        {plotTr("Min", "min")}
                        {plotTr("Max", "max")}
                        {plotTr("Mean", "mean")}
                        {plotTr("Median", "median")}
                        {plotTr("Sum", "sum")}
                        {plotTr("Std dev", "stdDev")}
                        {plotTr("Std err", "stdErr")}
                        {plotTr("Coef of var", "coefOfVar")}
                        {plotTr("Nr of valid", "nrValid")}
                        </tbody>
                    </table>

                </div>
            }
            <StepComment stepId={props.data.id} resultId={props.resultId} comment={props.data.comments}></StepComment>
        </Card>
    );
}