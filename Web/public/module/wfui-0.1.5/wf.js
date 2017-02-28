'use strict';
(function (global) {
    /**
     * wf module framework.
     * @module wf
     * @base wf
     * @alias f
     */
    var wf = global.wf || {};
    wf = function () {
        var name = 'wf';
        /**
         * 核心模块,dependencies
         */
        var core = {
            token: '_core_',
            values: [
                'logger'
            ]
        };
        /**
         * private
         * 模块集合
         */
        var modules = {};
        /**
         * WFUI实例
         */
        return {
            /**
             * 模块名称
             * @property {String} name
             */
            name: 'wf',
            /**
             * 版本号,项目构建新版本时更新发布版本号
             * @property {String} version
             */
            version: '1.0.0',
            /**
             * 模块声明
             * @method define
             * @param {String} name 模块名称
             * @param {Array||String} dependencies 模块依赖项,为core.token时引用核心模块
             * @param {String} factory 模块创建工厂
             * @return {Module} 返回该定义模块
             */
            define: function (name, dependencies, factory) {
                if (typeof dependencies === 'string' && dependencies === core.token) {
                    dependencies = core.values;
                }
                if (!modules[name]) {
                    var module = {
                        name: name,
                        dependencies: dependencies,
                        factory: factory
                    };
                    modules[name] = module;
                }
                return modules[name];
            },
            /**
             * 模块引用
             * @method require
             * @param {String} name 模块名称
             * @return {Object} 返回该定义模块的实例
             */
            require: function (name) {
                var i;
                var module = modules[name];
                if (!module.entity) {
                    var args = [];
                    for (i = 0; i < module.dependencies.length; i++) {
                        if (modules[module.dependencies[i]].entity) {
                            args.push(modules[module.dependencies[i]].entity);
                        }
                        else {
                            args.push(this.require(module.dependencies[i]));
                        }
                    }
                    module.entity = module.factory.apply(function () {}, args); //noop
                }
                return module.entity;
            },
            /**
             * 模块继承
             * @method inherit
             * @param {String} base 父类
             * @return {Class} 返回该定义的类型
             */
            inherit: function (base, prop) {

                // 本次调用所创建的类（构造函数）
                function UI() {
                    if (base) {
                        this.baseprototype = base.prototype;
                    }
                    if (!this.init) {
                        throw new Error('init function is undefind');
                    }
                    this.init.apply(this, arguments);
                }
                // 单参数情况下 - inherit(prop)
                if (typeof (base) === 'object') {
                    prop = base;
                    base = null;
                }
                if (base) {
                    var MiddleClass = function () { };
                    MiddleClass.prototype = base.prototype;
                    UI.prototype = new MiddleClass();
                    UI.prototype.constructor = UI;
                }
                /**
                 * 重写父类方法,特殊情况下使用_base_访问父类同名方法（必须为第一个参数）
                 */
                for (var name in prop) {
                    if (prop.hasOwnProperty(name)) {
                        if (base && typeof (prop[name]) === 'function' && name === 'init') {
                            UI.prototype[name] = (function (name, fn) {
                                return function () {
                                    var that = this,
                                        _base_ = function () {
                                            return base.prototype[name].apply(that, arguments);
                                        };
                                    return fn.apply(this, Array.prototype.concat.apply(_base_, arguments));
                                };
                            })(name, prop[name]);
                        } else {
                            UI.prototype[name] = prop[name];
                        }
                    }
                }
                return UI;
            }
        };
    };
    global.wf = wf();
})(window);

'use strict';
/**
 * 兼容和扩展
 */
