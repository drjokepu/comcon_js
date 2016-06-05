import React from 'react';
import PathTracking from './path-tracking.js';
import stores from '../../stores/stores.js';

class SubMenuItem extends React.Component {
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
		let liClassName = 'sub-menu-item';

		if (PathTracking.isMatch(this.props, this.state)) {
			liClassName += ' menu-item-active';
		}

		return (
			<li className={liClassName}>{this.props.children}</li>
		);
	}
}

export default SubMenuItem;
