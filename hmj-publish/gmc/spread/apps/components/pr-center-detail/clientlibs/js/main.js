(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpPrDetail = global.g2.cpPrDetail || {};
    global.g2.cpPrDetail.Component = factory();
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
                layerObj : '.cm-layer',
                layerContent : '.cm-layer__content',
                carouselCount : '.count',
                carouselCountCurrent : '.current',
                carouselCountTotal : '.total',
                carouselWrap : '.sup-gallery-swiper',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselPrevBtn : '.swiper-button-prev',
                carouselNextBtn : '.swiper-button-next'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.buildLayerShare();
            },
            setElements : function () {
                this.layerObj = this.obj.find(this.opts.layerObj);
                this.layerContent = this.layerObj.find(this.opts.layerContent);
                this.carouselCount = this.layerContent.find(this.opts.carouselCount);
                this.carouselCountCurrent = this.carouselCount.find(this.opts.carouselCountCurrent);
                this.carouselCountTotal = this.carouselCount.find(this.opts.carouselCountTotal);
                this.carouselWrap = this.layerObj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.carouselPrevBtn = this.layerObj.find(this.opts.carouselPrevBtn);
                this.carouselNextBtn = this.layerObj.find(this.opts.carouselNextBtn);
            },
            initLayout : function () {
                this.carouselCountTotal.text(this.slides.length);
            },
            buildLayerShare : function () {
                if (!this.layerObj.length) return;
                var layerObj = this.layerObj.data('LayerSlideShare');
                layerObj.opts.on.transitionStart = $.proxy(function () {
                    this.carouselCountNum(layerObj.opts.swiperInstance.realIndex);
                    this.carouselArrowToggle(layerObj.opts.swiperInstance.realIndex);
                }, this);
                layerObj.opts.on.init = $.proxy(function () {
                    this.carouselCountNum(layerObj.opts.swiperInstance.realIndex);
                    this.carouselArrowToggle(layerObj.opts.swiperInstance.realIndex);
                }, this);
            },
            carouselCountNum : function (index) {
                this.carouselCountCurrent.text(index + 1);
            },
            carouselArrowToggle : function (index) {
                var isFirstSlide = (index === 0) ? true : false,
                    isLastSlide = (index >= this.slides.length - 1) ? true : false;
                if (this.slides.length <= 1) return;
                if (isFirstSlide) {
                    this.carouselPrevBtn.hide();
                    this.carouselNextBtn.show();
                } else if (isLastSlide) {
                    this.carouselPrevBtn.show();
                    this.carouselNextBtn.hide();
                } else {
                    this.carouselPrevBtn.show();
                    this.carouselNextBtn.show();
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
                obj : '.cp-pr-detail'
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
                    new win.g2.cpPrDetail.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
