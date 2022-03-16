import React from "react";
import GroupSelection from "./GroupSelection";
import {Divider} from "antd";
import ExperimentsSelection from "./ExperimentsSelection";

export default function InitialResultParams(props) {



    return (
        <>
            <h3>Experiments</h3>
            <ExperimentsSelection data={props.data.columnMapping}></ExperimentsSelection>
            <Divider/>
            <h3>Group selection</h3>
            <GroupSelection analysisIdx={props.analysisIdx}
                            data={props.data}></GroupSelection>
        </>
    );
}
