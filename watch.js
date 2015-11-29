var colors = require('colors/safe');
var fs = require('fs');
var formatError = require('format-error').format;
var os = require('os');
var path = require('path');

var build = require('./build.js');

function filenameMatchesExtensionFilter(filename, extFilter) {
    if (!extFilter) {
        return true;
    }

    if (!filename) {
        return !filenameExpected();
    }

    var ext = path.extname(filename).toLowerCase();
    return extFilter.some(function(filterExt) {
        return filterExt === ext;
    });
}

function filenameExpected() {
    return os.platform() === 'win32';
}

function watch(name, srcPath, callback, extFilter) {
	var pendingChanges = 0;
	var shouldRebuild = false;

	function didChange(events, filename) {
	    if (!filenameMatchesExtensionFilter(filename, extFilter)) {
	        return;
	    }

	    if (filename) {
	        console.log(colors.magenta(name) + ': ' + colors.yellow('changed.') + ' ' +
                colors.grey('(' + filename + ')'));
	    } else {
	        console.log(colors.magenta(name) + ': ' + colors.yellow('changed.'));
	    }

		pendingChanges++;

		if (pendingChanges === 1) {
		    callback().then(function() {
				shouldRebuild = pendingChanges > 1;
			}).fin(function() {
				pendingChanges = 0;
				if (shouldRebuild) {
					shouldRebuild = false;
					process.nextTick(didChange);
				}
			}).catch(function (err) {
                console.error(formatError(err));
            }).done();
		}
	}

	// todo: handle cases where recursive watching is not available (e.g. Linux)
	fs.watch(srcPath, { persistent: true, recursive: true }, didChange);

	console.log(colors.magenta(name) + ': ' + colors.yellow('watching...') + ' ' +
        colors.grey('(' + srcPath + ')'));
}

function watchLess() {
    var srcPath = path.resolve(__dirname, path.join('.', 'style', 'less'));
    watch('less', srcPath, build.less, ['.less']);
}

function watchClient() {
    var srcPath = path.resolve(__dirname, path.join('.', 'clt', 'src'));
    watch('clt', srcPath, build.client, ['.js', '.jsx']);
}

function watchServer() {
    var srcPath = path.resolve(__dirname, path.join('.', 'srv', 'src'));
    watch('srv', srcPath, build.server, ['.js']);
}

function watchAll() {
    watchLess();
    watchClient();
    watchServer();
}

watchAll();
