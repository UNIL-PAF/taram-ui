import React, {useEffect, useState} from "react";
import {Checkbox} from "antd";

export default function DownloadZipModal(props) {
    const [svg, setSvg] = useState(undefined)
    const [png, setPng] = useState(undefined)
    const [table, setTable] = useState(true)
    const [imputedTable, setImputedTable] = useState(true)

    useEffect(() => {
        if(typeof svg == "undefined" && props.hasPlot){
            setSvg(true)
            setPng(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, svg])

    return (
        <>
            <h3>Download ZIP file</h3>
            {props.hasPlot && <div>
                <Checkbox
                    onChange={(val) => setSvg(val)}>SVG plot
                </Checkbox>
                <Checkbox
                    onChange={(val) => setPng(val)}>PNG plot
                </Checkbox>
            </div>}
            <br></br>
            {props.tableNr && <div>
            <Checkbox
                defaultChecked={true}
                onChange={(val) => setTable(val)}>Table <em>M{props.tableNr}</em>
            </Checkbox>
            <br></br>
                {props.hasImputed && <Checkbox
                    defaultChecked={true}
                    onChange={(val) => setImputedTable(val)}>Table <em>M{props.tableNr}</em> with imputed values
                </Checkbox>}
            </div>}
        </>
    );
}
