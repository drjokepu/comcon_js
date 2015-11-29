import * as events from 'events';
import React from 'react';

import * as ajax from '../../../ajax.js';
import Loading from '../../shared/loading.js';
import stores from '../../../stores/stores.js';

class InstalledPluginsStore extends events.EventEmitter {
    constructor(dispatcher) {
        super();
        this.dispatcherIndex = dispatcher.register(::this.handleDispatcherEvent);
        this.loading = true;
        this.installedPlugins = null;
    }

    unload() {
        this.removeAllListeners();
    }

    handleDispatcherEvent(ev) {
        if (ev.type === InstalledPluginsStore.InstalledPluginsPayload.TYPE) {
            this.handleChangeEvent(ev);
        }
    }

    handleChangeEvent(ev) {
        this.installedPlugins = ev.plugins;
        this.loading = false;
        this.emitChange();
    }

    isLoading() {
        return this.loading;
    }

    emitChange() {
		this.emit(InstalledPluginsStore.events.CHANGE);
	}

	addChangeListener(callback) {
		this.on(InstalledPluginsStore.events.CHANGE, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(InstalledPluginsStore.events.CHANGE, callback);
	}
}

InstalledPluginsStore.events = {
    CHANGE: 'change'
};

InstalledPluginsStore.InstalledPluginsPayload = class InstalledPluginsPayload {
    constructor(plugins) {
        this.plugins = plugins;
        this.type = InstalledPluginsStore.InstalledPluginsPayload.TYPE;
    }
};

InstalledPluginsStore.InstalledPluginsPayload.TYPE = 'settings_plugins_installed_plugins';

var store = null;

class InstalledPluginsController {
    static load() {
        return ajax.getJSON(_config.baseUrl + '/data/settings/plugins/installed-plugins').then(res => {
            stores.dispatcher.dispatch(new InstalledPluginsStore.InstalledPluginsPayload(res.data));
        });
    }
}

var InstalledPlugins = React.createClass({
    componentDidMount: function() {
        store = new InstalledPluginsStore(stores.dispatcher);
        store.addChangeListener(this.didStoreChange);
        InstalledPluginsController.load().done();
        this.forceUpdate();
    },
    componentWillUnmount: function() {
        store.removeChangeListener(this.didStoreChange);
        store.unload();
        store = null;
    },
    didStoreChange: function() {
        this.forceUpdate();
    },
	render: function() {
        if (!store) {
            return null;
        }

        let content = null;
        if (store.isLoading()) {
            content = <Loading />;
        } else {
            content = <InstalledPluginList />;
        }

		return (
            <div>
                <h2>Installed Plugins</h2>
                {content}
            </div>
        );
	}
});

var InstalledPluginList = React.createClass({
    render: function() {
        return <span></span>;
    }
})

export default InstalledPlugins;
