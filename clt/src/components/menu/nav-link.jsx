import React from 'react';

import RoutingStore from '../../stores/routing-store.js';
import stores from '../../stores/stores.js';

var NavLink = React.createClass({
	getURL: function() {
		return `${_config.baseUrl}/app/${this.props.href}`;
	},
	didClick: function(e) {
		e.preventDefault();
		const href = this.getURL();
		stores.dispatcher.dispatch(new RoutingStore.RoutingPayload(href));
	},
	render: function() {
		const href = this.getURL();
		return <a className="nav-link" href={href} onClick={this.didClick}>{this.props.children}</a>
	}
});

export default NavLink;
