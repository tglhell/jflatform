(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cardListLayer = global.g2.cardListLayer || {};
    global.g2.cardListLayer.Component = factory();
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
                carouselInstance : null,
                swiperInstance : null,
                carouselWrap : '.card-image__visual',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.bindCallBackEvents();
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
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
                this.obj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.obj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
            },
            openBeforeFunc : function () {
                this.obj.css({
                    'opacity' : 0,
                    'display' : 'block'
                });
                this.buildCarousel();
            },
            closeAfterFunc : function () {
                this.destroyCarousel();
            },
            buildCarousel : function () {
                if (this.carouselWrap.length && this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.carouselWrap);
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.buildCarouselImg();
                }
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.destroy(true, true);
                this.opts.carouselInstance = null;
                this.opts.swiperInstance = null;
            },
            updateCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.update();
            },
            buildCarouselImg : function () {
                Util.imgLoaded(this.carouselWrap).done($.proxy(function () {
                    win.setTimeout($.proxy(function () {
                        this.updateCarousel();
                    }, this), 70);
                }, this));
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
                obj : '.card-list-popup'
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
                    new win.g2.cardListLayer.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
