const actions = [{
    method: 'GET',
    path: '/data/settings/plugins/installed-plugins',
    fn: async ctx => {
        ctx.body = [];
    }
}];

export default actions;
