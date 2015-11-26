import * as fs from 'fs';
import * as path from 'path';
import Q from 'q';

class Package {
    constructor(name, version) {
        this.name = name;
        this.version = version;
    }

    static pluginsPath() {
        return path.resolve(__dirname, path.join('..', '..', '..', 'plugins'));
    }

    static pluginsPackageJsonPath() {
        return path.join(Plugin.pluginsPath(), 'package.json');
    }

    static packagePath(packageName) {
        return path.join(Plugin.pluginsPath(), 'node_modules', packageName);
    }

    static requiredPackages() {
        let deferred = Q.defer();
        fs.readFile(pluginsPackageJsonPath(), 'utf8', (err, data) => {
            if (err) {
                deferred.reject(err);
                return;
            }

            try {
                deferred.resolve(Object.keys(JSON.parse(data).dependencies));
            } catch (e) {
                deferred.reject(e);
            }
        });

        return deferred.promise;
    }

    static installedPlugins() {
        return Package.requiredPackages().then(required => Q.all(required.map(name => getPackage(name))));
    }

    static async getPackage(packageName) {
        const version = await packageVersion(packageName);
        return new Package(packageName, version);
    }

    static packageVersion(packageName) {
        let deferred = Q.defer();
        fs.readFile(path.join(Package.packagePath(packageName), 'package.json'), 'utf8', (err, data) => {
            if (err) {
                deferred.reject(err);
                return;
            }

            try {
                deferred.resolve(JSON.parse(data).version);
            } catch (e) {
                deferred.reject(e);
            }
        });

        return deferred.promise;
    }
}

export default Package;
