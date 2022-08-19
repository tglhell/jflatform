(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpCustomerFAQCategory = global.g2.cpCustomerFAQCategory || {};
    global.g2.cpCustomerFAQCategory.Component = factory();
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
                tabArea : '.customer-faq__tab',
                tabInner : '.customer-faq__tab-inner',
                tabList : '.customer-faq__tab-list',
                tabItem : '.customer-faq__tab-item',
                tabSelectBtn : '.faq-select-btn',
                carouselInstance : null,
                swiperInstance : null,
                carouselOpts : {
                    slidesPerView : 4,
                    speed : 350,
                    breakpoints : {
                        1024 : {
                            slidesPerView : 6
                        }
                    }
                },
                globalText : {},
                currentIndex : null,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                classAttr : {
                    opened : 'is-opened',
                    selected : 'is-selected'
                },
                activeAttr : {
                    moOpen : false
                },
                sizeAttr : {
                    swiper : null
                },
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildHeightMatch();
                this.resizeFunc();
                this.bindEvents(true);
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.tabArea = this.obj.find(this.opts.tabArea);
                this.tabInner = this.tabArea.find(this.opts.tabInner);
                this.tabList = this.tabInner.find(this.opts.tabList);
                this.tabItem = this.tabList.find(this.opts.tabItem);
                this.tabSelectBtn = this.tabInner.find(this.opts.tabSelectBtn);
            },
            initOpts : function () {
                // globalText
                var globalText = this.obj.data('global-text');
                if (globalText !== isUndefined) {
                    for (var gKey in globalText) {
                        var gText = $.trim(globalText[gKey]);
                        this.opts.globalText[gKey] = gText.length ? gText : gKey;
                    }
                }
                var selectItem = this.tabItem.filter('.'+this.opts.classAttr.selected),
                    selectIndex = selectItem.length ? selectItem.index() : 0;
                this.opts.carouselOpts.initialSlide = selectIndex;
                this.opts.currentIndex = selectIndex;
            },
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.faq-tab__text'],
                        matchCommonOpts : {
                            column : this.tabItem.length,
                            childElement : '>'+this.opts.tabItem,
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
                                    for (var j = 0, jmax = _this.tabItem.length; j < jmax; j++) {
                                        var listTarget = _this.tabItem.eq(j),
                                            usedJsClass = listTarget.find('.' + sJsClass);
                                        if (!usedJsClass.length) {
                                            listTarget.find(sTarget).wrapInner('<div class="' + sJsClass + '"/>');
                                        }
                                    }
                                })(i);
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
                                    _this.heightmatch.instance.push(new HeightMatch(_this.tabList, _this.heightmatch.matchCommonOpts));
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
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                    this.tabSelectBtn.on(this.changeEvents('click'), $.proxy(this.selctBtnClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.tabSelectBtn.off(this.changeEvents('click'));
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setLayout();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                if (this.winWidth < RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.sizeAttr.swiper !== RESPONSIVE.MOBILE.NAME) {
                        this.opts.sizeAttr.swiper = RESPONSIVE.MOBILE.NAME;
                        this.destroyCarousel();
                    }
                } else {
                    if (this.opts.sizeAttr.swiper !== 'OTHER') {
                        this.opts.sizeAttr.swiper = 'OTHER';
                        this.buildCarousel();
                    }
                }
            },
            selctBtnClick : function (e) {
                e.preventDefault();
                this.opts.activeAttr.moOpen = !this.opts.activeAttr.moOpen;
                if (this.opts.activeAttr.moOpen) {
                    this.tabInner.addClass(this.opts.classAttr.opened);
                    this.tabSelectBtn.attr(this.opts.ariaAttr.expanded, 'true');
                    win.setTimeout($.proxy(function () {
                        this.tabArea.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.tabSelectBtn.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.tabInner.removeClass(this.opts.classAttr.opened);
                    this.tabSelectBtn.attr(this.opts.ariaAttr.expanded, 'false');
                    this.tabArea.off('clickoutside touchendoutside keyupoutside');
                }
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.tabArea, this.opts.carouselOpts);
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.opts.swiperInstance.on('transitionStart', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                    }, this));
                    this.opts.swiperInstance.on('transitionEnd', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.opts.carouselOpts.initialSlide = index;
                        this.opts.currentIndex = index;
                    }, this));
                }
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('transitionStart transitionEnd');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            updateHeightCarousel : function (speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.updateAutoHeight(speed);
            },
            bindCallbackEvents : function () {
                this.obj.on(this.changeEvents('rerun'), $.proxy(this.rerun, this));
                this.obj.on(this.changeEvents('destroy'), $.proxy(this.destroy, this));
            },
            rerun : function () {
                this.destroy();
                this.setElements();
                this.initOpts();
                this.resizeFunc();
                this.bindEvents(true);
            },
            destroy : function () {
                this.opts.sizeAttr.swiper = null;
                this.bindEvents(false);
            },
            reInit : function () {
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
                obj : '.customer-faq'
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
                    new win.g2.cpCustomerFAQCategory.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
