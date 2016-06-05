import React from 'react';

import Content from './content.js';
import HistoryManager from './history-manager.js';
import MenuBar from './menu/menu-bar.js';

function App() {
	return (
		<div className="app-root">
			<HistoryManager />
			<MenuBar />
			<Content />
		</div>
	);
}

export default App;
