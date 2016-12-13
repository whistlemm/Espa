import pathToRegexp from 'path-to-regexp';

/**
 * get hash by full url
 * @param {String} url
 * @returns {string}
 */
export function getHash(url) {
    return url.indexOf('#') !== -1 ? url.substring(url.indexOf('#') + 1) : '/';
}

/**
 * get route from routes filter by url
 * @param {Array} routes
 * @param {String} url
 * @returns {Object}
 */
export function getRoute(routes, url) {
    for (let i = 0, len = routes.length; i < len; i++) {
        let route = routes[i];
        let keys = [];
        // 将url装换成对象，返回一个正则表达式
        // 例如：
        // var re = pathToRegexp('/:foo/:bar?', keys)
        // 此时数组被修改为 // keys = [{ name: 'foo', ... }, { name: 'bar', delimiter: '/', optional: true, repeat: false }]
        const regex = pathToRegexp(route.url, keys);
        // 执行正则匹配
        const match = regex.exec(url);
        if (match) {
            route.params = {};
            for (let j = 0, l = keys.length; j < l; j++) {
                const key = keys[j];
                const name = key.name;
                route.params[name] = match[j + 1];
            }
            // 遍历匹配到的key和value 已对象的形式返回
            return route;
        }
    }
    return null;
}

/**
 * has children
 * @param {HTMLElement} parent
 * @returns {boolean}
 */
export function hasChildren(parent) {
    const children = parent.children;
    return children.length > 0;
}

/**
 * noop
 */
export function noop() {

}

/**
 * 继承
 */
export function extend (to, from) {
  var keys = Object.keys(from)
  var i = keys.length
  while (i--) {
    to[keys[i]] = from[keys[i]]
  }
  return to
}
