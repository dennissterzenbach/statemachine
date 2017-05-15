let logger = new Logger();
let stateConfigService = new StateConfigService(StateConfig);
let stateRegistryService = new StateRegistryBuilderService(logger);
let stateRegistry = stateRegistryService.initStateRegistry(stateConfigService);
console.log('##### stateRegistry:', stateRegistry);

var ctrl = new StateController();

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

////////////////////////////////////////////////////////////////////////////////////////////////////

function updateSaneState() {
    console.log('============== updated sane state');
    stateRegistry.states.section1.sane = true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////

let mainApp = new MainApp(ctrl, logger);
mainApp.startEventLoop();

// make polling stop after 15seconds
window.setTimeout(mainApp.stopEventLoop, 15000);
