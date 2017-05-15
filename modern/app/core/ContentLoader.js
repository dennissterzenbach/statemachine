class ContentLoader {
    constructor(logger) {
        this.logger = logger;
    }

    getLoader(loaderConfig) {
        let localLogger = this.logger;

        localLogger.debug('contentLoader setup according to', loaderConfig);

        return function contentLoaderFn() {
            // localLogger.debug('contentLoader.load %s', this.name, 'from', DCService[this.name]);
            localLogger.debug('contentLoader.load %s', this.name);

            let HTMLString = DCService[this.name]();

            // localLogger.debug('HTMLString "%s": ', this.name, HTMLString);

            let elements = getDOMNodesFromHTMLString(HTMLString);
            let contentElement = this.element.querySelector('[data-section-content]');

            // localLogger.debug('state contentElement', contentElement);
            // localLogger.debug('elements', elements);

            elements.forEach((item) => {
                // localLogger.debug(this.element, item);

                contentElement.appendChild(item);
            });

            function getDOMNodesFromHTMLString(string) {
                let div = document.createElement('div');
                div.innerHTML = string.trim();
                return div.childNodes;
            }
        }
    }
}