class Logger {
    log() {
        console.log.apply(console, arguments);
    }

    debug() {
        console.debug.apply(console, arguments);
    }

    warn() {
        console.warn.apply(console, arguments);
    }

    info() {
        console.info.apply(console, arguments);
    }

    verbose() {
        console.log.apply(console, arguments);
    }

    table() {
        console.table.apply(console, arguments);
    }
}
