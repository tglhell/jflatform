(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpLayerStandard = global.g2.cpLayerStandard || {};
    global.g2.cpLayerStandard.Component = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                layerObj : container,
                tabList : '.standard-popup__tab-list',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.layerObj = $(this.opts.layerObj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.bindCallBackEvents();
            },
            setElements : function () {
                this.tabList = this.layerObj.find(this.opts.tabList);
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindCallBackEvents : function () {
                this.layerObj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.layerObj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
            },
            openBeforeFunc : function () {
                this.buildTab();
            },
            closeAfterFunc : function () {
                this.destroyTab();
            },
            buildTab : function () {
                Util.def(this, {
                    tab : {
                        instances : []
                    }
                });

                for (var min = 0, max = this.tabList.length; min < max; min++) {
                    var tabList = this.tabList.eq(min);
                    var instance = new Tab(tabList);
                    this.tab.instances.push(instance);
                }
            },
            destroyTab : function () {
                for (var min = 0, max = this.tab.instances.length; min < max; min++) {
                    var instance = this.tab.instances[min];
                    instance.kill();
                }
                this.tab.instances = [];
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Tab (container, args) {
            if (!(this instanceof Tab)) {
                return new Tab(container, args);
            }
            var defParams = {
                tabItem : '.standard-popup__tab-item',
                classAttr : {
                    active : 'is-active'
                },
                props : {},
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Tab.prototype = {
            init : function () {
                this.setElements();
                this.buildData();
                this.bindEvents(true);
            },
            setElements : function () {
                this.tabItem = this.obj.find(this.opts.tabItem);
            },
            buildData : function () {
                for (var smin = 0, smax = this.tabItem.length; smin < smax; smin++) {
                    var tabItem = this.tabItem.eq(smin),
                        tabLink = tabItem.find('a'),
                        tabPanel = $(tabLink.attr('href'));
                    this.opts.props[smin] = {
                        'LI' : tabItem,
                        'TAB' : tabLink,
                        'PANEL' : tabPanel.length ? tabPanel : null
                    }
                }
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindEvents : function (type) {
                if (type) {
                    this.tabItem.on(this.changeEvents('click'), 'a', $.proxy(this.tabClick, this));
                } else {
                    this.tabItem.off(this.changeEvents('click'));
                }
            },
            tabClick : function (e) {
                e.preventDefault();
                var _dTarget = $(e.delegateTarget),
                    _targetIndex = this.tabItem.index(_dTarget);
                this.activePanel(_targetIndex);
            },
            activePanel : function (index) {
                var props = this.opts.props,
                    classAttr = this.opts.classAttr;
                var allClose = $.proxy(function (index) {
                    for (var key in props) {
                        if (key != index) {
                            props[key]['LI'].removeClass(classAttr.active);
                            props[key]['PANEL'].hide();
                        }
                    }
                }, this);
                allClose(index);
                props[index]['LI'].addClass(classAttr.active);
                props[index]['PANEL'].css('display', '');
            },
            kill : function () {
                this.bindEvents(false);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        return Component;
    })();
    return Component;

}));

(function (global, factory) {
    $(function () {
        factory();
    });
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (args) {
            var defParams = {
                obj : '.standard-popup'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.callComponent();
            },
            callComponent : function () {
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    new win.g2.cpLayerStandard.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
