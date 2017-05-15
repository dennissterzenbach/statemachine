class StateRegistry {
    constructor(logger) {
        this.states = {};
        this.current = undefined;
        this.logger = logger;
    }

    get currentState() {
        return this.current;
    }

    getState(stateName) {
        return this.has(stateName) && this.states[stateName];
    }

    has(stateName) {
        return stateName && this.states && (stateName in this.states);
    }

    addState(state) {
        if (state && state.name) {
            this.states[state.name] = state;
        }

        if (Object.keys(this.states).length === 1) {
            this.updateCurrentState(state);
        }

        return this;
    }

    updateCurrentState(newCurrent) {
        if (newCurrent) {
            if (this.current) {
                // check if state can be changed and abort if not...
                if (!this.current.canLeaveState()) {
                    return this;
                }

                this.current.deactivate();
            }

            this.current = newCurrent;
            this.current.activate();

            this.logger.log('StateRegistry.updateCurrentState updated current state to "%s"', newCurrent.name);
        }

        return this;
    }
}

StateRegistry.prototype.registeredStates = function* registeredStates() {
    let i = 0;
    let keys = Object.keys(this.states);
    let numKeys = keys.length;

    while (i + 1 <= numKeys) {
        yield [ keys[i], this.states[keys[i]] ];
        i++;
    }
};
