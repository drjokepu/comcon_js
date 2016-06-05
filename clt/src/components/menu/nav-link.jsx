import React from 'react';

import RoutingStore from '../../stores/routing-store.js';
import stores from '../../stores/stores.js';

class NavLink extends React.Component {
	constructor(props) {
		super(props);
		this.__didClick = this.didClick.bind(this);
	}
	
	getURL() {
		return `${_config.baseUrl}/app/${this.props.href}`;
	}
	
	didClick(e) {
		e.preventDefault();
		const href = this.getURL();
		stores.dispatcher.dispatch(new RoutingStore.RoutingPayload(href));
	}
	
	render() {
		const href = this.getURL();
		return <a className="nav-link" href={href} onClick={this.__didClick}>{this.props.children}</a>;
	}
}

export default NavLink;
