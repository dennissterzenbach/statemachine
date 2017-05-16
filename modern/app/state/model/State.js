class State {
    constructor(name, id, htmlElement) {
        this.name = name;
        this.id = id;
        this.element = htmlElement;
        this.activated = false;

        // this.contentLoader;

        this.onActivatedCallbacks = [];
        this.onDeactivatedCallbacks = [];
    }

    setContentLoader(contentLoader) {
        contentLoader.bind(this);

        this.contentLoader = contentLoader;
    }

    loadContent() {
        if (this.contentLoader) {
            this.contentLoader();
        }
    }

    getLinkedState(type) {
        const typeToPropertyMap = {
            next: 'nextStates',
            prev: 'previousStates'
        };

        // type must be given
        // also must type be valid and map to a property name
        if (type) {
            if (type in typeToPropertyMap) {
                let propName = typeToPropertyMap[type];

                // when there is matching content found as this property's value
                // then return the first entry from that value
                if (propName in this && (this[propName].length > 0)) {
                    return this[propName][0];
                }
            }
        }

        return undefined;
    }

    canLeaveState() {
        if (this.onBeforeDeactivatedCallbacks && (this.onBeforeDeactivatedCallbacks.length > 0)) {
            // console.log('State.canLeaveState must call callbacks first');

            for (let [i, callback] of this.onBeforeDeactivatedCallbacks.entries()) {
                if (!callback(this)) {
                    return false;
                }
            }
        }

        return true;
    }

    activate() {
        this.activated = true;

        if (this.onActivatedCallbacks && (this.onActivatedCallbacks.length > 0)) {
            for (let [i, callback] of this.onActivatedCallbacks.entries()) {
                callback(this);
            }
        }
    }

    deactivate() {
        this.activated = false;

        if (this.onDeactivatedCallbacks && (this.onDeactivatedCallbacks.length > 0)) {
            for (let [i, callback] of this.onDeactivatedCallbacks.entries()) {
                callback(this);
            }
        }
    }
}

class StateSection1 extends State {
    constructor(name, id, htmlElement) {
        super(name, id, htmlElement);

        function checkIfCheckboxChecked() {
            let checkboxElement = this.element.querySelector('[name="section1TestCheck"]');

            return checkboxElement && checkboxElement.checked;
        }

        this.onBeforeDeactivatedCallbacks = this.onBeforeDeactivatedCallbacks || [];
        this.onBeforeDeactivatedCallbacks.push(checkIfCheckboxChecked.bind(this));
    }

}
