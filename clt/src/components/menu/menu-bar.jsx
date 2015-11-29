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
					<SubMenu urlPrefix="settings">
						<SubMenuItem urlPrefix="settings/plugins">
							<NavLink href="settings/plugins">Plugins</NavLink>
							<SubMenu urlPrefix="settings/plugins">
								<SubMenuItem urlPrefix="settings/plugins/installed">
									<NavLink href="settings/plugins/installed">Installed Plugins</NavLink>
								</SubMenuItem>
							</SubMenu>
						</SubMenuItem>
					</SubMenu>
				</MenuItem>
			</ul>
		);
	}
});

export default MenuBar;
