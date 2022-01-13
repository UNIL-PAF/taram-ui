import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'
import {Button, Layout, Menu} from 'antd';
import React from "react";
import MyRoutes from "./navigation/MyRoutes";

function App() {
    return (
        <div className="App">
            <Layout className="layout">
                <MyRoutes/>
            </Layout>
        </div>
    );
}

export default App;
