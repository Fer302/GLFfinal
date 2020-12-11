let LAST_COMPLETED_STEP_COUNT = 0;

class Transition {
    constructor(state, nextStates, symbol) {
        if (!(typeof state === 'string' || state instanceof String))
            throw new Error("Expected a single state (string)");

        if (!Array.isArray(nextStates)) {
            console.warn("Expected nextStates in transition to be an array");
            let arr = [];
            arr.push(nextStates.toString());
            nextStates = arr;
        }

        if (!(typeof symbol === 'string' || symbol instanceof String))
            throw new Error("Expected a string symbol");

        this.state = state;
        this.nextStates = nextStates;
        this.symbol = symbol;
    }
}

