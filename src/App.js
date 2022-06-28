import './App.css';
import 'antd/dist/antd.css'
import {Layout} from 'antd';
import React from "react";
import MyRoutes from "./navigation/MyRoutes";

function App() {
    return (
        <div className="App">
            <Layout>
                <MyRoutes/>
            </Layout>
        </div>
    );
}

export default App;
