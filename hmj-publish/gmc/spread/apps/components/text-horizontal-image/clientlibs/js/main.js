(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.textImage = global.g2.textImage || {};
    global.g2.textImage.Component = factory();
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
                directionTweenOpts : {
                    tweenOpts : {
                        "SET" : {
                            "opacity" : 1
                        },
                        "SEQUENCE" : {
                            ".js-animate" : {
                                "SET" : {
                                    "opacity" : 0,
                                    "y" : 100
                                },
                                "TO" : {
                                    "opacity" : 1,
                                    "y" : 0
                                },
                                "DELAY" : 0.2,
                                "DURATION" : 0.8
                            }
                        }
                    }
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.buildTween();
            },
            buildTween : function () {
                new DirectionTween(this.obj, this.opts.directionTweenOpts);
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
                obj : '.cp-text-horizontal-image'
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
                    new win.g2.textImage.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
