import React from 'react';

import RoutingStore from '../stores/routing-store.js';
import stores from '../stores/stores.js';

var HistoryManager = React.createClass({
	componentDidMount: function() {
		stores.routing.addChangeListener(this.routeChanged);
		window.addEventListener('popstate', this.didPopState, false);
	},
	componentWillUnmount: function() {
		stores.routing.removeChangeListener(this.routeChanged);
		window.removeEventListener('popstate', this.didPopState);
	},
	routeChanged: function() {
		const newPath = `${_config.baseUrl}/app/${stores.routing.path}`;
		if (window.location.pathname !== newPath) {
			history.pushState({}, '', newPath);
		}
	},
	didPopState: function () {
		stores.dispatcher.dispatch(new RoutingStore.RoutingPayload(window.location.pathname));
	},
	render: function() {
		return null;
	}
});

export default HistoryManager;
