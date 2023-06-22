
const primaryButton = 0;

export const onClick = (e, itemId, allItems, selItems, setSelItems) => {
    if (e.button !== primaryButton) {
        return;
    }

    e.preventDefault();

    if (wasToggleInSelectionGroupKeyUsed(e)) {
        toggleSelectionInGroup(itemId, selItems, setSelItems)
        return;
    }

    if (wasMultiSelectKeyUsed(e)) {
        multiSelectTo(itemId, allItems, selItems, setSelItems)
        return;
    }

    toggleSelection(itemId, selItems, setSelItems)
}

const wasToggleInSelectionGroupKeyUsed = (event) => {
    const isUsingWindows = navigator.userAgentData.platform.indexOf('Win') >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
};

// Determines if the multiSelect key was used
const wasMultiSelectKeyUsed = (event) => event.shiftKey;


const  toggleSelection = (itemId, selItems, setSelItems) => {
    const mySelItems = selItems
    const wasSelected = mySelItems.includes(itemId);

    const newTaskIds = (() => {
        if (!wasSelected) {
            return [itemId];
        }

        if (mySelItems.length > 1) {
            return [itemId];
        }

        return [];
    })();

    setSelItems(newTaskIds)
}

const toggleSelectionInGroup = (itemId, selItems, setSelItems) => {
    const mySelItems = selItems
    const index = mySelItems.indexOf(itemId);

    // if not selected - add it to the selected items
    if (index === -1) {
        setSelItems([...mySelItems, itemId])
        return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...mySelItems];
    shallow.splice(index, 1);
    setSelItems(shallow)
};

const multiSelectTo = (newItemId, allItems, selItems, setSelItems) => {
    // Nothing already selected
    if (!selItems.length) {
        return [newItemId];
    }

    const indexOfNew = allItems.indexOf(newItemId);
    const lastSelected = selItems[selItems.length - 1];

    // nothing to do here
    if (indexOfNew === lastSelected) {
        return null;
    }

    const isSelectingForwards = indexOfNew > lastSelected;
    const start = isSelectingForwards ? lastSelected : indexOfNew;
    const end = isSelectingForwards ? indexOfNew : lastSelected;

    const inBetween = allItems.slice(start, end + 1);

    // everything inbetween needs to have it's selection toggled.
    // with the exception of the start and end values which will always be selected

    const toAdd = inBetween.filter((taskId) => {
        // if already selected: then no need to select it again
        if (selItems.includes(taskId)) {
            return false;
        }
        return true;
    });

    const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
    const combined = [...selItems, ...sorted];

    setSelItems(combined)
};