(function () {
    
    String.prototype.format = function () {
        var source = this;
        if (arguments.length > 0) {
            $.each(arguments, function (i, n) {
                source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
            });
        }
        return source;
    };    
    String.prototype.empty = function () {
        return '';
    };
    Array.prototype.empty = function () {
        return [];
    };
    Date.prototype.format = function (format) {
        var date = {
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'q+': Math.floor((this.getMonth() + 3) / 3),
            'S+': this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                       ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    };
}());
'use strict';

(function (global) {
    /**
     * 兼容console
     */
    var _console = global.console || {};
    
    var methods = [
        'assert',
        'clear',
        'count',
        'debug',
        'dir',
        'dirxml',
        'exception',
        'error',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'profile',
        'profileEnd',
        'table',
        'time',
        'timeEnd',
        'timeStamp',
        'trace',
        'warn'
    ];
    var console = {
        version: '1.0.0'
    };
    var key;
    
    if (_console) {
        return;
    }

    for (var i = 0, len = methods.length; i < len; i++) {
        key = methods[i];
        console[key] = function (key) {
            return function () {
                if (typeof _console[key] === 'undefined') {
                    return 0;
                }
                
                Function.prototype.apply.call(_console[key], _console, arguments);
            };
        }(key);
    }
    
    global.console = console;

}(window));
'use strict';

wf.define('logger', [], function () {
    
    /**
     * private
     * 日志级别
     */
    var LogLevel = {
        debug: 'debug',
        info: 'info',
        warn: 'warn',
        error: 'error'
    };
    
    /**
     * private
     * 日志输出模式
     */
    var Mode = {
        local: 'local',
        remote: 'remote'
    };
    
    /**
     * private
     * 日志默认输出到本地
     */
    var mode = Mode.local;
    
    /**
     * private
     * 日志输出到远程的地址
     */
    var remoteUrl = '';
    
    /**
     * 日志输出
     * private
     * @method output
     * @param {String} msg 日志消息
     * @param {LogLevel} level 日志级别
     */
    var output = function (msg, level) {
        if (mode === Mode.local) {
            console[level](msg);
        } else {
            if (!remoteUrl) {
                throw new Error('remoteUrl empty,');
            } else {
                //TODO 远程日志服务
            }
        }
        return msg;
    };
    
    /**
     * public api
     */
    return {
        
        /**
         * 获取日志输出模式
         * @method getOutputMode
         * @return {String} mode
         */
        getOutputMode: function () {
            return mode;
        },
        
        /**
         * 设置日志输出模式,仅当url有值时使用Mode.remote
         * @method setOutputMode
         * @param {String} url 远程日志系统url
         */
        setOutputMode: function (url) {
            if (url) {
                remoteUrl = url;
                mode = Mode.remote;
            }
        },
        
        /**
         * debug模式,调试时输出
         * @method debug
         * @param {String} msg 日志消息
         * @return {String} 返回该消息
         */
        debug: function (msg) {
            return output(msg, LogLevel.debug);
        },
        
        /**
         * info模式,输出到终端用户
         * @method info
         * @param {String} msg 日志消息
         * @return {Module} 返回该消息
         */
        info: function (msg) {
            return output(msg, LogLevel.info);
        },
        
        /**
         * warn模式,系统警告,建议远程传回
         * @method warn
         * @param {String} msg 日志消息
         * @return {Module} 返回该消息
         */
        warn: function (msg) {
            return output(msg, LogLevel.warn);
        },
        
        /**
         * error模式,系统错误,建议远程传回
         * @method error
         * @param {String} msg 日志消息
         * @return {Module} 返回该消息
         */
        error: function (msg) {
            return output(msg, LogLevel.error);
        }
    };
});
'use strict';
/*
 * cookie module
 *
 */
wf.define('cookie', [], function () {
    return {
        /**
         * 设置cookie
         * 
         * @param {String} key cookie名称
         * @param {String} value cookie值
         * @param {String} domain 所在域名
         * @param {String} path 所在路径
         * @param {String} expires 过期时间
         */
        set: function (key, value, domain, path, expires) {
            document.cookie = [
                key, '=', value,
                expires ? '; expires=' + expires.toGMTString() : '',
                path ? '; path=' + path : '',
                domain ? '; domain=' + domain : ''
            ].join('');
        },
        /**
         * 获取指定名称的cookie值
         * 
         * @param {String} key cookie名称
         * @return {String} 获取到的cookie值
         */
        get: function (key) {
            var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
            if (arr = document.cookie.match(reg)) {
                return arr[2];
            }                
            else {
                return null;
            }                
        },
        /**
         * 删除cookie
         * 
         * @param {String} key cookie名称
         */
        remove: function (key) {
            document.cookie = key + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT;';
        }
    };
});
'use strict';

wf.define('loader', [], function () {
    
    /**
     * private
     * 动态加载模块集合
     */
    var loadModules = {};
    
    /**
     * 创建模块node
     * private
     * @method createModuleNode
     * @param {String} path 模块url
     * @return {String} node
     */
    var createModuleNode = function (path) {
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.async = 'true';
        node.src = path + '.js';
        return node;
    };
    
    /**
     * public api
     */
    return {
        
        name: 'model loader',
        
        /**
         * 动态加载模块
         * @method load 动态获取模块
         */
        load: function (pathArr, callback) {
            for (var i = 0; i < pathArr.length; i++) {
                
                var path = pathArr[i];
                
                if (!loadModules[path]) {
                    var head = document.getElementsByTagName('head')[0];
                    var node = createModuleNode(path);
                    node.path = path;
                    
                    /**
                     * check所有模块加载完成执行callback
                     * @param {Function} callback 加载完成回调函数
                     * private
                     */
                     var checkAllFiles = function () {
                        var allLoaded = true;
                        
                        for (var i = 0; i < pathArr.length; i++) {
                            if (!loadModules[pathArr[i]]) {
                                allLoaded = false;
                                break;
                            }
                        }
                        
                        if (allLoaded) {
                            callback();
                        }
                    };
                    node.onload = function () {
                        loadModules[this.path] = true;
                        head.removeChild(this);
                        checkAllFiles(pathArr, callback);
                    };
                    head.appendChild(node);
                }
            }

        }
    };
});
'use strict';
/**
 * browser core and version
 */
wf.define('browser', '_core_', function (logger) {
    var webkit = /(webkit)\/([\w.]+)/;
    var opera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
    var msie = /(msie) ([\w.]+)/;
    var mozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
    var browser = {};
    var ua = window.navigator.userAgent;
    var uaMatch = function (ua) {
        ua = ua.toLowerCase();
        
        var match = webkit.exec(ua) 
                    || opera.exec(ua) 
                    || msie.exec(ua) 
                    || ua.indexOf('compatible') < 0 && mozilla.exec(ua) 
                    || [];
        
        return {
            browser : match[1] || '',  
            version : match[2] || '0'
        };
    };
    var browserMatch = uaMatch(ua);
    if (browserMatch.browser) {
        browser[browserMatch.browser] = true;
        browser.version = browserMatch.version;
    }
    return browser;
});
'use strict';
/**
 * 事件系统
 */
wf.define('util', [], function () {
    return {
        /**
         * 获取滚动条宽度
         */
        getScrollbarWidth: function () {
            var outer;
            var inner;
            var widthNoScroll;
            var widthWithScroll;
            outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.width = '100px';
            outer.style.msOverflowStyle = 'scrollbar';
            document.body.appendChild(outer);
            widthNoScroll = outer.offsetWidth;
            outer.style.overflow = 'scroll';
            inner = document.createElement('div');
            inner.style.width = '100%';
            outer.appendChild(inner);
            widthWithScroll = inner.offsetWidth;
            outer.parentNode.removeChild(outer);
            return widthNoScroll - widthWithScroll;
        },
        /**
         * 获取guid
         */
        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
        },
        /**
         * 获取guid
         */
        growingID: (function () {
            var id = 0;
            return function () {
                return id++;
            }
        })()
    };
});
'use strict';
/**
 * 事件系统
 */
