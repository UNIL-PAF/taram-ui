import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'
import {Button, Layout, Menu} from 'antd';
import { Row, Col } from 'antd';
import React from "react";
import { Routes, Route, Link} from "react-router-dom";
import Results from "./results/Results"


const { Header, Content, Footer } = Layout;

function App() {
  return (
      <div className="App">
          <Layout className="layout">
              <Header>
                  <Row>
                      <Col span={8} style={{display: 'flex', justifyContent: 'flex-start'}}>
                          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                              <Menu.Item>PAF analysis</Menu.Item>
                          </Menu>
                      </Col>
                      <Col span={8} style={{display: 'flex', justifyContent: 'center'}}>
                          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                              <Menu.Item>Results</Menu.Item>
                              <Menu.Item>Analysis</Menu.Item>
                          </Menu>
                      </Col>
                      <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                              <Menu.Item>User</Menu.Item>
                          </Menu>
                      </Col>

                  </Row>

              </Header>
        <h1>Welcome to React Router!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
          </Layout>
      </div>
  );
}

function Home() {
  return (
      <>
        <main>
          <h2>Welcome to the homepage!</h2>
          <p>You can do this, I believe in you.</p>
        </main>
        <nav>
          <Link to="/about">About</Link>
            <Button type="primary">Cuicuic</Button>
        </nav>
      </>
  );
}

function About() {
  return (
      <>
        <main>
          <h2>Who are we?</h2>
          <p>
            That feels like an existential question, don't you
            think?
          </p>
        </main>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </>
  );
}

export default App;
