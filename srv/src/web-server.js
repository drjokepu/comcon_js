import * as path from 'path';

import colors from 'colors/safe';
import koa from 'koa';
import koaConvert from 'koa-convert';
import koaStatic from 'koa-static';
import moment from 'moment';
import mount from 'koa-mount';

import Router from './router.js';
import SinglePageApp from './single-page-app.js';

class WebServer {
    constructor() {
        this.app = new koa();

        this.router = new Router();
        this.router.registerRoutes();

        this.spa = new SinglePageApp();
    }

    configure() {
        this.app.use(WebServer.log);
        this.app.use(::this.router.route);
        this.app.use(::this.spa.route);
        this.app.use(koaConvert(mount('/js', koaStatic(path.resolve(__dirname, '..', '..', 'clt', 'bin')))));
        this.app.use(koaConvert(mount('/style', koaStatic(path.resolve(__dirname, '..', '..', 'style', 'css')))));
    }

    start() {
        let port = 8080;
        this.app.listen(port, () => {
            console.log(`${colors.green(moment().toISOString())} Listening on port ${colors.yellow(`${port.toString()}`)}...`);
        });
    }

    static async log(ctx, next) {
        console.log(`${colors.green(moment().toISOString())} ${WebServer.getIp(ctx)} ${colors.blue(`${ctx.method} ${ctx.originalUrl}`)}`);
        return next();
    }

    static getIp(ctx) {
        if (ctx.ips && ctx.ips.length > 0) {
        	return ctx.ips[0];
        } else {
        	return ctx.ip;
        }
    }

    static lauchNew() {
        let srv = new WebServer();
        srv.configure();
        srv.start();
        return srv;
    }
}

export default WebServer;
