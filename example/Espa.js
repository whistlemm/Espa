(function(window, document){

    var _E = window.E,
        // _$ = window.$,

        class2type = {},
        hasOwn = class2type.hasOwnPrototype,

        E = function( selector, context ) {

            return new E.fn.init( selector, context );
        };

    E.fn = E.prototype = {
        constructor: E,
    }

    E.extend = E.fn.extend = function(){
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[ 0 ] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !E.isFunction( target ) ) {
            target = {};
        }

        // Extend E itself if only one argument is passed
        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {

            // Only deal with non-null/undefined values
            if ( ( options = arguments[ i ] ) != null ) {

                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( E.isPlainObject( copy ) ||
                        ( copyIsArray = E.isArray( copy ) ) ) ) {

                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && E.isArray( src ) ? src : [];

                        } else {
                            clone = src && E.isPlainObject( src ) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = E.extend( deep, clone, copy );

                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };




    E.extend({
        isFunction: function( obj ) {
            return E.type( obj ) === "function";
        },

        isArray: Array.isArray,

        isWindow: function( obj ) {
            return obj != null && obj === obj.window;
        },
        isPlainObject: function( obj ) {
            var proto, Ctor;

            // Detect obvious negatives
            // Use toString instead of E.type to catch host objects
            if ( !obj || toString.call( obj ) !== "[object Object]" ) {
                return false;
            }

            // proto = getProto( obj );
            proto = Object.getPrototypeOf( obj );

            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if ( !proto ) {
                return true;
            }

            // Objects with prototype are plain iff they were constructed by a global Object function
            Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
            return typeof Ctor === "function" && hasOwn.toString.call( Ctor ) === hasOwn.toString.call(Object);
        },
        type: function( obj ) {
            if ( obj == null ) {
                return obj + "";
            }

            // Support: Android <=2.3 only (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ? class2type[ toString.call( obj ) ] || "object" : typeof obj;
        },

        each: function( obj, callback ) {
            var length, i = 0;

            if ( isArrayLike( obj ) ) {
                length = obj.length;
                for ( ; i < length; i++ ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            }

            return obj;
        },
    });

    E.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ), function( i, name ) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    } );

    function isArrayLike( obj ) {

        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && "length" in obj && obj.length,
            type = E.type( obj );

        if ( type === "function" || E.isWindow( obj ) ) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }


    E.extend({
        ajax: function(url, method, data, callback){
            var XHR;
            if(window.XMLHttpRequest){
                XHR = new window.XMLHttpRequest();
                XHR.open(method, url, true); // true：使用异步请求
                if(method === 'POST'){
                    XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                }
                XHR.send(data);
                XHR.onreadystatechange = function(){
                    if (XHR.readyState == 4) {
                        callback(XHR.status, XHR.responseText);
                    }
                };
            }else{
                alert('浏览器竟然不支持 XMLHttpRequest');
            }
        }
    })

    var App = {
        setting: {
            default: 'home',
            cachePage: {},
            container: document.getElementById('app'),
        },
        module: {
            home: {
                url: './home.html',
                data: {
                    name: 'codingbro',
                    age: '20',
                    food: ['a', 'b', 'c', 'd']
                },
                callback: function(data, App){
                    App.setting.container.innerHTML = data;
                }
            },
            error: {
                url: './404.html',
                data: {},
                callback: function(data, App){
                    App.setting.container.innerHTML = data;
                }
            },
            e: {
                url: './e.html',
                data: {},
                callback: function(data, App){
                    App.setting.container.innerHTML = data;
                }
            },
            article: {
                url: './article.html',
                data: {},
                callback: function(data, App){
                    App.setting.container.innerHTML = data;
                }
            },
            about: {
                url: './about.html',
                data: {},
                callback: function(data, App){
                    App.setting.container.innerHTML = data;
                }
            },
            other: {
                url: './other.html',
                data: {},
                callback: function(data, App){
                    App.setting.container.innerHTML = data;
                }
            }
        },
        init: function(){
            var This = this;

            this.container = this.setting.container;
            var i = 0;
            
            // this.doAjax(this.module.error, function(page){
            //     This.setting.cachePage[This.module.error.url] = page;
            // });

            // document.body加上hash事件有bug
            window.onhashchange = this.handlerhashchange.bind(this);

            this.handlerhashchange.call(this);
        },
        handlerhashchange: function(){
            var moduleName = location.hash.substring(1);
            if(moduleName === ''){
                // 默认是home模块
                moduleName = this.setting.default;
            }
            // 当前请求的模块
        
            var M = this.module[moduleName];
            this.doAjax(M);
        },
        doAjax: function(module){
            var This = this;
            // 从缓存中读取page
            var page = this.setting.cachePage[module.url];
            if(!!page){
                This.render(module, page);
                // module.callback(page, this);
                return;
            }
            E.ajax(module.url, 'GET', module.data ? module.data : '', function(status, page){
                if(status === 200){
                    // 存入缓存
                    This.setting.cachePage[module.url] = page;
                    // module.callback(page, This);
                    This.render(module, page);
                }else{
                    This.renderError(status);
                }
            });
        },
        render: function(module, page){
            this.setting.container.innerHTML = page;
            // this.setting.container.innerHTML = this.mountTemplate(page, module.data);
            this.refresh(this.setting.container, module.data);
        },
        renderError: function(status) {
            var text = document.createTextNode('error: ' + status);
            this.setting.container.appendChild(text);
        },
        mountTemplate: function(template, scope){
            return template.replace(/\{\{([^}]+)\}\}/gmi, function(model){
                var property = model.substring(2, model.length - 2).split('.'),
                    result = scope;
                for(var i in property){
                    if(model && scope){
                        switch(property[i]){
                            case 'key': 
                                result = result.key;
                                break;
                            case 'value': 
                                result = result.value;
                                break;
                            case 'length':
                                var length = 0;
                                for(var key in result){
                                    length++;
                                }
                                result = length;
                                break;
                            default: 
                                result = scope[property[i]];
                        }
                    }
                }
                return result;

            });
        },
        refresh: function(node, scope){
            var children = node.childNodes;

            if(node.nodeType != 3){
                for(var i = 0; i<node.attributes.length; i++){
                    // 替换元素节点中定义的数据
                    node.setAttribute(node.attributes[i].name, this.mountTemplate(node.attributes[i].value, scope));
                }
                for(var j = 0; j<children.length; j++){
                    if((children[j].nodeType != 3) && children[j].hasAttribute('data-repeat')) {
                        // 处理属性节点中含有data-repeat
                        var repeat = children[j].dataset.repeat;
                        var item = children[j].dataset.item;

                        var repeatNode = children[j];
                        repeatNode.removeAttribute('data-repeat');

                        for(var key in scope[repeat]){
                            var newNode = repeatNode.cloneNode(true);
                            node.appendChild(newNode);

                            var repeatScope = scope;
                            repeatScope[item] = {
                                key: key,
                                value: scope[repeat][key]
                            };
                            this.refresh(newNode, repeatScope);
                        }
                        
                        node.removeChild(children[j]);
                    }else{
                        this.refresh(children[j], scope)
                    }
                }
            }else{
                node.textContent = this.mountTemplate(node.textContent, scope);
            }
            
        },
    };


    window.onload = function (){
        App.init();
    }

    window.E = E;

}(self, document));
