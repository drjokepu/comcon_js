import * as events from 'events';

export class RoutingStore extends events.EventEmitter {
    constructor(dispatcher) {
        super();
        this.path = RoutingStore.getInitialPath();
        this.dispatcherIndex = dispatcher.register(this.handleDispatcherEvent.bind(this));
    }

    handleDispatcherEvent(ev) {
        if (ev.type === RoutingStore.RoutingPayload.TYPE) {
            this.handleRoutingEvent(ev);
        }
    }

    handleRoutingEvent(ev) {
        const appPath = RoutingStore.extractAppPath(ev.path);
		if (this.path !== appPath) {
			this.path = appPath;
			this.emitChange();
		}
    }

    emitChange() {
		this.emit(RoutingStore.events.CHANGE);
	}

	addChangeListener(callback) {
		this.on(RoutingStore.events.CHANGE, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(RoutingStore.events.CHANGE, callback);
	}

    static getInitialPath() {
		return RoutingStore.extractAppPath(window.location.pathname);
	}

    static extractAppPath(fullPath) {
		if (fullPath.indexOf(_config.baseUrl) !== 0) {
			throw new Error(`Path ${fullPath} does not start with base URL (${_config.baseUrl}).`);
		} else {
			const stripped = fullPath.substr(`${_config.baseUrl}/app`.length);
			if (stripped.length > 0 && stripped.charAt(0) === '/') {
				return stripped.substr(1);
			} else {
				return stripped;
			}
		}
	}
}

RoutingStore.events = {
    CHANGE: 'change'
};

RoutingStore.RoutingPayload = class RoutingPayload {
    constructor(path) {
        this.path = path;
        this.type = RoutingStore.RoutingPayload.TYPE;
    }
};

RoutingStore.RoutingPayload.TYPE = 'routing';

export default RoutingStore;
