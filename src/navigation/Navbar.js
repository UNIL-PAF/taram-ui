import {Col, Menu, Row} from "antd";
import {Link} from "react-router-dom";
import React from "react";

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedTab: []};
    }

    clickHome = function () {
        this.setState({selectedTab: []})
    }

    clickMainMenu = function (payload) {
        this.setState({selectedTab: [payload.key]})
    }

    render() {

        return (
            <Row>
                <Col span={8} style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
                        <Menu.Item key={"home"} onClick={() => this.clickHome()}>
                            <Link to=
                                      {"/"}>
                                PAF analysis
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                <span style={{color: 'white'}}>{this.selectedTab}</span>
                <Col span={8} style={{display: 'flex', justifyContent: 'center'}}>
                    <Menu theme="dark" mode="horizontal" selectedKeys={this.state.selectedTab}>
                        <Menu.Item key={"results"} onClick={(payload) => this.clickMainMenu(payload)}>
                            <Link to=
                                      {"/results"}>
                                Results
                            </Link>
                        </Menu.Item>
                        <Menu.Item key={"analysis"} onClick={(payload) => this.clickMainMenu(payload)}>
                            <Link to=
                                      {"/analysis"}>
                                Analysis
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
                        <Menu.Item key={"user"}>User</Menu.Item>
                    </Menu>
                </Col>
            </Row>
        )

    }
}

export default Navbar
