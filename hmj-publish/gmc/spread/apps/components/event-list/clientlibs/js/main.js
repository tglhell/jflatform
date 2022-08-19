(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.supportEventList = global.g2.supportEventList || {};
    global.g2.supportEventList.Component = factory();
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
                animateList : '.cp-event-list__list',
                animateChild : '.cp-event-list__box',
                animateItem : '.js-animate',
                tweenOptsDelay : 0.2,
                directionTweenOpts : {
                    smagicOpts : {
                        "triggerHook" : 0.9
                    },
                    tweenOpts : {
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
            }; 
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildTween();
            },
            setElements : function () {
                this.animateList = this.obj.find(this.opts.animateList);
                this.animateChilds = this.animateList.find(this.opts.animateChild);
                this.animateItems = this.animateChilds.find(this.opts.animateItem);
            },
            initTweenOpts : function () {
                var tweenProps = {};
                for (var aMin = 0, aMax = this.animateItems.length; aMin < aMax; aMin++) {
                    var item = this.animateItems.eq(aMin),
                        itemOffset = item.offset(),
                        itemLeft = itemOffset.left,
                        itemTop = itemOffset.top;
                    if (!tweenProps.hasOwnProperty(itemTop)) {
                        tweenProps[itemTop] = {};
                    }
                    tweenProps[itemTop][itemLeft] = {
                        'ITEM' : item
                    };
                }
                return tweenProps;
            },
            buildTween : function () {
                var tweenProps = this.initTweenOpts(),
                    tweenOptsDelay = this.opts.tweenOptsDelay;
                for (var key in tweenProps) {
                    var tweenProp = tweenProps[key],
                        rank = 1;
                    for (var iKey in tweenProp) {
                        var prop = tweenProp[iKey];
                        this.opts.directionTweenOpts['tweenOpts']['DELAY'] = tweenOptsDelay * rank;
                        new DirectionTween(prop['ITEM'], this.opts.directionTweenOpts);
                        rank++;
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
                obj : '.cp-event-list'
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
                    new win.g2.supportEventList.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
