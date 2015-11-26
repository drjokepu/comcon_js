import * as flux from 'flux';
import RoutingStore from './routing-store';

var stores = {
    dispatcher: null,
    routing: null,
    init: function() {
        stores.dispatcher = new flux.Dispatcher();
        stores.routing = new RoutingStore(stores.dispatcher);
    }
};

export default stores;
