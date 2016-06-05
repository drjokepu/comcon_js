import Package from '../../models/package.js';

const actions = [{
    method: 'GET',
    path: '/data/settings/plugins/installed-plugins',
    fn: async ctx => {
        ctx.body = await Package.installedPlugins();
    }
}];

export default actions;
