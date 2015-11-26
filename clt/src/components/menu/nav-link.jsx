import React from 'react';

import RoutingStore from '../../stores/routing-store.js';
import stores from '../../stores/stores.js';

var NavLink = React.createClass({
	didClick: function(e) {
		e.preventDefault();
		const href = `${_config.baseUrl}/${this.props.href}`;
		stores.dispatcher.dispatch(new RoutingStore.RoutingPayload(href));
	},
	render: function() {
		const href = `${_config.baseUrl}/${this.props.href}`;
		return <a className="nav-link" href={href} onClick={this.didClick}>{this.props.children}</a>
	}
});

export default NavLink;
