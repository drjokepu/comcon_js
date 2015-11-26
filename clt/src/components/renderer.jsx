import React from 'react';
import ReactDOM from 'react-dom';

import App from './app.js';

class Renderer {
	static render(rootElement) {
		ReactDOM.render(<App />, rootElement);
	}
}

export default Renderer;
