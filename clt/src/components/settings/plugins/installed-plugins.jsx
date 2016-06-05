import * as events from 'events';
import React from 'react';

import * as ajax from '../../../ajax.js';
import Loading from '../../shared/loading.js';
import stores from '../../../stores/stores.js';

class InstalledPluginsStore extends events.EventEmitter {
    constructor(dispatcher) {
        super();
        this.dispatcherIndex = dispatcher.register(this.handleDispatcherEvent.bind(this));
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

    getInstalledPlugins() {
        return this.installedPlugins;
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

class InstalledPluginsController {
    static load() {
        return ajax.getJSON(_config.baseUrl + '/data/settings/plugins/installed-plugins').then(res => {
            stores.dispatcher.dispatch(new InstalledPluginsStore.InstalledPluginsPayload(res.data));
        });
    }
}

class InstalledPlugins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plugins: []
        };
        
        this.__didStoreChange = this.didStoreChange.bind(this);
    }
    
    didStoreChange() {
        this.setState({
            plugins: store.getInstalledPlugins()
        });
    }
    
    componentDidMount() {
        this.store = new InstalledPluginsStore(stores.dispatcher);
        this.store.addChangeListener(this.___didStoreChange);
        InstalledPluginsController.load().done();
        this.forceUpdate();
    }
    
    componentWillUnmount() {
        this.store.removeChangeListener(this.____didStoreChange);
        this.store.unload();
        this.store = null;
    }
    
    render() {
        if (!store) {
            return null;
        }

        let content = null;
        if (store.isLoading()) {
            content = <Loading />;
        } else {
            content = <InstalledPluginList plugins={this.state.plugins} />;
        }

		return (
            <div>
                <h2>Installed Plugins</h2>
                {content}
            </div>
        );
    }
}

function InstalledPluginList(props) {
    const items = props.plugins.map(p => <InstalledPluginListItem plugin={p} />);
    return <ul className="installed-plugin-list">{items}</ul>;
}

function InstalledPluginListItem(props) {
    const pluginNameLabel = this.props.plugin.name;
    const pluginVersionLabel = this.props.plugin.found ? this.props.plugin.version : 'missing';

    return (
        <li className="installed-plugin-list-item">
            <div>
                <span className="installed-plugin-name">{pluginNameLabel}</span>
                <span> </span>
                <span className="installed-plugin-version">{pluginVersionLabel}</span>
            </div>
        </li>
    );
}

export default InstalledPlugins;
