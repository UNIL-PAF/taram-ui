import React from "react";
import {Row, Col, Button} from 'antd';

class BrowseResults extends React.Component {
    render() {
        return (
            <Row justify="left">
                <Col>
                    <Button>Add new result</Button>
                </Col>
            </Row>
        );
    }
}

export default BrowseResults