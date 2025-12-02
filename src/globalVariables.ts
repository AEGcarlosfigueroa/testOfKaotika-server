const scrollStateList = {
    uncollected: 0,
    collected: 1,
    eliminated: 2
}

const states = {
    scrollState: scrollStateList.eliminated,
    obituaryUnlocked: false //Controls whether the obituary is unlocked or not
}

const coordinateList = [];

export {
    states,
    scrollStateList,
    coordinateList
}