(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.changeRegion = global.g2.changeRegion || {};
    global.g2.changeRegion.Component = factory();
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
                accordionWrap: '.region-accordion',
                accordionInstance : null,
                accordionOpts : {
                    accordionList : '.region-accordion-list',
                    accordionItem : '.region-accordion-item',
                    btn : '.accordion-btn',
                    panel : '.region-accordion-panel',
                    panelInner : '.accordion-panel-inner',
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
                this.buildAccordion();
            },
            setElements : function () {
                this.accordionWrap = this.obj.find(this.opts.accordionWrap);
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
            buildAccordion : function () {
                this.accordionWrap.data('global-text', this.opts.globalText);
                if (this.opts.accordionInstance == null) {
                    this.opts.accordionInstance = new HiveAccordion(this.accordionWrap, this.opts.accordionOpts);
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
                obj : '.cp-change-region'
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
                    new win.g2.changeRegion.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
