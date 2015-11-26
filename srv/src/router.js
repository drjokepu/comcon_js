require('babel-polyfill');

import controllers from './controllers';

class Router {
    constructor() {
        this.routes = {};
    }

    registerRoutes() {
        this.registerInternalRoutes();
    }

    registerInternalRoutes() {
        for (const controller of controllers) {
            for (const action of controller) {
                if (!this.routes[action.method]) {
                    this.routes[action.method] = {};
                }

                this.routes[action.method][action.path] = action;
            }
        }
    }

    async route(ctx, next) {
        if (!this.routes[ctx.method] || !this.routes[ctx.method][ctx.path]) {
            await next();
        } else {
            await this.routes[ctx.method][ctx.path].fn(ctx, next);
        }
    }
}

export default Router;
