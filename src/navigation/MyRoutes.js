import {Layout} from "antd";
import {Route, Routes} from "react-router-dom";
import Results from "../results/Results";
import Navbar from "./Navbar";
import Analysis from "../analysis/Analysis";
import React from "react";
import Templates from "../templates/Templates";

const {Header} = Layout;

class MyRoutes extends React.Component {
    render() {
        return (
            <>
                <Header>
                    <Navbar/>
                </Header>
                <Routes>
                    <Route path="/" element={<Results/>}/>
                    <Route path="analysis" element={<Results/>}/>
                    <Route path="viewer" element={<Analysis/>}>
                        <Route path=":resultId" element={<Analysis />} />
                    </Route>
                    <Route path="templates" element={<Templates/>}>
                        <Route path=":templateId" element={<Templates />} />
                    </Route>
                </Routes>
            </>
        )

    }
}

export default MyRoutes

