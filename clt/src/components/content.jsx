import React from 'react';

import Settings from './settings/settings.js';
import Plugins from './settings/plugins/plugins.js';
import InstalledPlugins from './settings/plugins/installed-plugins.js';

import stores from '../stores/stores.js';

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			path: stores.routing.path
		};
		
		this.__routeChanged = this.routeChanged.bind(this);
	}
	
	componentDidMount() {
		stores.routing.addChangeListener(this.__routeChanged);
	}
	
	componentWillUnmount() {
		stores.routing.removeChangeListener(this.__routeChanged);
	}
	
	routeChanged() {
		this.setState({
			path: stores.routing.path
		});
	}
	
	getContentComponent() {
		switch (this.state.path) {
			case 'settings':
				return <Settings />;
			case 'settings/plugins':
				return <Plugins />;
			case 'settings/plugins/installed':
				return <InstalledPlugins />;
			default:
				return null;
		}
	}
	
	render() {
		const contentComponent = this.getContentComponent();
		return (
			<div className="content">{contentComponent}</div>
		);
	}
}

export default Content;
