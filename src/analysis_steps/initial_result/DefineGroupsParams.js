import React from "react";
import GroupSelection from "./GroupSelection";

export default function DefineGroupsParams(props) {

    return (
        <>
            <h3>Experiments</h3>
            {props.params &&
                <>
                    <h3>Group selection</h3>
                    <GroupSelection groupData={props.params.groupData}
                                    expData={props.params.expData}
                                    changeExpName={props.changeExpName}
                                    setGroupData={(gd) => props.setParams({...props.params,
                                        groupData: gd
                                    })}
                    ></GroupSelection>
                </>
            }
        </>
    );
}
