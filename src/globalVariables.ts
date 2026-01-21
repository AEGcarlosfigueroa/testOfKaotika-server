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

const angeloStateList = {
    angeloCaptured: 0,
    angeloDelivered: 2,
    angeloFree: 3,
    angeloAwaitingTrial: 4,
    angeloInTrial: 5
}

const states = {
    scrollState: scrollStateList.eliminated,
    obituaryState: obituaryStateList.unlocked,
    canShowArtifacts: false,
    angeloState: angeloStateList.angeloFree,
    angeloCapturer: null as string | null,
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
    deadlyEffects,
    angeloStateList
}