const scrollStateList = {
    uncollected: 0,
    collected: 1,
    eliminated: 2
}

const obituaryStateList = {
    locked: 0,
    evaluating: 1,
    unlocked: 2
}

const states = {
    scrollState: scrollStateList.eliminated,
    obituaryState: obituaryStateList.locked,
    canShowArtifacts: false
}

const coordinateList = [];

const deadlyEffects = {
    putridPlague: "0",
    epicWeakness: "1",
    medulaApocalypse: "2",
    ethaziumCurse: "3"
}


export {
    states,
    scrollStateList,
    coordinateList,
    obituaryStateList,
    deadlyEffects
}