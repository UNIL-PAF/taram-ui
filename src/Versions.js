import React, {useEffect, useState} from "react";
import globalConfig from "./globalConfig";
import axios from "axios";

export default function Versions() {

    const [version, setVersion] = useState([]);

    useEffect(() => {
        axios.get(globalConfig.urlBackend + 'version')
            .then((response) => {
                // handle success
                // add a unique key
                console.log(response)
                setVersion(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [])



    return (
        <div>
            <p><span>Frontend version: {globalConfig.version}</span></p>
            <p><span>Backend version: {version}</span></p>
        </div>
    );
}
