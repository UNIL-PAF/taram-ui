import React from "react";
import {Col, Row} from 'antd';
import {BrowseResultsModal} from "./BrowseResultsModal"

export default function BrowseResults({refreshResults}) {

    return (
        <Row justify="left">
            <Col>
                <BrowseResultsModal buttonText={'Add new analysis'} refreshResults={refreshResults}/>
            </Col>
        </Row>
    );

}