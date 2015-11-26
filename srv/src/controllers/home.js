require('babel-polyfill');

const actions = [{
    method: 'GET',
    path: '/',
    fn: async ctx => {
        ctx.status = 301;
        ctx.redirect('/app');
    }
}, {
    method: 'GET',
    path: '/config.js',
    fn: async ctx => {
        const _config = {
            baseUrl: ''
        };

        ctx.type = 'application/javascript';
        ctx.body = 'var _config = ' + JSON.stringify(_config) + ';';
    }
}];

export default actions;
