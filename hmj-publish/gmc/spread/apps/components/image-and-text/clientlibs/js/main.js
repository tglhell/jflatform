(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpImgAndTxt = global.g2.cpImgAndTxt || {};
    global.g2.cpImgAndTxt.Component = factory();
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
                txtItemList : '.cp-image-text__item-list',
                txtItem : '.cp-image-text__item'
            }; 
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildAnimation();
            },
            setElements : function () {
                this.txtItemList = this.obj.find(this.opts.txtItemList);
                this.txtItems = this.txtItemList.find(this.opts.txtItem);
            },
            buildAnimation : function () {
                for (var i = 0, max = this.txtItems.length; i < max; i++) {
                    new ViewAnimation(this.txtItems.eq(i));
                }
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function ViewAnimation (container, args) {
            if (!(this instanceof ViewAnimation)) {
                return new ViewAnimation(container, args);
            }
            var defParams = {
                itemInner : '.cp-image-text__item-inner',
                txtWrap : '.cp-image-text__text',
                directionTweenOpts : {
                    smagicOpts : {
                        triggerHook : 0.9
                    },
                    tweenOpts : {
                        "SEQUENCE" : {
                            ".js-animate" : {
                                "SET" : {
                                    "opacity" : 0,
                                    "y" : 50
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
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        ViewAnimation.prototype = {
            init : function () {
                this.setElements();
                this.buildTween();
            },
            setElements : function () {
                this.itemInner = this.obj.find(this.opts.itemInner);
                this.txtWrap = this.itemInner.find(this.opts.txtWrap);
            },
            buildTween : function () {
                new DirectionTween(this.txtWrap, this.opts.directionTweenOpts);
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
                obj : '.cp-image-text'
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
                    new win.g2.cpImgAndTxt.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
