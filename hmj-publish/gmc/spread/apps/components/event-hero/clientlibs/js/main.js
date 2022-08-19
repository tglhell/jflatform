// Event KV
(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.eventCarousel = global.g2.eventCarousel || {};
    global.g2.eventCarousel.Component = factory();
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
                carouselWrap : '.cp-event-hero__swiper',
                newOpts : {
                    loop : true,
                    spped : 500
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            }; 
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildCarousel();
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
            },
            buildCarousel : function () {
                this.carouselObj = new HiveSwiper(this.carouselWrap, this.opts.newOpts);
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
                obj : '.cp-event-hero'
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
                    new win.g2.eventCarousel.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
