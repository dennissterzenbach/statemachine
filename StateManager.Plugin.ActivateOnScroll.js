StateManager.prototype.enableActivateStateOnScroll = function enableActivateStateOnScroll(state) {
    // make it a boolean
    if (typeof state === 'undefined') {
        state = true;
    } else {
        state = !!state;
    }

    this.isEnabledActivateStateOnScroll = state;

    if (state) {
        return this.setupActivateStateOnScroll();
    }

    return function _noop() {};
}

StateManager.prototype.setupActivateStateOnScroll = function setupActivateStateOnScroll() {
    var handlerFn = onUserScrolled.bind(this);

    // console.debug('StateManager.setupActivateStateOnScroll');

    document.addEventListener('scroll', handlerFn);
    
    return function disableActivateStateOnScrollHandlers() {
        // console.debug('StateManager. remove scroll-event listener');
        
        document.removeEventListener('scroll', handlerFn);

        this.enableActivateStateOnScroll(false);
    }.bind(this);

    function onUserScrolled(scrollEvent) {
        this.activateStateOnScroll(getCurrentScrollOffset());

        function getCurrentScrollOffset() {
            if (document.scrollTop) {
                return document.scrollTop;
            } else {
                return window.pageYOffset;
            }
        }
    }
};

StateManager.prototype.activateStateOnScroll = function activateStateOnScroll(scrollTop) {
    // console.debug('activateStateOnScroll. scrollTop', scrollTop);

    var correctedScrollTop = scrollTop;
    var viewPortHeight = window.innerHeight;
    var viewPortBottom = scrollTop + viewPortHeight;

    var componentMatchingScrollOffset;
    var i = 0;
    var numStates = this.states.length;

    while (!componentMatchingScrollOffset && i < numStates) {
        var component = this.states[i];

        if (getMatchingByScrollOffset(component, correctedScrollTop, viewPortBottom, viewPortHeight)) {
            componentMatchingScrollOffset = component;
        } else {
            i++; // next
        }

    }

    // console.debug('activateStateByScroll. component:', componentMatchingScrollOffset);

    if (componentMatchingScrollOffset) {
        this.activateState(componentMatchingScrollOffset.name);
    }

    function getMatchingByScrollOffset(component, correctedScrollTop, viewPortBottom, viewPortHeight) {
        if (!component) {
            return false;
        }

        var verticalMiddleOfScreen = (correctedScrollTop) + (viewPortHeight / 2);

        // We sometimes happen to see we obtain only empty values for
        // offset().top and height() for contentElement and element,
        // when using the objects registered within the PostLink ^function
        // of the component directive.
        // The solution in theses cases was to update the object with
        // the current one.

        var top = component.element.offsetTop;
        var bottom = component.element.offsetTop + component.element.offsetHeight;

        // console.debug('ActivateOnScroll.detection:', {
        //     element: {
        //         name: component.name,
        //         top: top,
        //         bottom: bottom
        //     },
        //     viewPort: {
        //         correctedScrollTop: correctedScrollTop,
        //         verticalMiddleOfScreen: verticalMiddleOfScreen,
        //         viewPortHeight: viewPortHeight,
        //         viewPortBottom: viewPortBottom
        //     }
        // });

        // if (top >= correctedScrollTop && top <= viewPortBottom) {
        //     if (bottom >= correctedScrollTop && bottom <= viewPortBottom) {
        //         console.log('onScrollOffsetChanged. case 0', component.name);
        //         return true;
        //     }
        // }

        // top is inside the viewPort
        if (top >= correctedScrollTop && top <= viewPortBottom) {
            // ... and bottom is inside the viewPort, too?
            if (bottom <= viewPortBottom) {
                // console.log('onScrollOffsetChanged. case 4', component.name);
                return true;

                // } else {
                // bottom is below viewPort (a looooong section)
                // console.log('onScrollOffsetChanged. case 5', component.name);
            }
        } else {
            // bottom is inside the viewPort, visible,
            // but top is outside the viewPort
            // this is the case when a section is hanging in from above

            if (top <= correctedScrollTop && bottom >= verticalMiddleOfScreen) {
                // console.log('onScrollOffsetChanged. case 7. covers fullscreen.', component.name);
                return true;

                // } else if (bottom >= correctedScrollTop && bottom <= viewPortBottom) {
                // console.log('onScrollOffsetChanged. case 3', component.name);
                return true;
                // } else {
                // console.log('onScrollOffsetChanged. case 2 or 6, so not visible', component.name);
            }
        }

        return false;
    }

};
