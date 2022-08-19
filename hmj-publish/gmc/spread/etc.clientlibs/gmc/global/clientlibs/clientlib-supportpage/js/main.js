// Util Menu (share, download btns)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (
        global = global || self,
        global.G2 = global.G2 || {},
        global.G2.Controller = global.G2.Controller || {},
        global.G2.Controller.supportDetailHead = global.G2.Controller.supportDetailHead || {},
        global.G2.Controller.supportDetailHead.Component = factory()
    );
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util,
            Responsive = win.G2.RESPONSIVE,
            svgData = win.G2.data.svgDatas;
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                container : container,
                listItem : '.has-menu',
                menuBtn : '.util-btn',
                submenuList : '.util-list',
                submenuBtn : '> li > a',
                openClass : 'is-open',
                accessData : {
                    EXPANDED : 'aria-expanded'
                },
                currentIndex : null,
                resizeStart : null,
                viewType : null,
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
                this.resizeFunc();
            },
            setElements : function () {
                this.listItem = this.obj.find(this.opts.listItem);
                this.menuBtn = this.listItem.find(this.opts.menuBtn);
                this.submenuList = this.obj.find(this.opts.submenuList);
                this.submenuBtn = this.submenuList.find(this.opts.submenuBtn);
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
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                    this.listItem.on(this.changeEvents('click'), this.opts.menuBtn, $.proxy(this.onClickBtn, this));
                    this.submenuBtn.on(this.changeEvents('click'), $.proxy(this.onClickSubmenu, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.listItem.off(this.changeEvents('click'));
                    this.submenuBtn.off(this.changeEvents('click'));
                }
            },
            bindOutsideEvents : function (type, idx) {
                (type) ? this.listItem.eq(idx).on('clickoutside focusoutside', $.proxy(this.onClickoutsideFunc, this)) : this.listItem.eq(idx).off('clickoutside focusoutside');
            },
            onClickBtn : function (e) {
                e.preventDefault();
                var target = $(e.delegateTarget),
                    targetIndex = target.index();
                if (!target.hasClass(this.opts.openClass)) {
                    target.addClass(this.opts.openClass);
                    this.accessbilityFunc(true, target);
                    this.bindOutsideEvents(true, targetIndex);
                } else {
                    target.removeClass(this.opts.openClass);
                    this.accessbilityFunc(false, target);
                    this.bindOutsideEvents(false, targetIndex);
                }
            },
            onClickoutsideFunc : function (e) {
                var target = $(e.currentTarget);
                target.find(this.opts.menuBtn).trigger('click');
            },
            onClickSubmenu : function (e) {
                e.preventDefault();
                var target = $(e.currentTarget),
                    parentMenuBtn = target.closest(this.opts.listItem).find(this.opts.menuBtn);
                if (this.opts.viewType === 'pc') {
                    parentMenuBtn.trigger('click');
                }
            },
            accessbilityFunc : function (type, target) {
                var accessData = this.opts.accessData;
                if (type) {
                    target.find(this.opts.menuBtn).attr(accessData.EXPANDED, 'true');
                } else {
                    target.find(this.opts.menuBtn).attr(accessData.EXPANDED, 'false');
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setLayout();
            },
            setLayout : function () {
                if (!Util.isSupportTransform || Util.isSupportTransform && (this.winWidth > (Responsive.MOBILE.WIDTH - 1))) {
                    if (this.opts.viewType !== 'pc') {
                        this.opts.viewType = 'pc';
                    }
                } else {
                    if (this.opts.viewType !== 'mo') {
                        this.opts.viewType = 'mo';
                    }
                }
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
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (
        global = global || self,
        global.G2 = global.G2 || {},
        global.G2.Controller = global.G2.Controller || {},
        global.G2.Controller.supportDetailHead = global.G2.Controller.supportDetailHead || {},
        global.G2.Controller.supportDetailHead.ComponentCall = factory()
    );
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util;
        function Component (args) {
            var defParams = {
                obj : '.js-util-menu'
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
                    new win.G2.Controller.supportDetailHead.Component(this.obj.eq(i));
                }
            }
        };
        return Component;
    })();
    return Component;

}));

// support post item
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (
        global = global || self,
        global.G2 = global.G2 || {},
        global.G2.Controller = global.G2.Controller || {},
        global.G2.Controller.postItem = global.G2.Controller.postItem || {},
        global.G2.Controller.postItem.Component = factory()
    );
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util,
            Responsive = win.G2.RESPONSIVE;
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                container : container,
                hoverSection: '> a',
                hoverClass : 'is-hover',
                viewType: null,
                resizeStart : null,
                loadAfter : null,
                customEvent : '.Component' + (new Date()).getTime()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.bindEvents(true);
                this.resizeFunc();
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
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                }
            },
            bindElementEvents : function (type) {
                if (type) {
                    this.obj.on(this.changeEvents('mouseenter mouseleave focusin focusout'), this.opts.hoverSection, $.proxy(this.onHoverList, this));
                } else {
                    this.obj.off(this.changeEvents('mouseenter mouseleave focusin focusout'));
                }
            },
            onHoverList : function (e) {
                var target = $(e.delegateTarget);
                if (e.type === 'mouseenter' || e.type === 'focusin') {
                    if (target.hasClass(this.opts.hoverClass)) return;
                    target.addClass(this.opts.hoverClass);
                } else if (e.type === 'mouseleave' || e.type === 'focusout') {
                    if (!target.hasClass(this.opts.hoverClass)) return;
                    target.removeClass(this.opts.hoverClass);
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setLayout();
            },
            setLayout : function () {
                if (!Util.isSupportTransform || Util.isSupportTransform && (this.winWidth > (Responsive.MOBILE.WIDTH - 1))) {
                    if (this.opts.viewType !== 'pc') {
                        this.opts.viewType = 'pc';
                        this.bindElementEvents(true);
                    }
                } else {
                    if (this.opts.viewType !== 'mo') {
                        this.opts.viewType = 'mo';
                        this.bindElementEvents(false);
                    }
                }
            }
        };
        return Component
    })();
    return Component;

}));

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (
        global = global || self,
        global.G2 = global.G2 || {},
        global.G2.Controller = global.G2.Controller || {},
        global.G2.Controller.postItem = global.G2.Controller.postItem || {},
        global.G2.Controller.postItem.ComponentCall = factory()
    );
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util;
        function Component (args) {
            var defParams = {
                obj : '.cm-sup-post'
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
                    new win.G2.Controller.postItem.Component(this.obj.eq(i));
                }
            }
        };
        return Component;
    })();
    return Component;

}));

(function (global) {
    global = global;
    $(function () {
        new global.G2.Controller.supportDetailHead.ComponentCall();
        new global.G2.Controller.postItem.ComponentCall();
    });
}(this));