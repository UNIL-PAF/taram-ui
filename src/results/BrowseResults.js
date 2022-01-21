import React, {useState} from "react";
import {Row, Col, Button, Modal, Form, Input, Checkbox, Select, Radio} from 'antd';
import {BrowseResultsModal} from "./BrowseResultsModal"

const {Option} = Select;

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