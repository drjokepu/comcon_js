import * as fs from 'fs';
import * as path from 'path';
import Q from 'q';

class Package {
    constructor(name, info) {
        this.name = name;
        if (info) {
            this.description = info.description;
            this.version = info.version;
            this.main = info.main;
            this.found = true;
        } else {
            this.found = false;
        }
    }

    static pluginsPath() {
        return path.resolve(__dirname, path.join('..', '..', '..', 'plugins'));
    }

    static pluginsPackageJsonPath() {
        return path.join(Package.pluginsPath(), 'package.json');
    }

    static packagePath(packageName) {
        return path.join(Package.pluginsPath(), 'node_modules', packageName);
    }

    static requiredPackages() {
        let deferred = Q.defer();
        fs.readFile(Package.pluginsPackageJsonPath(), 'utf8', (err, data) => {
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
        return Package.requiredPackages().then(required => Q.all(required.map(name => Package.getPackage(name))));
    }

    static async getPackage(packageName) {
        const info = await Package.packageInfo(packageName);
        return new Package(packageName, info);
    }

    static packageInfo(packageName) {
        let deferred = Q.defer();
        fs.readFile(path.join(Package.packagePath(packageName), 'package.json'), 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    deferred.resolve(null);
                }

                deferred.reject(err);
                return;
            }

            try {
                const pkg = JSON.parse(data);
                deferred.resolve({
                    description: pkg.description,
                    version: pkg.version,
                    main: pkg.main
                });
            } catch (e) {
                deferred.reject(e);
            }
        });

        return deferred.promise;
    }
}

export default Package;
