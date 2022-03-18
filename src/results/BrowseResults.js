import React from "react";
import {Col, Row} from 'antd';
import {BrowseResultsModal} from "./BrowseResultsModal"

export default function BrowseResults({refreshResults}) {

    return (
        <Row justify="left">
            <Col>
                <BrowseResultsModal buttonText={'Add new result'} refreshResults={refreshResults}/>
            </Col>
        </Row>
    );

}