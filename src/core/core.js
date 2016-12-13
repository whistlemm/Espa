import Router from './router';
import Mixin from './mixin';

class E {

    $router = null;

    _options = {
        container: '#container',
        enter: 'enter',
        enterTimeout: 300,
        leave: 'leave',
        leaveTimeout: 300
    };
    
    constructor(opts) {
        this._options = Object.assign({}, this._options, opts)
        this.init(opts);
    }

    init(){
        
    }

    routerMap (arr) {
        this.$router = new Router(this._options);
        this.$router.map(arr);
    }

    run(){
        this.$router.init();
    }
}

Mixin(E);



export default E;