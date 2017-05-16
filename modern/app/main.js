let logger = new Logger();
let stateConfigService = new StateConfigService(StateConfig);
let stateFactory = new StateFactory(logger);
let stateRegistryService = new StateRegistryBuilderService(logger, stateFactory);
let stateRegistry = stateRegistryService.initStateRegistry(stateConfigService);
console.log('##### stateRegistry:', stateRegistry);

////////////////////////////////////////////////////////////////////////////////////////////////////
// trigger loading states' contents
function loadContents(stateRegistry) {
    console.log('stateRegistry loadContents', stateRegistry.states);

    for (let [i, state] of stateRegistry.registeredStates()) {
        console.log('=== checking for loading content of %s', state.name);

        if (state.contentLoader && state.contentLoader) {
            console.log('=====> load content for "%s"', state.name);
            state.contentLoader();
        }
    }
}

loadContents(stateRegistry);
let virtualDOM = new VirtualDOM();
let menuBuilder = new MenuUIBuilder(logger, virtualDOM);
let menuDOM = menuBuilder.buildMenuFromRegistry(stateRegistry);
menuBuilder.addMenuToDOM('[data-state-navigation]', menuDOM);

////////////////////////////////////////////////////////////////////////////////////////////////////

function updateSaneState() {
    console.log('============== updated sane state');
    stateRegistry.states.section1.sane = true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////

var ctrl = new StateController(stateRegistry);
let mainApp = new MainApp(ctrl, logger);
mainApp.startEventLoop();

// make polling stop after 15seconds
window.setTimeout(mainApp.stopEventLoop, 15000);
