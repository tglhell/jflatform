(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.awardLogoText = global.g2.awardLogoText || {};
    global.g2.awardLogoText.Component = factory();
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
                carouselOpts : {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    breakpoints: {
                        768: {
                            slidesPerView: 3,
                            slidesPerGroup: 1
                        }
                    }
                },
                carouselWrap : '.cp-award__inner',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
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
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.carouselPrevBtn = this.carouselContainer.find('.swiper-button-prev');
                this.carouselNextBtn = this.carouselContainer.find('.swiper-button-next');
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.obj, this.opts.carouselOpts);
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
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
                obj : '.cp-award'
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
                    new win.g2.awardLogoText.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
