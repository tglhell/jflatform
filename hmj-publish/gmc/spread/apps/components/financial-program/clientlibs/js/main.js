(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpFinancialProgram = global.g2.cpFinancialProgram || {};
    global.g2.cpFinancialProgram.Component = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                obj : container,
                tabList : '.cp-financial-program__tab-list',
                tabItem : '.cp-financial-program__tab-item',
                cmAccordion : '.cm-accordion',
                props : {},
                classAttr : {
                    active : 'is-active',
                    selected : 'is-selected'
                },
                ariaAttr : {
                    selected : 'aria-selected',
                    expanded : 'aria-expanded',
                    hidden : 'aria-hidden'
                },
                globalText : {},
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildData();
                this.buildAccordion();
                this.bindEvents();
                this.loadComponent();
            },
            setElements : function () {
                this.tabList = this.obj.find(this.opts.tabList);
                this.tabItem = this.tabList.find(this.opts.tabItem);
                this.cmAccordion = this.obj.find(this.opts.cmAccordion);
            },
            initOpts : function () {
                // globalText
                var globalText = this.obj.data('global-text');
                if (globalText !== isUndefined) {
                    for (var gKey in globalText) {
                        var gText = $.trim(globalText[gKey]);
                        this.opts.globalText[gKey] = gText.length ? gText : gKey;
                    }
                }
            },
            buildData : function () {
                for (var smin = 0, smax = this.tabItem.length; smin < smax; smin++) {
                    var tabItem = this.tabItem.eq(smin),
                        tabItemLink = tabItem.find('a'),
                        tabItemPanel = $(tabItemLink.attr('href'));
                    this.opts.props[smin] = {
                        'LI' : tabItem,
                        'TAB' : tabItemLink,
                        'PANEL' : tabItemPanel.length ? tabItemPanel : null
                    }
                }
            },
            buildAccordion : function () {
                Util.def(this, {
                    accordion : {
                        instance : [],
                        build : $.proxy(function () {
                            for (var i = 0, max = this.cmAccordion.length; i < max; i++) {
                                var cmAccordion = this.cmAccordion.eq(i);
                                cmAccordion.data('global-text', this.opts.globalText);
                                this.accordion.instance.push(new HiveAccordion(cmAccordion));
                            }
                        }, this)
                    }
                });
                this.accordion.build();
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindEvents : function () {
                this.tabItem.on(this.changeEvents('click'), 'a', $.proxy(this.tabClick, this));
            },
            tabClick : function (e) {
                e.preventDefault();
                var _dTarget = $(e.delegateTarget),
                    _targetIndex = this.tabItem.index(_dTarget);
                this.activePanel(_targetIndex);
            },
            activePanel : function (index) {
                var props = this.opts.props,
                    ariaAttr = this.opts.ariaAttr,
                    classAttr = this.opts.classAttr;
                var allClose = $.proxy(function (index) {
                    for (var key in props) {
                        if (key != index) {
                            props[key]['LI'].removeClass(classAttr.selected);
                            props[key]['TAB'].attr(ariaAttr.selected, 'false');
                            props[key]['PANEL'].removeClass(classAttr.active).attr(ariaAttr.hidden, 'true');
                        }
                    }
                }, this);
                allClose(index);
                props[index]['LI'].addClass(classAttr.selected);
                props[index]['TAB'].attr(ariaAttr.selected, 'true');
                props[index]['PANEL'].addClass(classAttr.active).attr(ariaAttr.hidden, 'false');
            },
            loadComponent : function () {
                var tabItem = this.tabItem,
                    selectTabItem = tabItem.filter('.'+this.opts.classAttr.selected),
                    loadIndex = selectTabItem.length ? tabItem.index(selectTabItem) : 0;
                this.activePanel(loadIndex);
            },
            reInit : function (e) {
                // Global Callback
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
                obj : '.cp-financial-program'
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
                    new win.g2.cpFinancialProgram.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
