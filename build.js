var childProcess = require('child_process');
var colors = require('colors/safe');
var fs = require('fs');
var mkdirp = require('mkdirp');
var os = require('os');
var path = require('path');
var Q = require('q');

var externalScripts = [
	"events",
	"flux",
	"react",
	"react-dom"
];

var pluginPackageJson = {
	"name": "comcon-instance-plugins",
	"version": "0.0.0",
	"private": true,
	"dependencies": {}
};

function executeCommand(name, cmd) {
	var deferred = Q.defer();

	var exitCode = null;
	var sig = null;

	console.log(colors.magenta(name) + ': ' + colors.grey(cmd));
	var cp = childProcess.exec(cmd, function(err, stdout, stderr) {
		if (err) {
			deferred.reject(err);
			return;
		}

		if (stdout && stdout.length > 0) {
			console.log(stdout);
		}

		if (exitCode !== 0) {
			if (stderr && stderr.length > 0) {
				console.error(colors.red(name + ' error:') + os.EOL + stderr);
			}

			if (exitCode === null) {
				deferred.reject(new Error(name + ' exited with signal: ' + sig));
			} else {
				deferred.reject(new Error(name + ' exited with code: ' + exitCode));
			}
		} else {
			deferred.resolve();
		}
	});

	cp.addListener('exit', function(_code, _sig) {
		exitCode = _code;
		sig = _sig;
	});

	return deferred.promise;
}

function mkdir(name, path) {
	console.log(colors.magenta(name) + ': ' + colors.grey('mkdir -p "' + path + '"'));

	var deferred = Q.defer();
	mkdirp(path, function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function serverBabel() {
	var name = 'babel (srv)';

	var cmd = 'node "' + path.resolve(__dirname, path.join('.', 'node_modules', 'babel-cli', 'bin', 'babel.js')) + '"' +
		' -q -s inline --presets es2015 --plugins transform-es2015-modules-commonjs,transform-async-to-generator -d "' +
		path.resolve(__dirname, path.join('.', 'srv', 'bin')) + '" "' +
		path.resolve(__dirname, path.join('.', 'srv', 'src')) + '"';

	return mkdir(name, path.resolve(__dirname, path.join('.', 'srv', 'bin'))).then(function() {
		return executeCommand(name, cmd);
	});
}

function clientBabel() {
	var name = 'babel (clt)';

	var cmd = 'node "' + path.resolve(__dirname, path.join('.', 'node_modules', 'babel-cli', 'bin', 'babel.js')) + '"' +
		' -q -s inline --presets es2015,react --plugins transform-es2015-modules-commonjs,transform-async-to-generator -d "' +
		path.resolve(__dirname, path.join('.', 'clt', 'es5')) + '" "' +
		path.resolve(__dirname, path.join('.', 'clt', 'src')) + '"';

	return mkdir(name, path.resolve(__dirname, path.join('.', 'clt', 'es5'))).then(function() {
		return executeCommand(name, cmd);
	});
}

function makeClientBinFolder() {
	return mkdir('browserify', path.resolve(__dirname, path.join('.', 'clt', 'bin')));
}

function browserifyClient() {
	var name = 'browserify';

	var cmd = 'node "' + path.resolve(__dirname, path.join('.', 'node_modules', 'browserify', 'bin', 'cmd.js')) + '"' +
		' "' + path.resolve(__dirname, path.join('.', 'clt', 'es5', 'app.js')) + '" ' +
		externalScripts.map(function(s) { return '-x ' + s + ' '; }).join('') +
		'-d --outfile "' + path.resolve(__dirname, path.join('.', 'clt', 'bin', 'app.js')) + '"';

	return executeCommand(name, cmd);
}

function browserifyExternal() {
	var name = 'browserify (external)';

	var cmd = 'node "' + path.resolve(__dirname, path.join('.', 'node_modules', 'browserify', 'bin', 'cmd.js')) + '" ' +
		externalScripts.map(function(s) { return '-r ' + s + ' '; }).join('') +
		'-d --outfile "' + path.resolve(__dirname, path.join('.', 'clt', 'bin', 'ext.js')) + '"';

	return executeCommand(name, cmd);
}

function browserify() {
	return makeClientBinFolder().then(function() {
		return Q.all([
			browserifyClient(),
			browserifyExternal()
		]);
	});
}

function less() {
	var name = 'less';

	var cmd = '"' + path.resolve(__dirname, path.join('.', 'node_modules', 'less', 'bin', 'lessc')) + '"' +
		' "' + path.resolve(__dirname, path.join('.', 'style', 'less', 'style.less')) + '"' +
		' "' + path.resolve(__dirname, path.join('.', 'style', 'css', 'style.css')) + '"';

	return mkdir(name, path.resolve(__dirname, path.join('.', 'style', 'css'))).then(function() {
		return executeCommand(name, cmd);
	});
}

function executeBuildSteps(steps) {
	var promise = null;
	for (var i = 0; i < steps.length; i++) {
		if (i === 0) {
			promise = steps[i]();
		} else {
			promise = promise.then(steps[i]);
		}
	}

	return promise;
}

function build(name, stepGroups) {
	console.log(colors.magenta(name) + ': ' + colors.yellow('building...'));
	var t0 = new Date();
	var promises = stepGroups.map(function(g) { return executeBuildSteps(g); });
	return Q.all(promises).then(function() {
		var t1 = new Date();
		console.log(colors.magenta(name) + ': ' + colors.green('done.' + ' ' + colors.grey('(' + ((t1 - t0) / 1000) + 's)')));
	});
}

function makePluginDir() {
	return mkdir('plugins', path.resolve(__dirname, path.join('.', 'plugins')));
}

function makePluginPackageJson() {
	var deferred = Q.defer();
	var packageJsonPath = path.resolve(__dirname, path.join('.', 'plugins', 'package.json'));

	fs.stat(packageJsonPath, function (err, stats) {
		if (err) {
			if (err.code === 'ENOENT') {
				fs.writeFile(packageJsonPath, JSON.stringify(pluginPackageJson, null, '  '), function(err) {
					if (err) {
						deferred.reject(err);
					} else {
						deferred.resolve();
					}
				});
			} else {
				deferred.reject(err);
			}
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
}

var lessSteps = [less];
var clientSteps = [clientBabel, browserify];
var serverSteps = [serverBabel];
var envSteps = [/*makePluginDir, makePluginPackageJson*/];

function buildAll() {
	return build('all', [
		envSteps,
		lessSteps,
		clientSteps,
		serverSteps
	]);
}

function buildLess() {
	return build('less', [lessSteps]);
}

function buildClient() {
	return build('client', [clientSteps]);
}

function buildClientDev() {
	return build('client', [[clientBabel, browserifyClient]]);
}

function buildServer() {
	return build('server', [serverSteps]);
}

function buildEnv() {
	return build('env', [envSteps]);
}

function getTarget() {
	if (process.argv.length < 3) {
		return buildAll();
	}

	switch (process.argv[2]) {
		case 'all':
			return buildAll();
		case 'client':
			return buildClient();
		case 'env':
			return buildEnv();
		case 'less':
			return buildLess();
		case 'server':
			return buildServer();
		default:
			console.error('No such target: ' + process.argv[2]);
			return Q.fcall(function() {});
	}
}

if (require.main === module) {
	getTarget().done();
} else {
	module.exports = {
		all: buildAll,
		client: buildClientDev,
		less: buildLess,
		server: buildServer,
	}
}
