(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.spaceVehicle = global.g2.spaceVehicle || {};
    global.g2.spaceVehicle.Component = factory();
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
                contents : '.cp-space-vehicles__content',
                jsTab : '.js-tab',
                cmBtnSwiper : '.cp-swiper-tab-area',
                tabContent : '.cm-tab-content',
                tabItem : '.cm-tab-item',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildHiveTab();
                this.buildTab();
                this.buildItem();
                this.bindCallbackEvents();
                this.loadComponent();
            },
            setElements : function () {
                this.contents = this.obj.find(this.opts.contents);
                this.jsTab = this.contents.find(this.opts.jsTab);
                this.cmBtnSwiper = this.obj.find(this.opts.cmBtnSwiper);
                this.tabContent = this.obj.find(this.opts.tabContent);
                this.tabItems = this.tabContent.find(this.opts.tabItem);
            },
            buildHiveTab : function () {
                Util.def(this, {
                    hivetab : {
                        instance : null
                    }
                });
                this.hivetab.instance = this.jsTab.data('HiveTab');
            },
            buildTab : function () {
                new Tab(this.cmBtnSwiper);
            },
            buildItem : function () {
                Util.def(this, {
                    items : {
                        instance : [],
                        allHide : $.proxy(function () {
                            for (var i = 0, max = this.items.instance.length; i < max; i++) {
                                var instance = this.items.instance[i];
                                if (instance.opts.isActive) {
                                    instance.kill();
                                }
                            }
                        }, this),
                        play : $.proxy(function (num) {
                            this.items.allHide();
                            this.items.instance[num].play();
                        }, this)
                    }
                });
                for (var i = 0, max = this.tabItems.length; i < max; i++) {
                    this.items.instance.push(new Item(this.tabItems.eq(i)));
                }
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
                this.jsTab.on(this.changeEvents('hiveTabStart'), $.proxy(this.tabStart, this));
            },
            tabStart : function () {
                var instance = this.hivetab.instance;
                var index = instance.opts.currentIndex;
                this.tabItems.eq(index).css({
                    'display' : 'block',
                    'opacity' : 0
                });
                this.items.play(index);
            },
            loadComponent : function () {
                this.items.play(this.hivetab.instance.opts.currentIndex);
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
            openerInFocus : function () {
                this.carouselAutoFocus(false);
            },
            cmTabBtnsClick : function (e) {
                var _target = $(e.currentTarget),
                    _index = this.tabBtns.index(_target);
                this.slideTo(_index);
            }
        };

        function Item (container, args) {
            var defParams = {
                tabBtn : '.tab-btn',
                isActive : false,
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselOpts : {
                    initialSlide : 0,
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 0,
                    breakpoints : {
                        1920 : {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween : 140
                        },
                        1600 : {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween : 100
                        },
                        1360 : {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween : 90
                        },
                        1024 : {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween : 64
                        },
                        768 : {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween : 47
                        },
                        375 : {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                            spaceBetween : 30
                        }
                    }
                },
                cmClass : '.component-class',
                cmAccordion : '.cm-accordion',
                accordionOpts : {},
                globalText : {},
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Item.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildCarousel();
                this.buildAccordion();
            },
            setElements : function () {
                this.cmClass = this.obj.find(this.opts.cmClass);
                this.cmAccordion = this.obj.find(this.opts.cmAccordion);
            },
            initOpts : function () {
                // globalText
                var globalText = this.cmClass.eq(0).data('global-text');
                if (globalText !== isUndefined) {
                    for (var gKey in globalText) {
                        var gText = $.trim(globalText[gKey]);
                        this.opts.globalText[gKey] = gText.length ? gText : gKey;
                    }
                }
            },
            buildCarousel : function () {
                Util.def(this, {
                    carousel : {
                        instance : null,
                        currentIndex : null,
                        swiperinstance : null,
                        updateAutoHeight : $.proxy(function (speed) {
                            if (this.carousel.instance == null) return;
                            this.carousel.swiperinstance.updateAutoHeight(speed);
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.swiperinstance.off('transitionStart transitionEnd');
                            this.carousel.instance.destroy(true, true);
                            this.carousel.instance = null;
                            this.carousel.swiperinstance = null;
                        }, this),
                        build : $.proxy(function () {
                            this.carousel.instance = new HiveSwiper(this.obj, this.opts.carouselOpts);
                            this.carousel.swiperinstance = this.carousel.instance.carousel;
                            this.carousel.swiperinstance.on('transitionStart', $.proxy(function () {
                                var index = this.carousel.swiperinstance.realIndex;
                                if (this.carousel.currentIndex == index) return;
                            }, this));
                            this.carousel.swiperinstance.on('transitionEnd', $.proxy(function () {
                                var index = this.carousel.swiperinstance.realIndex;
                                if (this.carousel.currentIndex == index) return;
                                this.opts.carouselOpts.initialSlide = index;
                                this.carousel.currentIndex = index;
                            }, this));
                        }, this)
                    }
                })
            },
            buildAccordion : function () {
                Util.def(this, {
                    accordion : {
                        instance : [],
                        build : $.proxy(function () {
                            this.opts.accordionOpts.on = {
                                accordionCloseAfter : $.proxy(function () {
                                    this.carousel.updateAutoHeight(250);
                                }, this),
                                accordionOpenAfter : $.proxy(function () {
                                    this.carousel.updateAutoHeight(250);
                                }, this)
                            };
                            for (var i = 0, max = this.cmAccordion.length; i < max; i++) {
                                var cmAccordion = this.cmAccordion.eq(i);
                                cmAccordion.data('global-text', this.opts.globalText);
                                this.accordion.instance.push(new HiveAccordion(cmAccordion, this.opts.accordionOpts));
                            }
                        }, this)
                    }
                });
                this.accordion.build();
            },
            play : function () {
                this.opts.isActive = true;
                this.carousel.build();
            },
            kill : function () {
                this.opts.isActive = false;
                this.carousel.destroy();
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
                obj : '.cp-space-vehicles'
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
                    new win.g2.spaceVehicle.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
