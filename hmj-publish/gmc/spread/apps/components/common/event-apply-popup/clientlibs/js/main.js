(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.eventApplyLayer = global.g2.eventApplyLayer || {};
    global.g2.eventApplyLayer.Component = factory();
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
                infoLabel : '.info-label',
                infoWrap : '.event-apply-popup__info',
                inputWrap : '.cm-input-wrap',
                showClass : 'is-show',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.layerObj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.bindCallBackEvents();
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
            },
            layerSetElements : function () {
                this.inputWrap = this.layerObj.find(this.opts.inputWrap);
            },
            layerBindEvents : function () {
                this.inputWrap.on('focusin focusout', 'input, a', $.proxy(this.onFocusFunc, this));
            },
            onFocusFunc : function (e) {
                var target = $(e.currentTarget),
                    targetParent = target.closest(this.opts.infoWrap),
                    targetLabel = targetParent.find(this.opts.infoLabel);
                if (e.type === 'focusin') {
                    if (!targetLabel.hasClass(this.opts.showClass)) {
                        targetLabel.addClass(this.opts.showClass);
                    }
                } else if (e.type === 'focusout') {
                    if (targetLabel.hasClass(this.opts.showClass)) {
                        targetLabel.removeClass(this.opts.showClass);
                    }
                }
            },
            openBeforeFunc : function () {
                this.layerSetElements();
                this.layerBindEvents();
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
                obj : '#event-apply-layer'
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
                    new win.g2.eventApplyLayer.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
