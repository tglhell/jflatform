(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpStandardVideo = global.g2.cpStandardVideo || {};
    global.g2.cpStandardVideo.Component = factory();
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
                obj : container,
                foldInner : '.fold-text-inner',
                foldInnerBtn : '.fold-text-btn',
                foldDescWrap : '.fold-desc-wrap',
                foldDescInner : '.fold-desc-inner',
                classAttr : {
                    heightfull : 'is-heightfull',
                    opened : 'is-opened'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                isFoldActive : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.foldInner = this.obj.find(this.opts.foldInner);
                this.foldInnerBtn = this.foldInner.find(this.opts.foldInnerBtn);
                this.foldDescWrap = this.foldInner.find(this.opts.foldDescWrap);
                this.foldDescInner = this.foldDescWrap.find(this.opts.foldDescInner);
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
                    this.foldInnerBtn.on(this.changeEvents('click'), $.proxy(this.foldInnerBtnClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.foldInnerBtn.off(this.changeEvents('click'));
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                var winHeight = Util.winSize().h,
                    fullCondition = winHeight >= 1080;
                this.obj.toggleClass(this.opts.classAttr.heightfull, fullCondition);
                if (this.opts.isFoldActive) {
                    this.foldLayout(true, 0);
                }
            },
            foldInnerBtnClick : function (e) {
                e.preventDefault();
                var _targetBtn = $(e.currentTarget);
                this.opts.isFoldActive = !this.opts.isFoldActive;
                this.foldView(_targetBtn);
                this.foldLayout(this.opts.isFoldActive);
            },
            foldView : function (targetBtn) {
                this.foldInner.toggleClass(this.opts.classAttr.opened, this.opts.isFoldActive);
                if (this.foldInner.hasClass(this.opts.classAttr.opened)) {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'true');
                } else {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'false');
                }
            },
            foldLayout : function (type, speed) {
                var foldDescInnerHeight = this.foldDescInner.outerHeight(true);
                Util.findFocus(this.foldInner);
                if (type) {
                    this.foldDescWrap.css('height', foldDescInnerHeight);
                } else {
                    this.foldDescWrap.css('height', '');
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
                obj : '.cp-standard-video'
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
                    new win.g2.cpStandardVideo.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