wf.define('Action', [], function () {
    return wf.inherit({
        /**
         * 事件名称
         */
        name: String.empty,
        /**
         * 事件注册
         * @param {Function} func
         */
        register: function (func) {
            this.funcs.push(func);
        },
        /**
         * 事件管道
         * @parma {*} param 事件自定义参数
         */
        piping: function (param) {
            var _ac_ = this;
            $.each(_ac_.funcs, function () {
                this(_ac_, param);
            });
        },
        /**
         * 事件初始化
         * @param {String} name 事件名
         * @param {Function} 初始事件体
         * @param {JQuery} $target 触发对象
         */
        init: function (name, func, $target) {
            this.name = name;
            /**
             * 事件注册的函数
             */
            this.funcs = [];
            /**
             * 触发对象
             */
            this.$target = $target;
            if ($.isFunction(func)) {
                func.call(this);
            }
        }
    });
});
'use strict';
/**
 * UI组件
 */
wf.define('UI', ['logger', 'util'], function (logger, util) {
    
    /**
     * UI组件命名规则
     */
    var _WF_ = 'wf';
    var CHAIN = '-';
    var CLS_PREFIX = '.';
    var ID_PREFIX = '#';
    var UI = wf.inherit({
        /**
         * 组件实例名
         */
        name: String.empty,
        
        /**
         * 组件是否激活
         */
        active: true,
        
        /**
         * 组件实例JQuery对象
         */
        $element: {},   
        
        /**
         * 事件对象
         */
        action: {},  
        
        /**
         * 显示
         */
        show: function () {
            this.$element.show();
        },
        
        /**
         * 隐藏
         */
        hide: function () {
            this.$element.hide();
        },
        
        /**
         * 移除当前组件实例
         */
        remove: function () {
            this.$element.remove();
        },
        
        /**
         * 组装className
         * @param {String} name元素名
         */
        clsName: function (name) {
            return [_WF_, this.role, name].join(CHAIN);
        },
        
        /**
         * 单个组件实例查找结构元素
         * @param {String} 元素名（按照组件命名规则）
         * @return {JQuery} 返回结构元素
         */
        find: function (name) {
            return this.$element.find(CLS_PREFIX + this.clsName(name));
        },
        
        /**
         * 设置全局点击机制
         */
        blankClick: (function () {
            
            /**
             * 全局目标对象列表
             */
            var $targetList = [];
            $(document).mouseup(function (e) {
                $.each($targetList, function () {
                    if (!this.target.is(e.target) && 
                            this.target.has(e.target).length === 0) {
                        if ($.isFunction(this.clickOut)) {
                            this.clickOut();
                        }
                    } else {
                        if ($.isFunction(this.clickIn)) {
                            this.clickIn();
                        }
                    }
                });
            });
            
            /**
             * @param {JQuery} $target目标对象
             * @param {Function} clickOut点击非目标对象时执行函数
             * @param {Function} clickIn点击目标对象时执行函数
             */
            return function ($target, clickOut, clickIn) {
                $targetList.push({
                    target: $target,
                    clickIn: clickIn,
                    clickOut: clickOut
                });
            };
        })(),
        
        /**
        * 判断浏览器是否支持某一个CSS3属性
        * @param  {String} style 属性名称
        * @return {Boolean}
        */
        supportCss3: function supportCss3(style) {
            var prefix = ['webkit', 'Moz', 'ms', 'o'];
            var i;
            var humpString = [];
            var htmlStyle = document.documentElement.style;
            var _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };
            
            for (i in prefix) {
                humpString.push(_toHumb(prefix[i] + '-' + style));
            }
            
            humpString.push(_toHumb(style));
            
            for (i in humpString) {
                if (humpString[i] in htmlStyle) {
                    return true;
                }
            }
            return false;
        },
        
        /**
         * 获取动画class
         * @param {Array} keywords 动画关键词
         */
        animationCls: function (keywords) {
            return _WF_ + CHAIN + keywords.join(CHAIN);
        },
        
        /**
         * 为UI添加一段动画
         * @param {Object}  $ui jquery对象
         * @param {String}  cls 动画class
         * @param {Function}  callback 动画结束后回调
         */
        animation: function ($ui, cls, callback) {
            $ui.addClass(cls);
            $ui.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $ui.removeClass(cls);
                if ($.isFunction(callback)) {
                    callback();
                }
            });
        },
        
        /**
         * 初始化组件内部元素
         * @param {String} elements 组件内部元素
         */
        initElement: function (elements) {
            var _ui_ = this;
            $.each(elements, function () {
                this.$element = _ui_.find(this.selector);
                if (this.action && $.isFunction(this.action)) {
                    this.action(this.$element);
                }
                _ui_[this.selector] = this;
            });
        },
        
        /**
         * 初始化组件内部元素
         * @param {Object} events 组件事件
         */
        initEvent: function (events) {
            if (!events) { return; }
            for (var key in events) {
                this.on(key, events[key])
            }
        },
        
        /**
         * 初始化函数
         * @param {JQuery} 组件实例JQuery对象
         * @param {String} name组件实例名
         */
        init: function ($element, name) {
            this.name = !!name || $element.attr('id') || (this.role + util.growingID());
            this.$element = $element;
            if (!this.name) {
                logger.error('missing unique identifier');
            }
        }

    });
    
    /**
     * static 组装className
     * @param {String} 元素名
     * @param {role} 组件role
     * @return {String} 返回className
     */
    UI.clsName = function (name, role) {
        return [_WF_, role, name].join(CHAIN);
    };
    
    UI.CLS_PREFIX = CLS_PREFIX;
    UI.ID_PREFIX = ID_PREFIX;
    UI.CHAIN = CHAIN;
    UI.AUTO_TAG = '[data-auto="true"]';
    UI.DATA_RENDERED_STR = 'data-rendered';
    UI.DATA_RENDERED = '[' + UI.DATA_RENDERED_STR + ']';
    return UI;
});
'use strict';

