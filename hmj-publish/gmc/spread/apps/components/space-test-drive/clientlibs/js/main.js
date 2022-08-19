(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.spaceTestDrive = global.g2.spaceTestDrive || {};
    global.g2.spaceTestDrive.Component = factory();
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
                tabContent : '.space-drive__content',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildItem();
            },
            setElements : function () {
                this.tabContent = this.obj.find(this.opts.tabContent);
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
                        }, this),
                        build : $.proxy(function () {
                            for (var i = 0, max = this.tabContent.length; i < max; i++) {
                                this.items.instance.push(new Item(this.tabContent.eq(i)));
                            }
                        }, this)
                    }
                });
                this.items.build();
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Item (container, args) {
            var defParams = {
                isActive : false,
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselOpts : {
                    initialSlide : 0,
                    slidesPerView: 1,
                    spaceBetween: 0,
                    breakpoints : {
                        768 : {
                            slidesPerView: 3,
                            spaceBetween : 8
                        }
                    }
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Item.prototype = {
            init : function () {
                this.buildCarousel();
                this.play();
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
                obj : '.space-drive'
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
                    new win.g2.spaceTestDrive.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
