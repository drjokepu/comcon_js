import * as fs from 'fs';
import * as path from 'path';

import Q from 'q';

class SinglePageApp {
    async route(ctx, next) {
        if (ctx.path.startsWith('/app')) {
            await this.serve(ctx);
        } else {
            await next();
        }
    }

    async serve(ctx) {
        ctx.body = await this.readContent();
    }

    readContent() {
        if (this.content) {
            return Q(this.content);
        }

        let deferred = Q.defer();
        fs.readFile(path.resolve(__dirname, '..', '..', 'html', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                deferred.reject(err);
            } else {
                this.content = data;
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }
}

export default SinglePageApp;
