import React from "react";
import {Col, Row} from 'antd';
import {BrowseResultsModal} from "./BrowseResultsModal"

class BrowseResults extends React.Component {

    constructor(props) {
        super(props);
        this.form = React.createRef();
    }

    state = {
        loading: false,
        visible: false,
    };

    render() {
        return (
            <Row justify="left">
                <Col>
                    <BrowseResultsModal buttonText={'Add new result'}/>
                </Col>
            </Row>
        );
    }
}

export default BrowseResults