/**
 * html结构：
 * <span data-role="checkbox" class="wf-checkbox">
 *      <span class="wf-checkbox-inner">
 *          <i class="wf-icon icon-selected"></i>
 *      </span>
 *      <input class="wf-checkbox-input" type="checkbox"/>
 *      <span class="wf-checkbox-text"></span>
 * </span>
 */
wf.define('UI.Checkbox', ['UI', 'logger', 'Action'], function (UI, logger, Action) {

    var role = 'checkbox';

    /**
     * @class Checkbox
     */
    var Checkbox = wf.inherit(UI, {

        /**
         * [data-role]
         */
        role: role,

        /**
         * 选中class
         */
        checkedCls: function () {
            return this.clsName('checked');
        },

        /**
         * disabled class
         */
        disabledCls: function () {
            return this.clsName('disabled');
        },

        /**
         * 注册用户自定义事件
         * @event on
         * @param {String} name 事件名称
         * @param {Function} func 事件函数
         */
        on: function (name, func) {
            if (!this.action[name]) {
                logger.error('checkbox 无{0}事件'.format(name));
            } else {
                this.action[name].register(func);
            }
        },

        /**
         * 设置checkbox的选中状态
         * @param {Bool||undefined} checked 是否选中
         * 如果为undefined则根据当前状态修改
         */
        set: function (checked) {
            var $ele = this.input.$element;
            var result = checked === undefined ?
                $ele.is(':checked') ?
                false : true :
                checked;
            $ele.prop('checked', result);
            this.checked = result;
            this.$element[result ? 'addClass' : 'removeClass'](this.checkedCls());
        },

        /**
         * 设置checkbox的文本内容
         * @param {String} text 文本内容
         */
        setText: function (text) {
            this.text.$element.text(text);
        },

        /**
         * ui初始化
         * @param {String} _base_ 父类同名方法
         * @param {Object} $element ui jquery对象
         * @param {Bool} checked 是否选中
         * @param {Object} events 组件事件
         * events:{'click',function($element){}}
         */
        init: function (_base_, $element, checked, events) {
            var me = this;
            _base_($element);
            //初始化组件元素,为JQuery对象
            me.initElement([
                { selector: 'inner' },
                { selector: 'input' },
                { selector: 'text' }
            ]);
            //初始化选中状态
            me.set(checked || false);
            //初始化事件
            me.action = {
                click: new Action('click', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        if (me.$element.hasClass(me.disabledCls())) {
                            return false;
                        }
                        me.set();
                        _action_.piping();
                    });
                }, this.$element)
            };
            me.initEvent(events);
        }
    });

    /**
     * dataRole
     */
    var dataRole = '[data-role="' + role + '"]';

    /**
     * checkbox实例name
     * @param {Object} $ele Checkbox JQuery元素
     * @param {String} index 元素index
     */
    var name = function ($ele, index) {
        return $ele.attr('id') || role + index;
    };

    /**
     * 创建checkbox
     * @param {Object} $elm checkbox jquery object
     * @param {String} index checkbox index
     * @param {Function} click click事件
     */
    var generateCB = function ($elm, index, click) {       
        return new Checkbox(
            $elm,
            $elm.hasClass(UI.clsName('checked', role)),
            click ? { click: click } : null
        );
    };

    /**
     * 创建checkbox组
     * @param {Object} $controller checkbox控制
     * @return {$controller,items}
     */
    Checkbox.group = function ($controller) {
        var result = { items: {} }, $cb, groupId = $controller.data('target');
        $.each($(UI.ID_PREFIX + groupId).find(dataRole), function (i) {
            $cb = $(this);
            result.items[name($cb, groupId + i)] =
            generateCB($cb, groupId + i, function () {
                var valide = [];
                var all = true;
                for (var key in result.items) {
                    if (valide.length == 0) {
                        valide.push(result.items[key].checked);
                        continue;
                    }
                    if ($.inArray(result.items[key].checked, valide) < 0) {
                        all = false;
                        break;
                    }
                }
                result.controller.set(all ? valide[0] : false);
            });
        });
        result.controller = new Checkbox(
            $controller,
            $controller.hasClass(UI.clsName('checked', role)),
            {
                click: function (cb) {
                    for (var key in result.items) {
                        result.items[key].set(
                            $controller.hasClass(UI.clsName('checked', role))
                        );
                    }
                }
            }
        );
        result.name = groupId;
        result.$element = result.controller.$element;
        return result;
    };

    /**
     * 自动初始化
     * @param {Object} page页面容器
     * @param {Bool} 是否tagRender渲染方式
     */
    Checkbox.auto = function (page, tagRender) {

        var $this, target;
        var $target = tagRender ? $(dataRole).filter(UI.AUTO_TAG) : $(dataRole);
        $.each($target.not(UI.CLS_PREFIX + UI.clsName('group-item', role)).not(UI.DATA_RENDERED), function (index) {
            $this = $(this);
            target = $this.data('target');
            page.addElement(target ?
                Checkbox.group($this, target, index) :
                generateCB($this, index)
            );
        });
    };

    return Checkbox;

});
'use strict';

