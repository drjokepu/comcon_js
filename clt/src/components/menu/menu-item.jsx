import React from 'react';

import PathTracking from './path-tracking.js';
import stores from '../../stores/stores.js';

var MenuItem = React.createClass({
	getInitialState: function() {
		return {
			path: stores.routing.path
		};
	},
	componentDidMount: function() {
		stores.routing.addChangeListener(this.routeChanged);
	},
	componentWillUnmount: function() {
		stores.routing.removeChangeListener(this.routeChanged);
	},
	routeChanged: function() {
		this.setState({
			path: stores.routing.path
		});
	},
	render: function() {
		let liClassName = 'menu-item';

		if (PathTracking.isMatch(this.props, this.state)) {
			liClassName += ' menu-item-active';
		}

		return (
			<li className={liClassName}>{this.props.children}</li>
		);
	}
});

export default MenuItem;
