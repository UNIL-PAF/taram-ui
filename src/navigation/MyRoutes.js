import {Layout} from "antd";
import {Route, Routes} from "react-router-dom";
import Results from "../results/Results";
import Navbar from "./Navbar";
import Home from "../home/Home";
import Analysis from "../analysis/Analysis";
import React from "react";

const {Header} = Layout;

class MyRoutes extends React.Component {
    render() {
        return (
            <>
                <Header>
                    <Navbar/>
                </Header>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="results" element={<Results/>}/>
                    <Route path="analysis" element={<Analysis/>}/>
                </Routes>
            </>
        )

    }
}

export default MyRoutes

