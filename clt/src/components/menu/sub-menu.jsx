import React from 'react';

import PathTracking from './path-tracking.js';
import stores from '../../stores/stores.js';

var SubMenu = React.createClass({
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
	render: function () {
		if (PathTracking.isMatch(this.props, this.state)) {
			return (
				<ul className="sub-menu">
					{this.props.children}
				</ul>
			);
		} else {
			return null;
		}
	}
});

export default SubMenu;
