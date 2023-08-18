import './App.less';
import 'antd/dist/antd.less'
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
