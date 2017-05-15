function StateController() {
    this.messagesRegistry = {
        next: 'next',
        prev: 'prev'
    };

    this.store = new StateStore(stateRegistry, {});

    function possiblyUpdateCurrentState(newState) {
        if (newState) {
            this.store.model.updateCurrentState(newState);
        }

        return this.store.model;
    }

    let messages = {};
    messages[this.messagesRegistry.next] = (state) => {
        let newState;

        if (state && this.store.model.has(state.name)) {
            let stateInRegistry = this.store.model.getState(state.name);
            newState = stateInRegistry.getLinkedState('next');
        }

        return possiblyUpdateCurrentState.call(this, newState);
    };

    messages[this.messagesRegistry.prev] = (state) => {
        let newState;

        if (state && this.store.model.has(state.name)) {
            let stateInRegistry = this.store.model.getState(state.name);
            newState = stateInRegistry.getLinkedState('prev');
        }

        return possiblyUpdateCurrentState.call(this, newState);
    };

    this.store.messages = messages;

    this.update = (message, model, ...args) => {
        if (message in this.store.messages) {
            this.store.model = this.store.messages[message](model, ...args);
        }

        return this;
    };

    this.canUpdateState = () => {
        if (this.store && this.store.model && this.store.model.current) {
            return this.store.model.current.canLeaveState();
        }

        return false;
    };
}
