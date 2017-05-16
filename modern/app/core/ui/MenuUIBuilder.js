class MenuUIBuilder {
    constructor(logger, virtualDOM) {
        this.logger = logger;
        this.virtualDOM = virtualDOM;
    }

    addMenuToDOM(parentElementSelector, menuDOM) {
        if (!this.virtualDOM.addToRealDOMElement(parentElementSelector, menuDOM)) {
            this.logger.error('MenuBuilder.addMenuToDOM cannot find parent element by selector "%s"', parentElementSelector);
        }
    }

    buildMenuFromRegistry(stateRegistry) {
        let menuElement = this.virtualDOM.createElement('ul');
        let menuEntries = [];

        for (let [i, state] of stateRegistry.registeredStates()) {
            this.logger.debug('MenuBuilder.buildMenuFromRegistry:', i, state);

            menuEntries.push(createMenuEntryElement.call(this, state));
        }

        this.virtualDOM.appendChildren(menuElement, menuEntries);

        this.logger.debug('MenuBuilder.buildMenuFromRegistry. done.', menuElement);

        return menuElement;

        function createMenuEntryElement(state) {
            let element = this.virtualDOM.createElement('li');
            let link = this.virtualDOM.createElement('a', { innerText: state.name });

            this.virtualDOM.addAttributeToElement(link, { name: 'data-state' });
            this.virtualDOM.addAttributeToElement(link, { name: 'data-state-id', value: state.id.replace('section', '') });
            this.virtualDOM.addAttributeToElement(link, { name: 'href', value: '#' + state.id });

            this.virtualDOM.appendChildren(element, [link]);

            return element;
        }
    }
}