/**
 * html结构：
 * <span data-role="radio" class="wf-radio">
 *      <span class="wf-radio-inner">
 *          <i class="wf-icon icon-radio"></i>
 *      </span>
 *      <input class="wf-radio-input" type="radio"/>
 *      <span class="wf-radio-text"></span>
 * </span>
 */
wf.define('UI.Radio', ['UI', 'logger', 'Action'], function (UI, logger, Action) {

    var role = 'radio';

    /**
     * @class Radio
     */
    var Radio = wf.inherit(UI, {

        /**
         * [data-role]
         */
        role: role,

        /**
         * 选中class
         */
        checkedCls: function () {
            return this.clsName('checked');
        },

        /**
         * disabled class
         */
        disabledCls: function () {
            return this.clsName('disabled');
        },

        /**
         * 注册用户自定义事件
         * @event on
         * @param {String} name 事件名称
         * @param {Function} func 事件函数
         */
        on: function (name, func) {
            if (!this.action[name]) {
                logger.error('radio 无{0}事件'.format(name));
            } else {
                this.action[name].register(func);
            }
        },

        /**
         * 设置radio的选中状态
         * @param {Bool||undefined} checked 是否选中
         * 如果为undefined则根据当前状态修改
         */
        set: function (checked) {
            var $ele = this.input.$element;
            var result = checked === undefined ?
                $ele.is(':checked') ?
                false : true :
                checked;
            $ele.prop('checked', result);
            this.checked = result;
            this.$element[result ? 'addClass' : 'removeClass'](this.checkedCls());
        },

        /**
         * 设置radio的文本内容
         * @param {String} text 文本内容
         */
        setText: function (text) {
            this.text.$element.text(text);
        },

        /**
         * ui初始化
         * @param {String} _base_ 父类同名方法
         * @param {Object} $element ui jquery对象
         * @param {Bool} checked 是否选中
         * @param {Object} events 组件事件
         * events:{'click',function($element){}}
         */
        init: function (_base_, $element, checked, events) {
            var me = this;
            _base_($element);
            //初始化组件元素,为JQuery对象
            me.initElement([
                { selector: 'inner' },
                { selector: 'input' },
                { selector: 'text' }
            ]);
            //初始化选中状态
            me.set(checked || false);
            //初始化事件
            me.action = {
                click: new Action('click', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        if (me.$element.hasClass(me.disabledCls())) {
                            return false;
                        }
                        me.set(true);
                        _action_.piping();
                    });
                }, this.$element)
            };
            me.initEvent(events);
        }
    });

    /**
     * dataRole
     */
    var dataRole = '[data-role="' + role + '"]';

    /**
     * radio实例name
     * @param {Object} $ele Radio JQuery元素
     * @param {String} index 元素index
     */
    var name = function ($ele, index) {
        return $ele.attr('id') || role + index;
    };

    /**
     * 创建radio
     * @param {Object} $elm radio jquery object
     * @param {String} index radio index
     * @param {Function} click click事件
     */
    var generateRD = function ($elm, index, click) {
        return new Radio(
            $elm,
            $elm.hasClass(UI.clsName('checked', role)),
            click ? { click: click } : null
        );
    };

    /**
     * 创建radio组
     * @param {Object} $group radio控制
     * @param {String} index $group index
     * @return {items}
     */
    Radio.group = function ($group, index) {
        var result = { items: {} }, $rd, groupId = name($group, index);
        $.each($group.find(dataRole), function (i) {
            $rd = $(this);
            result.items[name($rd, groupId + i)] =
            generateRD($rd, groupId + i, function (e) {
                for (var key in result.items) {
                    if (key !== e.$target.attr('id')) {
                        result.items[key].set(false);
                    }
                }
            });
        });
        result.name = groupId;
        result.$element = $group;
        return result;
    };

    /**
     * 自动初始化
     * @param {Object} page页面容器
     * @param {Bool} 是否tagRender渲染方式
     */
    Radio.auto = function (page, tagRender) {
        var $this, target;
        var groupCls = '.' + UI.clsName('group', role);
        var $target = tagRender ? $(dataRole).filter(UI.AUTO_TAG) : $(dataRole);
        var $targetGroup = tagRender ? $(groupCls).filter(UI.AUTO_TAG) :$(groupCls);
        $.each($target.not('.' + UI.clsName('group-item', role)).not(UI.DATA_RENDERED), function (index) {
            page.addElement(generateRD($(this), index));
        });
        $.each($targetGroup.not(UI.DATA_RENDERED), function (index) {
            page.addElement(Radio.group($(this)));
        });

    };

    return Radio;

});
'use strict';

/**
 * html结构：
 * <div data-role="select" class="wf-select" id="select-demo">
 *     <div class="wf-select-selection">
 *         <div class="wf-select-selection-value"></div>
 *         <i class="wf-icon icon-moreunfold"></i>
 *     </div>
 *     <input class="wf-select-input" type="text" />
 *     <ul class="wf-select-options">
 *         <li data-value="wanfangdata" class="wf-select-option wf-select-option-selected">wangfangdata</li>
 *         <li data-value="wffe" class="wf-select-option">wffe</li>
 *         <li data-value="bishanshan" class="wf-select-option">bishanshan</li>
 *         <li data-value="selector" class="wf-select-option">选择器</li>
 *     </ul>
 * </div>
 */
