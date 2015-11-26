import React from 'react';

import MenuBarHeader from './menu-bar-header.js';
import MenuItem from './menu-item.js';
import NavLink from './nav-link.js';
import SubMenu from './sub-menu.js';
import SubMenuItem from './sub-menu-item.js';
import stores from '../../stores/stores.js';

var MenuBar = React.createClass({
	render: function() {
		return (
			<ul className="menu-bar">
				<MenuBarHeader />
				<MenuItem urlPrefix=""><NavLink href="">Dashboard</NavLink></MenuItem>
				<MenuItem urlPrefix="settings">
					<NavLink href="settings">Settings</NavLink>
				</MenuItem>
				<SubMenu urlPrefix="settings">
					<SubMenuItem urlPrefix="settings/plugins">
						<NavLink href="settings/plugins">Plugins</NavLink>
					</SubMenuItem>
				</SubMenu>
			</ul>
		);
	}
});

export default MenuBar;
