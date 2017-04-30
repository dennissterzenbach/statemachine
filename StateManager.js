function State(name, id, htmlElement) {
    this.name = name;
    this.id = id;
    this.element = htmlElement;

    this.onActivatedCallbacks = [];
    this.onDeactivatedCallbacks = [];
}

function StateManager() {
    this.states = [];
    this.statesByName = {};
    this.activeState = undefined;
}

StateManager.prototype.registerState = function(stateObj) {
    this.states.push(stateObj);
    this.statesByName[stateObj.name] = stateObj;
};

StateManager.prototype.initialize = function initialize() {
    if (this.states.length && !this.activeState) {
        this.activateState(this.states[0].name);
    }
};

StateManager.prototype.getRegisteredState = function getRegisteredState(name) {
    return this.statesByName[name];
};

StateManager.prototype.activateState = function activateState(stateName) {
    // console.debug('active state.before:', this.activeState ? this.activeState.name : '-none-');

    if (this.activeState) {
        // there is a state active
        // so first check if it is the same
        // then remove this from being active
        // then activate
        
        if (this.activeState.name === stateName) {
            return; // do nothing, it is already active
        }

        markStateElementInactive(this.activeState.element);

        runCallbacks(this.activeState.onDeactivatedCallbacks, this.activeState);
    }

    this.activeState = this.getRegisteredState(stateName);

    markStateElementActive(this.activeState.element);

    runCallbacks(this.activeState.onActivatedCallbacks, this.activeState);

    function markStateElementInactive(element) {
        if (element) {
            element.classList.remove('is-active');
        }
    }

    function markStateElementActive(element) {
        if (element) {
            element.classList.add('is-active');
        }
    }

    // console.debug('active state.after:', this.activeState ? this.activeState.name : '-none-');
};

function runCallbacks(callbackFns, state) {
    if (!callbackFns) return;
    if (!callbackFns.length) return;

    callbackFns.forEach(function(fn) {
        fn(state);
    });
}
