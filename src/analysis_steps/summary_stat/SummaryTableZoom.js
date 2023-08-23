import React from "react";
import {Button, Modal} from "antd";
import "../AnalysisStep.css"
import SummaryTable from "./SummaryTable";
import {DownloadOutlined} from "@ant-design/icons";
import globalConfig from "../../globalConfig";

export default function SummaryTableZoom(props) {

    const downloadTable = () => {
        fetch(globalConfig.urlBackend + 'analysis-step/result/' + props.stepId )
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'Summary_table-' + props.stepNr + '.txt';
                    a.click();
                });
                //window.location.href = response.url;
            });
    }

    const getTitle = () => {
        return <>
            <span>Summary table <Button onClick={() => downloadTable()} type={"primary"} style={{marginLeft: "10px"}} icon={<DownloadOutlined />}>Download table</Button></span>
        </>
    }

    return (
       <>
           <Modal open={props.showZoom} title={getTitle()} onCancel={() => props.setShowZoom(false)}
                  width={"95%"} height={"100%"} footer={null} bodyStyle={{overflowY: 'scroll'}}
           >
               <div style={{height: '100%'}}>
                   <SummaryTable results={props.results} zoom={true}></SummaryTable>
               </div>
           </Modal>
       </>
    );
}