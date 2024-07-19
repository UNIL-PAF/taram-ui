import React from "react";
import GroupSelection from "./GroupSelection";

export default function DefineGroupsParams(props) {

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
            <h3>Experiments</h3>
            {props.params &&
                <>
                    <h3>Group selection</h3>
                    <GroupSelection
                                    moveGroupLeft={moveGroupLeft}
                                    moveGroupRight={moveGroupRight}
                                    setParams={props.setParams}
                                    params={props.params}
                    ></GroupSelection>
                </>
            }
        </>
    );
}
