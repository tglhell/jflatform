(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpAccordion = global.g2.cpAccordion || {};
    global.g2.cpAccordion.Component = factory();
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
                mediaWrap : '.cp-accordion__media',
                swiperWrap : '.cp-accordion__media-swiper',
                swiperSlide : '.swiper-slide',
                carouselInstance : null,
                carouselOpts : {
                    speed : 600
                },
                swiperInstance : null,
                accordionObj : '.cm-accordion',
                accordionList : '.cm-accordion-list',
                accordionBtn : '.cm-accordion-btn',
                isAccordionClick : false,
                activeClass : 'is-active',
                directionTweenOpts : {
                    smagicOpts : {
                        triggerHook : 0.7
                    },
                    tweenOpts : {
                        "SEQUENCE" : {
                            ".js-animate" : {
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
                    }
                },
                globalText : {},
                currentIndex : null,
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildVideo();
                this.buildCarousel();
                this.buildAccordion();
                this.buildTween();
                this.bindEvents(true);
            },
            setElements : function () {
                this.mediaWrap = this.obj.find(this.opts.mediaWrap);
                this.swiperWrap = this.obj.find(this.opts.swiperWrap);
                this.swiperSlide = this.swiperWrap.find(this.opts.swiperSlide);
                this.accordionObj = this.obj.find(this.opts.accordionObj);
                this.accordionList = this.accordionObj.find(this.opts.accordionList);
                this.accordionItems = this.accordionList.children();
                this.accordionBtn = this.accordionItems.find(this.opts.accordionBtn);
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
            },
            buildVideo : function () {
                Util.def(this, {
                    cmvideo : {
                        instance : [],
                        play : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == isUndefined) return;
                            this.cmvideo.instance[index].play();
                        }, this),
                        pauseAll : $.proxy(function (not_index) {
                            for (var min = 0, max = this.cmvideo.instance.length; min < max; min++) {
                                var instance = this.cmvideo.instance[min];
                                if (instance != null) {
                                    if (min != not_index) {
                                        this.cmvideo.pause(min);
                                    }
                                }
                            }
                        }, this),
                        pause : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == null) return;
                            this.cmvideo.instance[index].pause();
                            this.cmvideo.instance[index].setTime(0);
                        }, this),
                        build : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == isUndefined) {
                                var panelItem = this.swiperSlide.eq(index),
                                    panelMedia = panelItem.find('.video-container');
                                if (panelMedia.length) {
                                    this.cmvideo.instance[index] = new HiveVideo(panelMedia);
                                    new HiveVideoScroll(panelMedia);
                                }
                            }
                        }, this)
                    }
                });
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselOpts.initialSlide = this.opts.currentIndex;
                    this.opts.carouselInstance = new HiveSwiper(this.swiperWrap, this.opts.carouselOpts);
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.opts.swiperInstance.on('transitionStart', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        if (!this.opts.isAccordionClick) {
                            this.syncAccordion();
                        }
                    }, this));
                    this.opts.swiperInstance.on('transitionEnd', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.cmvideo.build(index);
                        this.opts.isAccordionClick = false;
                        this.opts.currentIndex = index;
                    }, this));
                    this.cmvideo.build(this.opts.swiperInstance.realIndex);
                }
            },
            slideTo : function (index, speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.slideTo(index, speed);
            },
            buildAccordion : function () {
                this.accordionObj.data('global-text', this.opts.globalText);
                new HiveAccordion(this.accordionObj);
            },
            buildTween : function () {
                new DirectionTween(this.obj, this.opts.directionTweenOpts);
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
                    this.accordionBtn.on(this.changeEvents('click'), $.proxy(this.accordionBtnClick, this));
                } else {
                    this.accordionBtn.off(this.changeEvents('click'));
                }
            },
            accordionBtnClick : function (e) {
                var _target = $(e.currentTarget),
                    _index = this.accordionBtn.index(_target);
                this.opts.isAccordionClick = true;
                this.slideTo(_index);
            },
            syncAccordion : function () {
                var activeIndex = this.opts.swiperInstance.activeIndex;
                this.accordionItems.eq(activeIndex).find(this.opts.accordionBtn).trigger('clickCustom');
            },
            outCallback : function (ing) {
                var callbackObj = this.opts[ing];
                if (callbackObj == null) return;
                callbackObj();
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
    global = global;
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
                obj : '.cp-accordion'
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
                    new win.g2.cpAccordion.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
