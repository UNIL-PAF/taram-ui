import React, {useEffect} from "react";
import {Checkbox} from 'antd';

export default function FilterParams(props) {

    useEffect(() => {
        if(! props.params){
            props.setParams({
                removeOnlyIdentifiedBySite: true,
                removeReverse: true,
                removePotentialContaminant: true
            })
        }
    }, [props])


    function handleChange(field, checked) {
        let newParams = {...props.params}
        newParams[field] = checked
        props.setParams(newParams)
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
