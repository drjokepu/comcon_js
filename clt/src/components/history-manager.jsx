import React from 'react';

import RoutingStore from '../stores/routing-store.js';
import stores from '../stores/stores.js';

class HistoryManager extends React.Component {
	constructor(props) {
		super(props);
		this.__routeChanged = this.routeChanged.bind(this);
		this.__didPopState = this.didPopState.bind(this);
	}
	
	componentDidMount() {
		stores.routing.addChangeListener(this.__routeChanged);
		window.addEventListener('popstate', this.__didPopState, false);
	}
	
	componentWillUnmount() {
		stores.routing.removeChangeListener(this.__routeChanged);
		window.removeEventListener('popstate', this.__didPopState);
	}
	
	routeChanged() {
		const newPath = `${_config.baseUrl}/app/${stores.routing.path}`;
		if (window.location.pathname !== newPath) {
			history.pushState({}, '', newPath);
		}
	}
	
	didPopState() {
		stores.dispatcher.dispatch(new RoutingStore.RoutingPayload(window.location.pathname));
	}
	
	render() {
		return null;
	}
}

export default HistoryManager;
