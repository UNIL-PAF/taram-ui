import React from "react";
import globalConfig from "./globalConfig";

export default function Versions() {
    return (
        <div>
            <p><span>Frontend version: {globalConfig.version}</span></p>
        </div>
    );
}