wf.define('UI.Select', ['logger', 'UI', 'Action', 'browser'], function (logger, UI, Action, browser) {
    
    var role = 'select';
    
    /**
     * @class Select
     */
    var Select = wf.inherit(UI, {
        
        /**
         * [data-role]
         */
        role: role,
        
        /**
         * 选中class
         */
        openCls: function () {
            return this.clsName('open');
        },
        
        /**
         * disabled class
         */
        disabledCls: function () {
            return this.clsName('disabled');
        },
        
        /**
         * disabled class
         */
        selectCls: function () {
            return this.clsName('option-selected');
        },    
        
        /**
         * 注册用户自定义事件
         * @event on
         * @param {String} name 事件名称
         * @param {Function} func 事件函数
         */
        on: function (name, func) {
            if (!this.action[name]) {
                logger.error('select 无{0}事件'.format(name));
            } else {
                this.action[name].register(func);
            }
        },
        
        /**
         * select打开选项列表
         */
        open: function () {
            this.$element.addClass(this.openCls());
            this.animation(this.options.$element, 
                this.animationCls(['slide', 'up', 'in'])
            );
        },    
        
        /**
         * select收起选项列表
         */
        close: function () {
            var me = this;
            if (me.supportCss3('animation') && !browser.msie) {
                me.animation(
                    this.options.$element,
                    this.animationCls(['slide', 'up', 'out']),
                    function () {
                        me.$element.removeClass(me.openCls());
                    }
                );
            } else {
                me.$element.removeClass(me.openCls());
            }
        },            
        
        /**
         * 设置select的选中状态
         * @param {String} value 选中值
         * @param {String} text 选中文本
         */
        set: function (value, text) {
            this.selection
            .$element
            .find(UI.CLS_PREFIX + this.clsName('selection-value'))
            .text(text);
            this.input.$element.val(value);
        }, 
        
        /**
         * 获取select值
         * @param {String} value 选中值
         * @param {String} text 选中文本
         */  
        value: function () {
            return this.input.$element.val();
        },    
        
        /**
         * ui初始化
         * @param {String} _base_ 父类同名方法
         * @param {Object} $element ui jquery对象
         * @param {Object} events 组件事件
         * events:{'click',function($element){}}
         */
        init: function (_base_, $element, events) {
            var me = this;
            _base_($element);
            //初始化组件元素,为JQuery对象
            me.initElement([
                {
                    selector: 'selection'
                },
                {
                    selector: 'input'
                },
                {
                    selector: 'options', 
                    action: function ($options) {
                        var $selected;
                        var $item;
                        var selectCls = me.selectCls();
                        var $optionList = $options.find(UI.CLS_PREFIX + me.clsName('option', role));
                        var selected = function ($item) {
                            me.set($item.data('value'), $item.text());
                        };
                        $optionList.each(function () {
                            $item = $(this);
                            $item.click(function () {
                                if ($(this).hasClass(selectCls)) {
                                    return;
                                } else {
                                    me.action.change.piping($(this));
                                }
                                $(this)
                                .addClass(selectCls)
                                .siblings()
                                .removeClass(selectCls);
                                selected($(this));
                                me.close();
                            });
                            if ($item.hasClass(selectCls)) {
                                $selected = $item;
                            }
                        });
                        //默认项
                        if (!$selected) { $selected = $($optionList[0]).addClass(selectCls); }
                        selected($selected);
                    }
                }
            ]);
            //初始化事件
            me.action = {
                click: new Action('click', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        if (me.$element.hasClass(me.disabledCls())) {
                            return false;
                        }
                        me[me.$element.hasClass(me.openCls())?'close':'open']();
                        _action_.piping();
                    });
                }, this.selection.$element),
                change: new Action('change', function () { 
                    //在$optionList click触发
                }, this.options.$element)
            };
            me.initEvent(events);
            me.blankClick(me.find([
                UI.CLS_PREFIX + me.clsName('options', role),
                UI.CLS_PREFIX + me.clsName('selection', role)
            ].join(',')), function () {
                if (me.$element.hasClass(me.openCls())) {
                    me.close();
                }
            });
        }
    });
    
    /**
     * dataRole
     */
    var dataRole = '[data-role="' + role + '"]';
    
    /**
     * 自动初始化
     * @param {Object} page页面容器
     * @param {Bool} 是否tagRender渲染方式
     */
    Select.auto = function (page, tagRender) {
        var $target = tagRender ? $(dataRole).filter(UI.AUTO_TAG) : $(dataRole);
        $.each($target.not(UI.DATA_RENDERED), function (index) {
            page.addElement(new Select($(this)));
        });

    };
    
    return Select;

});
'use strict';
/**
 * <div data-role="tab" class="wf-tab">
 *   <div class="wf-tab-nav">
 *       <div class="wf-tab-nav-item wf-tab-nav-active">全部</div>
 *       <div class="wf-tab-nav-item  wf-tab-disabled">核心刊</div>
 *       <div class="wf-tab-nav-item">优先出版</div>
 *   </div>
 *   <div class="wf-tab-content">
 *       <div class="wf-tab-content-item wf-tab-content-active">Content of Tab1</div>
 *       <div class="wf-tab-content-item">Content of Tab2</div>
 *       <div class="wf-tab-content-item">Content of Tab3</div>
 *   </div>
 *</div>
 * 标签页
 */
