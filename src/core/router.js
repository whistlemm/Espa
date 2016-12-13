import * as util from '../util';

/**
 * a very simple router for the **demo** of [weui](https://github.com/weui/weui)
 */
class Router {

    // 自定义的变量
    _options = {
        container: '#container',
        enter: 'enter',
        enterTimeout: 0,
        leave: 'leave',
        leaveTimeout: 0
    };

    _index = 1;

    // container element
    _$container = null;

    // array of route config
    _routes = [];

    // default route config
    _default = null;

    /**
     * constructor
     * @param options
     */
    constructor(options) {
        // 继承配置文件，获取容器元素
        this._options = Object.assign({}, this._options, options);
        this._$container = document.querySelector(this._options.container);
    }

    /**
     * initial
     * @returns {Router}
     */
    init() {

        // why not `history.pushState`? see https://github.com/weui/weui/issues/26, Router in wechat webview
        window.addEventListener('hashchange', (event) => {
            const old_hash = util.getHash(event.oldURL);
            const hash = util.getHash(event.newURL);
            // fix '/' repeat see https://github.com/progrape/router/issues/21
            if(old_hash === hash) return;   
            const state = history.state || {};
            // 当每次hash改变的时候，跳转页面
            this.go(hash, state._index <= this._index);
        }, false);

        if (history.state && history.state._index) {
            this._index = history.state._index;
        }

        this._index--;
        // 返回当前地址的对象形式
        const hash = util.getHash(location.href);
        const route = util.getRoute(this._routes, hash);
        this.go(route ? hash : this._default);

        return this;
    }

    /**
     * push route config into routes array
     * @param {Object} route
     * @returns {Router}
     */
    push(route) {

        const exist = this._routes.filter(r => r.url === route.url)[0];
        if (exist) {
            throw new Error(`route ${route.url} is existed`);
        }

        route = Object.assign({}, {
            url: '*',
            className: '',
            render: util.noop,
            bind: util.noop,
            componentDidMount: null
        }, route);
        this._routes.push(route);
        return this;
    }

    map(arr){
        arr.forEach((item) => {
            this.push(item);
        });

        return this;
    }

    /**
     * set default url when no matcher was found
     * @param {String} url
     * @returns {Router}
     */
    setDefault(url) {
        this._default = url;
        return this;
    }

    /**
     * go to the specify url
     * @param {String} url
     * @param {Boolean} isBack, default: false
     * @returns {Router}
     */
    go(url, isBack = false) {
        // 根据当前地址匹配路由，返回键值对
        const route = util.getRoute(this._routes, url);
        if (route) {

            const leave = (hasChildren) => {
                // if have child already, then remove it
                if (hasChildren) {
                    let child = this._$container.children[0];
                    // 如果isBack为真，则为child添加样式
                    if (isBack) {
                        child.classList.add(this._options.leave);
                    }

                    if (this._options.leaveTimeout > 0) {
                        setTimeout(() => {
                            child.parentNode.removeChild(child);
                        }, this._options.leaveTimeout);
                    }
                    else {
                        child.parentNode.removeChild(child);
                    }
                }
            };

            const enter = (hasChildren, html) => {
                let node = document.createElement('div');

                // add class name
                if (route.className) {
                    node.classList.add(route.className);
                }
                 node.innerHTML                                   = html;
                this._$container.appendChild(node);
                // add class
                if (!isBack && this._options.enter && hasChildren) {
                    node.classList.add(this._options.enter);
                }

                if (this._options.enterTimeout > 0) {
                    setTimeout(() => {
                        node.classList.remove(this._options.enter);
                    }, this._options.enterTimeout);
                }
                else {
                    node.classList.remove(this._options.enter);
                }

                location.hash = `#${url}`;
                try {
                    isBack ? this._index-- : this._index++;
                    history.replaceState && history.replaceState({_index: this._index}, '', location.href);
                } catch (e) {

                }

                if (typeof route.bind === 'function'/* && !route.__isBind*/) {
                    route.bind.call(node);
                    //route.__isBind = true;
                }
            };

            const hasChildren = util.hasChildren(this._$container);

            // pop current page
            leave(hasChildren);

            // callback
            const callback = (err, html = '') => {
                if (err) {
                    throw err;
                }

                // push next page
                enter(hasChildren, html);
            };
            // 调用路由配置项中的render方法，
            // 有返回值，并且是一个promise，会接受模版文件作为回调
            // 是同步的方法，直接使用返回值
            const res = route.render(callback);
            // promise
            if (res && typeof res.then === 'function') {
                res.then((html) => {
                    callback(null, html);
                }, callback);
            }
            // synchronous
            else if (route.render.length === 0) {
                callback(null, res);
            }
            // callback
            else {

            }
        }
        else {
            throw new Error(`url ${url} was not found`);
        }
        return this;
    }
}

export default Router;