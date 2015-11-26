import Renderer from './components/renderer.js';
import stores from './stores/stores.js';

document.addEventListener("DOMContentLoaded", () => {
	stores.init();
	Renderer.render(document.getElementById('app'));
});
