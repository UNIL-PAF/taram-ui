import {Col, Menu, Row} from "antd";
import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";

export default function Navbar() {

    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState([]);
    const pattern = /[0-9|/]/g;

    useEffect(() => {
        setSelectedTab([location.pathname.replaceAll(pattern, '')])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const clickHome = function () {
        setSelectedTab([])
    }

    const clickMainMenu = function (payload) {
        setSelectedTab([payload.key])
    }

    return (
        <Row>
            <Col span={6} style={{display: 'flex', justifyContent: 'flex-start'}}>
                <Menu theme="dark" mode="horizontal" selectedKeys={[]} disabledOverflow={true}>
                    <Menu.Item key={"home"} onClick={() => clickHome()}>
                        <Link to=
                                  {"/analysis"}>
                            Taram
                        </Link>
                    </Menu.Item>
                </Menu>
            </Col>
            <Col span={12} style={{display: 'flex', justifyContent: 'center'}}>
                <Menu theme="dark" mode="horizontal" selectedKeys={selectedTab} disabledOverflow={true}>
                    <Menu.Item key={"analysis"} onClick={(payload) => clickMainMenu(payload)}>
                        <Link to=
                                  {"/analysis"}>
                            Analysis
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={"viewer"} onClick={(payload) => clickMainMenu(payload)}>
                        <Link to=
                                  {"/viewer"}>
                            Viewer
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={"templates"} onClick={(payload) => clickMainMenu(payload)}>
                        <Link to=
                                  {"/templates"}>
                            Templates
                        </Link>
                    </Menu.Item>
                </Menu>
            </Col>
            <Col span={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                {/*<Menu theme="dark" mode="horizontal" selectedKeys={[]} disabledOverflow={true}>
                    <Menu.Item key={"user"}>User</Menu.Item>
                </Menu>*/}
            </Col>
        </Row>
    )
}
