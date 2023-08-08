import React, {useEffect, useState} from "react";
import {Button, Checkbox, Col, Modal, Row, Space} from "antd";
import globalConfig from "../../globalConfig";
import {useDispatch} from "react-redux";
import {setError} from "../../analysis/analysisSlice";

export default function DownloadZippedResults(props) {
    const renderStep = (step) => {
        console.log(step)

        return <Row>
            <Col span={8}>Coucou</Col>
            <Col span={8}>Blibla</Col>
            <Col span={8}>Piip</Col>
            </Row>
    }

    return (
        <Modal title={"Download results as ZIP"} onOk={() => props.handleOk()}
               onCancel={() => props.handleCancel()}
               width={300}
               visible={true}
        >
            <h3>Select steps to include</h3>
            {props.data.analysisSteps.map( s => renderStep(s))}
        </Modal>
    );
}
