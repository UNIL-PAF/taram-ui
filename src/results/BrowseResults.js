import React from "react";
import {Col, Row} from 'antd';
import {BrowseResultsModal} from "./BrowseResultsModal"

export default function BrowseResults() {

    return (
        <Row justify="left">
            <Col>
                <BrowseResultsModal buttonText={'Add new result'}/>
            </Col>
        </Row>
    );

}