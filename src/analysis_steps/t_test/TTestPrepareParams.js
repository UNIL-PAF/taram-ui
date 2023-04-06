function prepareTTestParams(params) {
    const firstGroup = params.columns.first.items.map(item => item.name)
    const secondGroup = params.columns.second.items.map(item => item.name)
    let paramsCopy = {...params, firstGroup: firstGroup, secondGroup: secondGroup}
    delete (paramsCopy.columns)
    return paramsCopy
}

export {prepareTTestParams}