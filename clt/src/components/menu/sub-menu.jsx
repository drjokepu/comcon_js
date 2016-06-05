import React from 'react';

import PathTracking from './path-tracking.js';
import stores from '../../stores/stores.js';

class SubMenu extends React.Component {
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
	
	render() {
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
}

export default SubMenu;
