import React, {useState} from "react";
import GroupSelection from "./GroupSelection";
import {Button, Switch} from "antd";
import TabularGroupSelection from "./TabularGroupSelection";

export default function DefineGroupsParams(props) {

    const [tabularView, setTabularView] = useState(false)

    const switchTabularTable = () => {
        const newTabularView = !tabularView;
        setTabularView(newTabularView);
        props.setParams({...props.params, tabularData: newTabularView})
    }

    const moveGroupLeft = (groupName, currentPos) => {
        const newGroupsOrdered =  [
            ...props.params.groupsOrdered.slice(0, currentPos-2),
            groupName,
            ...props.params.groupsOrdered.slice(currentPos-2, currentPos-1),
            ...props.params.groupsOrdered.slice(currentPos),
        ]

        props.setParams({...props.params,
            groupsOrdered: newGroupsOrdered
        })
    }

    const moveGroupRight = (groupName, currentPos) => {
        const newGroupsOrdered =  [
            ...props.params.groupsOrdered.slice(0, currentPos-1),
            ...props.params.groupsOrdered.slice(currentPos, currentPos+1),
            groupName,
            ...props.params.groupsOrdered.slice(currentPos+1),
        ]

        props.setParams({...props.params,
            groupsOrdered: newGroupsOrdered
        })
    }

    return (
        <>
            <span>
                <h3 style={{display: 'inline', marginRight: 40}}>Edit and order groups</h3>
                <Switch onChange={switchTabularTable}
                        checked={tabularView}></Switch> Switch to tabular view
            </span>
            {props.params &&
                <>
                    {tabularView && <TabularGroupSelection
                        setParams={props.setParams}
                        params={props.params}
                    ></TabularGroupSelection>}
                    {tabularView || <GroupSelection
                        moveGroupLeft={moveGroupLeft}
                        moveGroupRight={moveGroupRight}
                        setParams={props.setParams}
                        params={props.params}
                    ></GroupSelection>}
                </>
            }
        </>
    );
}
