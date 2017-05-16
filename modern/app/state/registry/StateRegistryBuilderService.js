class StateRegistryBuilderService {
    constructor(logger, stateFactory) {
        this.logger = logger;
        this.stateFactory = stateFactory;
    }

    initStateRegistry(stateConfigurationService) {
        let availStateNames = Object.keys(stateConfigurationService.config);
        let stateRegistry = new StateRegistry(this.logger);
        let contentLoader = new ContentLoader(this.logger);

        function createState(type, descriptor) {
            return stateFactory.createState(type, descriptor);
        }

        for (let i in availStateNames) {
            let stateId = availStateNames[i];
            let stateConf = stateConfigurationService.config[stateId];

            stateRegistry.addState(createState.call(this, stateConf.type, [ stateConf.name, stateId, document.querySelector(stateConf.selector) ]));
        }

        for (let [stateId, state] of stateRegistry.registeredStates()) {
            if (!state.previousStates) {
                state.previousStates = [];
            }

            if (!state.nextStates) {
                state.nextStates = [];
            }

            if (stateConfigurationService.config[stateId]) {
                let stateConf = stateConfigurationService.config[stateId];

                if ('loader' in stateConf) {
                    state.setContentLoader(contentLoader.getLoader(stateConf.loader));
                }

                if (true || stateConf.useCallbacks) {
                    if (!state.onBeforeDeactivatedCallbacks) {
                        state.onBeforeDeactivatedCallbacks = [];
                    }

                    state.onBeforeDeactivatedCallbacks.push(function(state) {
                        this.logger.log('onBeforeDeactivatedCallback called for "%s"', state.name);

                        return true;
                    }.bind(this));
                }

                addPrevStates(stateConf, state);
                addNextStates(stateConf, state);
            }
        }

        function addNextStates(stateConf, state) {
            if (stateConf.next) {
                let nextStateId = stateConf.next;

                if (stateRegistry.has(nextStateId)) {
                    state.nextStates.push(stateRegistry.getState(nextStateId));
                }
            }
        }

        function addPrevStates(stateConf, state) {
            if (stateConf.prev) {
                let previousStateId = stateConf.prev;

                if (stateRegistry.has(previousStateId)) {
                    state.previousStates.push(stateRegistry.getState(previousStateId));
                }
            }
        }

        return stateRegistry;
    }
}