wf.define('UI.Tab', ['UI', 'logger', 'Action'], function (UI, logger, Action) {
    
    
    var role = 'tab';
    /**
     * @class Menu
     */
    var Tab = wf.inherit(UI, {
        
        /**
         * [data-role]
         */
        role: role,        
        
        /**
         * disabled class
         */
        disabledCls: function () {
            return this.clsName('disabled');
        },
        
        /**
         * active class
         * @param {String} name ,nav或content active
         */
        activeCls: function (name) {
            return this.clsName(name + UI.CHAIN + 'active');
        },
        
        /**
         * 设置页码为index页为当前页
         * @param {Number} index 页码
         */
        activeTo: function (index) {
            var me = this;
            $.each(['nav', 'content'], function () {
                me[this].$element
                .find(UI.CLS_PREFIX + me.clsName(this + UI.CHAIN + 'item'))
                .eq(index)
                .addClass(me.activeCls(this))
                .siblings().removeClass(me.activeCls(this));
            });
            me.content.$element.css({ 'margin-left': -(index * 100) + '%' });
        },
        
        /**
         * 注册用户自定义事件
         * @event on
         * @param {String} name 事件名称
         * @param {Function} func 事件函数
         */
        on: function (name, func) {
            if (!this.action[name]) {
                logger.error('tab 无{0}事件'.format(name));
            } else {
                this.action[name].register(func);
            }
        },

        /**
         * ui初始化
         * @param {String} _base_ 父类同名方法
         * @param {Object} $element ui jquery对象
         * @param {Object} events 组件事件
         * events:{'change',function($element){}}
         */
        init: function (_base_, $element, events) {
            _base_($element);
            var me = this;
            this.initElement([
                { selector: 'nav' },
                { selector: 'content' }
            ]);
            //初始化事件
            me.action = {
                change: new Action('change', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        if ($(this).hasClass(me.disabledCls()) || 
                            $(this).hasClass(me.activeCls('nav'))) {
                            return false;
                        }
                        me.activeTo($(this).index());
                        _action_.piping();
                    });
                }, this.nav.$element.find(UI.CLS_PREFIX + this.clsName('nav-item')))
            };
            this.initEvent(events);
        }
    });
    
    /**
     * dataRole
     */
    var dataRole = '[data-role="' + role + '"]';
    
    /**
     * 自动初始化
     * @param {Object} page页面容器
     * @param {Bool} 是否tagRender渲染方式
     */
    Tab.auto = function (page, tagRender) {

        var $target = tagRender ? $(dataRole).filter(UI.AUTO_TAG) : $(dataRole);
        $.each($target.not(UI.DATA_RENDERED), function (index) {
            page.addElement(new Tab($(this)));
        });

    };
    
    return Tab;

});
'use strict';

/**
 * html结构：
 * <div class="wf-alert wf-alert-info">
 *     <span class="wf-alert-title">INFO : </span>
 *     <span class="wf-alert-message">This alert needs your attention, but it’s not important.</span>
 *     <i class="wf-icon icon-close"></i>
 * </div>
 */
wf.define('UI.Alert', ['UI', 'logger', 'Action'], function (UI, logger, Action) {

    var role = 'alert';

    /**
     * @class Alert
     */
    var Alert = wf.inherit(UI, {

        /**
         * [data-role]
         */
        role: role,

        /**
         * 注册用户自定义事件
         * @event on
         * @param {String} name 事件名称
         * @param {Function} func 事件函数
         */
        on: function (name, func) {
            if (!this.action[name]) {
                logger.error('alert 无{0}事件'.format(name));
            } else {
                this.action[name].register(func);
            }
            return this;
        },

        /**
         * 关闭警告框
         */
        close: function () {
            this.$element.remove();
        },

        /**
         * ui初始化
         * @param {String} _base_ 父类同名方法
         * @param {Object} $element ui jquery对象
         * events:{'click',function($element){}}
         */
        init: function (_base_, $element, events) {
            var me = this;
            var ICON_CLOSE = 'icon-close';
            _base_($element);
            //初始化组件元素,为JQuery对象
            me.initElement([
                { selector: ICON_CLOSE }
            ]);
            //初始化事件
            me.action = {
                close: new Action('close', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        me.close();
                        _action_.piping();
                    });
                }, this[ICON_CLOSE].$element)
            };
            me.initEvent(events);
        }
    });

    /**
     * dataRole
     */
    var dataRole = '[data-role="' + role + '"]';

    /**
     * 自动初始化
     * @param {Object} page页面容器
     * @param {Bool} 是否tagRender渲染方式
     */
    Alert.auto = function (page, tagRender) {
        var $target = tagRender ? $(dataRole).filter(UI.AUTO_TAG) : $(dataRole);
        $.each($target.not(UI.DATA_RENDERED), function (index) {
            page.addElement(new Alert($(this)));
        });
    };

    return Alert;

});
'use strict';

/**
 * html结构：
 * <div class="wf-modal">
 *     <div class="wf-modal-mask"></div>
 *     <div class="wf-modal-content">
 *         <div class="wf-modal-header">
 *             <div class="wf-modal-title">Title</div>
 *             <i class="wf-icon icon-close"></i>
 *         </div>
 *         <div class="wf-modal-body">
 *             <p>some contents...</p><p>some contents...</p><p>some contents...</p>
 *         </div>
 *         <div class="wf-modal-footer">
 *             <button type="button" class="wf-btn">Cancel</button>
 *             <button type="button" class="wf-btn wf-btn-primary">OK</button>
 *         </div>
 *     </div>
 * </div>
 */

