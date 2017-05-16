class StateFactory {
    constructor(logger) {
        this.logger = logger;
    }

    createState(type, descriptor) {
        let state;
        let [name, id, element] = descriptor;

        // this.logger.debug('createState', type, name, id, element, '||', descriptor);

        if (type === 'StateSection1') {
            state = new StateSection1(name, id, element);
        } else {
            state = new State(name, id, element);
        }

        return state;
    }
}
