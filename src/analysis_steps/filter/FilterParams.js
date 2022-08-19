import React from "react";
import {Checkbox} from 'antd';

export default function FilterParams(props) {

    function handleChange(field, checked) {
        let newParams = {...props.localParams}
        newParams[field] = checked
        props.setLocalParams(newParams)
    }

    return (<>
            <span>
                <Checkbox defaultChecked={true}
                          onChange={(e) => handleChange("removeOnlyIdentifiedBySite", e.target.checked)}>
                </Checkbox>
                <span style={{paddingLeft: "20px"}}>Remove only-identified-by-site</span>
            </span>
            <br/>
            <br/>
            <span>
                <Checkbox defaultChecked={true}
                          onChange={(e) => handleChange("removeReverse", e.target.checked)}>
                </Checkbox>
                <span style={{paddingLeft: "20px"}}>Remove reverse</span>
            </span>
            <br/>
            <br/>
            <span>
                <Checkbox defaultChecked={true}
                          onChange={(e) => handleChange("removePotentialContaminant", e.target.checked)}>
                </Checkbox>
                <span style={{paddingLeft: "20px"}}>Remove potential contaminants</span>
            </span>

        </>);
}
