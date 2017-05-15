class MainApp {
    constructor(ctrl, logger) {
        this.stateController = ctrl;
        this.logger = logger;
    }

    gotoNextState() {
        this.stateController.update(this.stateController.messagesRegistry.next, this.stateController.store.model.current);
    }

    gotoPreviousState() {
        this.stateController.update(this.stateController.messagesRegistry.prev, this.stateController.store.model.current);
    }

    startEventLoop() {
        this.eventLoop = (function(app) {
            app.eventLoopPollingInterval = window.setInterval(pollStatus, 100);

            function pollStatus() {
                if (app.stateController) {
                    let canLeave = app.stateController.canUpdateState();

                    // console.log('POLL...', app.stateController.store.model.current.name, canLeave);

                    if (canLeave) {
                        app.gotoNextState();
                        app.stopEventLoop();
                    }
                }
            }

            function stopEventLoop() {
                window.clearInterval(app.eventLoopPollingInterval);
                app.eventLoopPollingInterval = null;
            }

            return stopEventLoop;
        })(this);
    }

    stopEventLoop() {
        if (this.eventLoop) {
            this.logger.log('MainApp.stopEventLoop stopping interval based event loop...');
            this.eventLoop();
        }

        this.eventLoop = null;
    }
}
