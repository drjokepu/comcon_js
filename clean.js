var colors = require('colors/safe');
var path = require('path');
var os = require('os');
var rimraf = require('rimraf');

function rimrafAll(paths) {
	for (var i = 0; i < paths.length; i++) {
		var path = paths[i];
		console.log(colors.grey(path));
		rimraf(path, function(err) {
			if (err) {
				console.error('Error deleting ' + path + ':' + os.EOL + err);
			}
		});
	}
}

rimrafAll([
	path.join(__dirname, 'style', 'css'),
	path.join(__dirname, 'clt', 'bin'),
	path.join(__dirname, 'clt', 'es5'),
	path.join(__dirname, 'srv', 'bin')
]);
