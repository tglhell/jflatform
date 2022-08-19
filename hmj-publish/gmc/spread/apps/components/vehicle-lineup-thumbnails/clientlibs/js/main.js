(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.vehicleLineupThumb = global.g2.vehicleLineupThumb || {};
    global.g2.vehicleLineupThumb.Component = factory();
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
                    loop : true,
                    breakpoints: {
                        1023: {
                            slidesPerView: 4,
                            loop : false
                        },
                        768: {
                            slidesPerView: 3,
                            loop : false
                        }
                    }
                },
                carouselWrap : '.cp-lineup-thumb__tab-swiper',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                tabItem : '.cp-lineup-thumb__tab-item',
                sizeAttr : {
                    swiper : null
                },
                classAttr : {
                    hover : 'is-hover'
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
                this.buildCarouselCommon();
                this.buildHeightMatch();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.carouselPrevBtn = this.carouselContainer.find('.swiper-button-prev');
                this.carouselNextBtn = this.carouselContainer.find('.swiper-button-next');
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.tabItem = this.slides.find(this.opts.tabItem);
            },
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.cp-lineup-thumb__tab-title', '.cp-lineup-thumb__tab-item-inner'],
                        matchCommonOpts : {
                            column : this.slides.length,
                            childElement : '>'+this.opts.carouselItem,
                            breakpoints : {
                                767 : {
                                    column : 1
                                }
                            },
                            matchAfter : $.proxy(function () {
                                this.updateHeightCarousel();
                            }, this)
                        },
                        initLayout : $.proxy(function () {
                            var _this = this;
                            for (var i = 0, max = this.heightmatch.matchElements.length; i < max; i++) {
                                (function (index) {
                                    var sTarget = _this.heightmatch.matchElements[index],
                                        sJsClass = 'js-' + sTarget.split('.')[1];
                                    for (var j = 0, jmax = _this.slides.length; j < jmax; j++) {
                                        var listTarget = _this.slides.eq(j),
                                            usedJsClass = listTarget.find('.' + sJsClass);
                                        if (!usedJsClass.length) {
                                            listTarget.find(sTarget).wrapInner('<div class="' + sJsClass + '"/>');
                                        }
                                    }
                                })(i);
                            }
                        }, this),
                        refresh : $.proxy(function () {
                            var _this = this;
                            if (this.opts.sizeAttr.swiper === 'OTHER') {
                                for (var i = 0, max = this.heightmatch.matchElements.length; i < max; i++) {
                                    (function (index) {
                                        var sTarget = _this.heightmatch.matchElements[index];
                                        for (var j = 0, jmax = _this.slides.length; j < jmax; j++) {
                                            var listTarget = _this.slides.eq(j),
                                                cTarget = listTarget.find(sTarget);
                                            if (cTarget.length) {
                                                cTarget.css('height', '');
                                            }
                                        }
                                    })(i);
                                }
                            }
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.heightmatch.comOpts == null) return;
                            for (var min = 0, max = this.heightmatch.comOpts.length; min < max; min++) {
                                var matchOpt = this.heightmatch.comOpts[min];
                                matchOpt.destroy();
                            }
                        }, this),
                        build : $.proxy(function () {
                            var _this = this;
                            this.heightmatch.initLayout();
                            for (var i = 0, max = this.heightmatch.matchElements.length; i < max; i++) {
                                (function (index) {
                                    var sTarget = _this.heightmatch.matchElements[index],
                                        personOpts = {
                                            matchElement : '.js-' + sTarget.split('.')[1],
                                            pushElement : sTarget
                                        };
                                    Util.def(_this.heightmatch.matchCommonOpts, personOpts);
                                    _this.heightmatch.instance.push(new HeightMatch(_this.carouselWrapper, _this.heightmatch.matchCommonOpts));
                                })(i);
                            }
                        }, this)
                    }
                });
                this.heightmatch.build();
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
                    this.tabItem.on(this.changeEvents('mouseenter mouseleave focusin'), $.proxy(this.onHoverFunc, this));
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    this.tabItem.off(this.changeEvents('mouseenter'));
                    $(win).off(this.changeEvents('resize orientationchange'));
                }
            },
            onHoverFunc : function (e) {
                e.stopPropagation();
                var _target = $(e.currentTarget);
                var hoverClass = this.opts.classAttr.hover;
                if (e.type === 'mouseenter' || e.type === 'focusin') {
                    if (_target.hasClass(hoverClass)) return;
                    _target.addClass(hoverClass);
                    win.setTimeout($.proxy(function () {
                        _target.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            _target.trigger('mouseleave');
                        }, this));
                    }, this), 30);
                } else if (e.type === 'mouseleave') {
                    _target.off('clickoutside touchendoutside keyupoutside');
                    if (!_target.hasClass(hoverClass)) return;
                    _target.removeClass(hoverClass);
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 50);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                if (this.winWidth > RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.sizeAttr.swiper !== RESPONSIVE.TABLET3.WIDTH) {
                        this.opts.sizeAttr.swiper = RESPONSIVE.TABLET3.WIDTH;
                        this.refreshCarousel();
                    }
                } else if (this.winWidth >= RESPONSIVE.MOBILE.WIDTH && this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.sizeAttr.swiper !== RESPONSIVE.MOBILE.WIDTH) {
                        this.opts.sizeAttr.swiper = RESPONSIVE.MOBILE.WIDTH;
                        this.refreshCarousel();
                    }
                } else {
                    if (this.opts.sizeAttr.swiper !== 'OTHER') {
                        this.opts.sizeAttr.swiper = 'OTHER';
                        this.heightmatch.refresh();
                        this.refreshCarousel();
                    }
                }
            },
            buildCarouselCommon : function () {
                Util.def(this, {
                    carousel : {
                        instance : null,
                        updateAutoHeight : $.proxy(function (speed) {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.updateAutoHeight(speed);
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.destroy(true, true);
                            this.carousel.instance = null;
                        }, this)
                    }
                })
            },
            refreshCarousel : function () {
                var swiperSize = this.opts.sizeAttr.swiper;
                var carouselOpts = Util.def({}, this.opts.carouselOpts);
                var breakpointsOpts = carouselOpts.breakpoints;
                delete carouselOpts.breakpoints;
                if (swiperSize == 'OTHER') {
                    var customOpts = carouselOpts;
                } else {
                    var customOpts = Util.def(carouselOpts, breakpointsOpts[swiperSize]);
                }
                this.destroyCarousel();
                this.buildCarousel(customOpts);
            },
            buildCarousel : function (carouselOpts) {
                if (this.carousel.instance == null) {
                    this.carousel.instance = new HiveSwiper(this.obj, carouselOpts);
                }
            },
            destroyCarousel : function () {
                this.carousel.destroy();
            },
            updateHeightCarousel : function (speed) {
                this.carousel.updateAutoHeight(speed);
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
                obj : '.cp-lineup-thumb'
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
                    new win.g2.vehicleLineupThumb.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