wf.define('UI.Modal', ['UI', 'logger', 'Action', 'util'], function (UI, logger, Action, util) {

    var role = 'modal';

    /**
     * @class Modal
     */
    var Modal = wf.inherit(UI, {

        /**
         * [data-role]
         */
        role: role,

        /**
         * 注册用户自定义事件
         * @event on
         * @param {String} name 事件名称
         * @param {Function} func 事件函数
         */
        on: function (name, func) {
            if (!this.action[name]) {
                logger.error('modal 无{0}事件'.format(name));
            } else {
                this.action[name].register(func);
            }
        },

        /**
         * hide class
         */
        hideCls: function () {
            return this.clsName('hidden');
        },

        /**
         * mask hide class
         */
        maskHideCls: function () {
            return this.clsName('mask-hidden');
        },

        /**
         * 关闭对话框
         */
        close: function () {
            var me = this;
            $('body').removeAttr('style');
            if (me.supportCss3('animation')) {
                me.animation(me.mask.$element, me.animationCls(['fade', 'leave']));
                me.animation(me.content.$element, me.animationCls(['zoom', 'leave']), function () {
                    me.$element.addClass(me.hideCls());
                });
            } else {
                me.$element.addClass(me.hideCls());
            }
        },

        /**
         * 打开对话框
         */
        open: function (origin) {
            var offset;
            var transformOrigin;
            var scrollWidth;
            var me = this;
            me.$element.removeClass(this.hideCls());
            if (me.supportCss3('animation')) {
                scrollWidth = util.getScrollbarWidth();
                if (origin) {
                    offset = me.content.$element.offset();
                    transformOrigin = (origin.left - offset.left) + 'px ' + (origin.top - offset.top) + 'px';
                    me.content.$element.css({ 'transform-origin': transformOrigin });
                }
                $('body').attr('style', 'margin-right:' + scrollWidth + 'px; overflow: hidden;');
                me.animation(me.mask.$element, me.animationCls(['fade', 'enter']));
                me.animation(me.content.$element, me.animationCls(['zoom', 'enter']));
            }
        },

        /**
         * ui初始化
         * @param {String} _base_ 父类同名方法
         * @param {Object} $element ui jquery对象
         * events:{'click',function($element){}}
         */
        init: function (_base_,$element, events) {
            var me = this;
            _base_($element);
            //初始化组件元素,为JQuery对象
            me.initElement([
                { selector: 'content' },
                { selector: 'mask' },
                { selector: 'closeBtn' },
                { selector: 'cancelBtn' },
                { selector: 'okBtn' }
            ]);
            //初始化事件
            me.action = {
                close: new Action('close', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        me.close();
                        _action_.piping();
                    });
                }, this.closeBtn.$element),
                cancel: new Action('cancel', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        me.close();
                        _action_.piping();
                    });
                }, this.cancelBtn.$element),
                ok: new Action('ok', function () {
                    var _action_ = this;
                    _action_.$target.click(function () {
                        if (me.$element.hasClass(me.clsName('message'))) {
                            me.close();
                        }
                        _action_.piping();
                    });
                }, this.okBtn.$element)
            };
            me.initEvent(events);
        }
    });

    /**
     * 自动初始化
     * @param {Object} page页面容器
     * @param {Bool} 是否tagRender渲染方式
     */
    Modal.auto = function (page, tagRender) {
        var fireBtn = $('[data-modal]');
        var $target = tagRender ? fireBtn.filter(UI.AUTO_TAG) : fireBtn;
        $.each($target.not(UI.DATA_RENDERED), function (index) {
            var id = $(this).data('modal');
            var modal = new Modal($(UI.ID_PREFIX + id));
            $(this).click(function (e) {
                modal.open($(this).offset());
            });
            page.addElement(modal);
        });
    };

    return Modal;

});
'use strict';
/**
 * Page容器
 */
wf.define('page', ['logger', 'UI'], function (logger, UI) {

    /**
     * Page
     */
    return {
        /**
         * 页面名称
         */
        name: String.empty,

        /**
         * 页面组件
         */
        components: {},

        /**
         * 页面组件实例
         */
        element: {},

        /**
         * 添加组件
         * @param {Object} element组件
         */
        addElement: function (element) {
            if (this.element[element.name]) {
                logger.error('页面组件id:' + element.name + ' 重复');
                return;
            }
            this.element[element.name] = element;
            element.$element.attr(UI.DATA_RENDERED_STR, true);
        },

        /**
         * 自动render页面所有组件
         * @param {Bool} tagRender是否为data-auto="true"方式渲染
         */
        auto: function (tagRender) {

            for (var com in this.components) {
                if ($.isFunction(this.components[com].auto)) {
                    this.components[com].auto(this, tagRender);
                } else {
                    logger.error(com + '缺少auto render');
                }
            }

        },

        logger: logger,

        /**
         * 初始化函数
         * @param {String} name页面名称
         * @param {Array<String>} components页面组件
         * @param {Function} func 自定义执行函数
         * @param {Bool} auto 所有组件是否自动初始化
         * @return {Object} 返回当前页面
         */
        render: function (name, components, func, auto) {
            var _pg_ = this;
            var UI_SPLITOR = '.';
            _pg_.name = name;
            $.each(components, function () {
                if (this.indexOf(UI_SPLITOR) > -1) {
                    _pg_.components[this.split(UI_SPLITOR)[1]] = wf.require(this);
                } else {
                    if (!_pg_[this]) {
                        _pg_[this] = wf.require(this);
                    }
                }
            });
            _pg_.auto(!auto);
            if ($.isFunction(func)) {
                func.call(_pg_, _pg_.components, _pg_.element);
            }
            return _pg_;
        },

        /**
         * page刷新对于新增的组件进行初始化 
         */
        refresh: function () {
            this.auto();
        }
    };
});