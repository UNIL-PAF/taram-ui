import React from "react";
import {Card} from 'antd';
import AnalysisMenu from "../AnalysisMenu"
import InitialResultParams from "./InitialResultParams";
import {setStepParameters} from "../BackendAnalysisSteps";
import {useDispatch, useSelector} from "react-redux";

export default function InitialResult(props) {
    const results = JSON.parse(props.data.results)
    const dispatch = useDispatch();
    const paramsData = useSelector((state) => state.analysisStepParams.data)

    const onClickOk = () => {
        // format the data for the backend
        const formattedParams = paramsData.expData.reduce( (sum, d) => {
            const group = paramsData.groupData.find( (g) => {return g.targetKeys.includes(d.key)})
            sum[d.key] = { fileName: d.fileName, name: d.name, isSelected: d.isSelected, originalName: d.originalName }
            if(group) {sum[d.key].group = group.name}
            return sum
        }, {})

        dispatch(setStepParameters({resultId: props.resultId, stepId: props.data.id, params: formattedParams}))
    }

    return (
        <Card className={"analysis-step-card"} title={"Initial Result"} headStyle={{textAlign: 'left'}} bodyStyle={{textAlign: 'left'}} extra={
            <AnalysisMenu stepId={props.data.id} resultId={props.resultId} status={props.data.status}
                          onClickOk={onClickOk}
                          paramComponent={<InitialResultParams analysisIdx={props.analysisIdx}
                                                          data={props.data}></InitialResultParams>}/>
        }>
            {results.maxQuantParameters && <p>Match between runs: <strong>{results.maxQuantParameters.matchBetweenRuns ? "TRUE" : "FALSE"}</strong></p>}
            <p>Protein groups: <strong>{results.nrProteinGroups}</strong></p>
        </Card>
    );
}
