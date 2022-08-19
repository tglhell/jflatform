(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.colorPickers = global.g2.colorPickers || {};
    global.g2.colorPickers.Component = factory();
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
                jsTab : '.js-tab',
                cmBtnSwiper : '.cp-swiper-tab-area',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildTab();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.jsTab = this.obj.find(this.opts.jsTab);
                this.cmBtnSwiper = this.obj.find(this.opts.cmBtnSwiper);
            },
            buildTab : function () {
                Util.def(this, {
                    ctab : {
                        instance : [],
                        build : $.proxy(function () {
                            for (var i = 0, max = this.cmBtnSwiper.length; i < max; i++) {
                                var instance = new Tab(this.cmBtnSwiper.eq(i));
                                this.ctab.instance.push(instance);
                            }
                        }, this)
                    }
                });
                this.ctab.build();
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindCallbackEvents : function () {
                this.jsTab.on('reposition', $.proxy(this.tabReposition, this));
            },
            tabReposition : function (e) {
                var target = $(e.currentTarget);
                target.find(this.opts.cmBtnSwiper).trigger('rerun');
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Tab (container, args) {
            var defParams = {
                tabBtn : '.tab-btn',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselInstance : null,
                swiperInstance : null,
                carouselOpts : {
                    autoHeight : false,
                    slidesPerView: 'auto',
                    slidesPerGroup: 1
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Tab.prototype = {
            init : function () {
                this.setElements();
                this.buildCarousel();
                this.bindEvents(true);
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.tabBtns = this.obj.find(this.opts.tabBtn);
                this.carouselContainer = this.obj.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselOpts['breakpoints'] = {
                        768 : {
                            slidesPerView : this.slides.length,
                            slidesPerGroup : this.slides.length
                        }
                    };
                    this.opts.carouselInstance = new HiveSwiper(this.obj, this.opts.carouselOpts);
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                }
            },
            updateCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.update();
            },
            carouselAutoFocus : function (type) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.controlAutoFocus(type);
            },
            slideTo : function (index, speed) {
                if (this.opts.carouselInstance == null) return;
                var speedTime = speed;
                this.opts.swiperInstance.slideTo(index, speed);
                if (speed == isUndefined) {
                    speedTime = this.opts.swiperInstance.params.speed;
                }
                win.setTimeout($.proxy(function () {
                    this.carouselAutoFocus(true);
                }, this), speedTime);
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
                    this.tabBtns.on(this.changeEvents('touchstart mousedown'), $.proxy(this.openerInFocus, this));
                    this.tabBtns.on(this.changeEvents('click'), $.proxy(this.cmTabBtnsClick, this));
                } else {
                    this.tabBtns.off(this.changeEvents('touchstart mousedown'));
                    this.tabBtns.off(this.changeEvents('click'));
                }
            },
            bindCallbackEvents : function () {
                this.obj.on('rerun', $.proxy(this.rerun, this));
            },
            openerInFocus : function () {
                this.carouselAutoFocus(false);
            },
            cmTabBtnsClick : function (e) {
                var _target = $(e.currentTarget),
                    _index = this.tabBtns.index(_target);
                this.slideTo(_index);
            },
            rerun : function (e) {
                e.stopPropagation();
                this.updateCarousel();
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
                obj : '.cp-color-picker'
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
                    new win.g2.colorPickers.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
