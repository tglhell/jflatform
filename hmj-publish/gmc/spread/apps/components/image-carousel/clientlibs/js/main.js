(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpFeatureCarousel = global.g2.cpFeatureCarousel || {};
    global.g2.cpFeatureCarousel.Component = factory();
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
                    initialSlide : 0
                },
                bgWrap : '.slide-bg',
                carouselWrap : '.cp-feature-carousel__wrap',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselImg : '.slide-image',
                foldTxtWrap : '.fold-text-wrap',
                foldInner : '.fold-text-inner',
                carouselWrapperTransitionClass : 'is-transition',
                swiperInstance : null,
                currentIndex : null,
                shareObj : '.js-share',
                layerInstance : null,
                layerObj : '#cp-feature-carousel',
                layerObjActiveClass : 'is-active',
                classAttr : {
                    opened : 'is-opened',
                    hasDescription : 'has-description'
                },
                globalText : {},
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                viewType : null,
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
                // this.buildLayer();
                this.buildFoldTxt();
                this.buildShare();
                this.buildCarousel();
                this.controlBg();
                this.controlDescription();
                this.resizeFunc();
                this.bindEvents(true);
                this.bindCallBackEvents();
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.bgWrap = this.obj.find(this.opts.bgWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.foldTxtWrap = this.slides.find(this.opts.foldTxtWrap);
                this.shareObj = this.obj.find(this.opts.shareObj);
                this.layerObj = $(this.opts.layerObj);
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
            buildLayer : function () {
                this.opts.layerInstance = new HiveLayer(this.layerObj);
                this.opts.layerInstance.closerObj.on(this.changeEvents('click'), $.proxy(function (e) {
                    var _target = $(e.currentTarget),
                        _swiperIndex = _target.data('swiper-index') !== isUndefined ? _target.data('swiper-index') : null;
                    if (_swiperIndex !== null) {
                        this.slideToLoop(_swiperIndex, 0);
                    }
                }, this));
            },
            buildFoldTxt : function () {
                Util.def(this, {
                    foldtxt : {
                        instance : [],
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.foldtxt.instance.length; min < max; min++) {
                                this.foldtxt.instance[min].kill();
                            }
                            this.foldtxt.instance = [];
                        }, this),
                        build : $.proxy(function () {
                            var build = $.proxy(function (obj, min) {
                                var instance = new FoldTxt(obj, {
                                    on : {
                                        active : $.proxy(function () {
                                            var duration = 200;
                                            this.updateAutoHeight(duration);
                                        }, this),
                                        deactive : $.proxy(function () {
                                            var duration = 200;
                                            this.updateAutoHeight(duration);
                                        }, this)
                                    }
                                });
                                this.foldtxt.instance.push(instance);
                            }, this);
                            for (var min = 0, max = this.foldTxtWrap.length; min < max; min++) {
                                var obj = this.foldTxtWrap.eq(min);
                                build(obj, min);
                            }
                        }, this)
                    }
                });
                this.foldtxt.build();
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.obj.data('global-text', this.opts.globalText);
                    this.opts.carouselInstance = new HiveSwiper(this.obj, this.opts.carouselOpts);
                    this.opts.currentIndex = this.opts.carouselOpts.initialSlide;
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.opts.swiperInstance.on('transitionStart', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.share.all.sync(index);
                        this.carouselWrapper.addClass(this.opts.carouselWrapperTransitionClass);
                    }, this));
                    this.opts.swiperInstance.on('transitionEnd', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.controlBg();
                        this.controlDescription();
                        this.carouselWrapper.removeClass(this.opts.carouselWrapperTransitionClass);
                        this.opts.currentIndex = index;
                    }, this));
                }
            },
            updateAutoHeight : function (speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.updateAutoHeight(speed);
            },
            slideToLoop : function (index, speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.slideToLoop(index, speed);
            },
            stopFunction : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.stopFunction();
            },
            playFunction : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.playFunction();
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('transitionStart transitionEnd');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            controlBg : function () {
                if (this.opts.swiperInstance == null) return;
                var index = this.opts.swiperInstance.realIndex,
                    slides = this.slides,
                    activeEl = slides.eq(index),
                    activeElSrc = activeEl.find(this.opts.carouselImg).css('background-image');
                this.bgWrap.css('background-image', activeElSrc);
            },
            controlDescription : function () {
                if (this.opts.swiperInstance == null) return;
                var index = this.opts.swiperInstance.realIndex,
                    slides = this.slides,
                    activeEl = slides.eq(index),
                    activeElDesc = activeEl.find(this.opts.foldInner);
                if (activeElDesc.length) {
                    this.carouselContainer.addClass(this.opts.classAttr.hasDescription);
                } else {
                    this.carouselContainer.removeClass(this.opts.classAttr.hasDescription);
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
            bindEvents : function (type) {
                if (type) {
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
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
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                if (this.winWidth < RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.viewType !== RESPONSIVE.MOBILE.NAME) {
                        this.opts.viewType = RESPONSIVE.MOBILE.NAME;
                        this.share.all.sync(this.opts.currentIndex);
                    }
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                        this.share.all.sync(this.opts.currentIndex);
                    }
                }
            },
            bindCallBackEvents : function () {
                this.layerObj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.layerObj.on(this.changeEvents('layerCloseBefore'), $.proxy(this.closeBeforeFunc, this));
                this.layerObj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
            },
            openBeforeFunc : function (e, data) {
                if (data) {
                    if (data.opts.openerTarget == null) {
                        this.openerTarget = null;
                    } else {
                        this.openerTarget = $(data.opts.openerTarget[0]);
                    }
                }
                this.stopFunction();
                win.setTimeout($.proxy(function () {
                    this.layerObj.addClass(this.opts.layerObjActiveClass);
                }, this), 30);
            },
            closeBeforeFunc : function () {
                this.playFunction();
            },
            closeAfterFunc : function () {
                this.layerObj.removeClass(this.opts.layerObjActiveClass);
            },
            controlSwiping : function (type) {
                this.carouselContainer.toggleClass('swiper-no-swiping', !type);
            },
            buildShare : function () {
                Util.def(this, {
                    share : {
                        downloadurls : {},
                        active : $.proxy(function () {
                            this.share.all.open();
                            this.stopFunction();
                            this.controlSwiping(false);
                        }, this),
                        deactive : $.proxy(function () {
                            this.share.all.close();
                            this.playFunction();
                            this.controlSwiping(true);
                        }, this),
                        close : $.proxy(function () {
                            this.share.deactive();
                        }, this),
                        closeAll : $.proxy(function () {
                            this.share.all.close();
                            this.controlSwiping(true);
                        }, this)
                    }
                });
                this.buildShareData();
            },
            buildShareData : function () {
                var buildShare = $.proxy(function (shareObj) {
                    var prop = {
                        instance : null,
                        isActive : false,
                        open : $.proxy(function () {
                            if (prop.instance == null) return;
                            if (prop.isActive) return;
                            prop.isActive = true;
                            prop.instance.open();
                        }, this),
                        close : $.proxy(function () {
                            if (prop.instance == null) return;
                            if (!prop.isActive) return;
                            prop.isActive = false;
                            prop.instance.close();
                        }, this)
                    };
                    if (prop.instance == null && shareObj.length) {
                        prop.instance = shareObj.data('ShareLayer');
                        prop.instance.opts.on = {
                            active : $.proxy(function () {
                                prop.isActive = true;
                                this.share.active(this.opts.currentIndex);
                            }, this),
                            deactive : $.proxy(function () {
                                prop.isActive = false;
                                this.share.deactive(this.opts.currentIndex);
                            }, this)
                        };
                    }
                    return prop;
                }, this);

                for (var min = 0, max = this.slides.length; min < max; min++) {
                    var slide = this.slides.eq(min),
                        slideImg = slide.find(this.opts.carouselImg);
                    this.share.downloadurls[min] = {
                        'PC' : slideImg.eq(0).attr('data-download-url'),
                        'MO' : slideImg.eq(1).attr('data-download-url')
                    };
                }

                // all
                var shareObj = this.shareObj;
                Util.def(this, {
                    share : {
                        all : buildShare(shareObj)
                    }
                });
                this.share.all.sync = $.proxy(function (num) {
                    var downloadEl = shareObj.find('[data-icon="svg-download"]').closest('.share-item-link'),
                        responsive = this.opts.viewType == 'mobile' ? 'MO' : 'PC';
                    downloadEl.attr('href', this.share.downloadurls[num][responsive]);
                }, this);
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function FoldTxt (container, args) {
            var defParams = {
                obj : container,
                foldInner : '.fold-text-inner',
                foldInnerBtn : '.fold-text-btn',
                foldDescWrap : '.fold-desc-wrap',
                foldDescInner : '.fold-desc-inner',
                classAttr : {
                    opened : 'is-opened'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                isFoldActive : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null,
                on : {
                    active : null,
                    deactive : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        FoldTxt.prototype = {
            init : function () {
                this.setElements();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.foldInner = this.obj.find(this.opts.foldInner);
                this.foldInnerBtn = this.obj.find(this.opts.foldInnerBtn);
                this.foldDescWrap = this.obj.find(this.opts.foldDescWrap);
                this.foldDescInner = this.foldDescWrap.find(this.opts.foldDescInner);
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
                    this.foldInnerBtn.on(this.changeEvents('click'), $.proxy(this.foldInnerBtnClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.foldInnerBtn.off(this.changeEvents('click'));
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
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                if (this.opts.isFoldActive) {
                    this.foldLayout(true, 0);
                }
            },
            foldInnerBtnClick : function (e) {
                e.preventDefault();
                var _targetBtn = $(e.currentTarget);
                this.opts.isFoldActive = !this.opts.isFoldActive;
                this.foldView(_targetBtn);
                this.foldLayout(this.opts.isFoldActive);
            },
            foldView : function (targetBtn) {
                this.foldInner.toggleClass(this.opts.classAttr.opened, this.opts.isFoldActive);
                if (this.foldInner.hasClass(this.opts.classAttr.opened)) {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'true');
                } else {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'false');
                }
            },
            foldLayout : function (type, speed) {
                var parseCssObj = function (targetProperty, item) {
                    var propertys = item.css('transition-property'),
                        durations = item.css('transition-duration'),
                        delays = item.css('transition-delay');
                    var slicePropertys = propertys.split(',').map(function (val) {
                            return $.trim(val);
                        }),
                        sliceDurations = durations.split(',').map(function (val) {
                            return parseFloat($.trim(val)) * 1000;
                        }),
                        sliceDelays = delays.split(',').map(function (val) {
                            return parseFloat($.trim(val)) * 1000;
                        }),
                        hasIndex = $.inArray(targetProperty, slicePropertys);
                    return sliceDurations[hasIndex] + sliceDelays[hasIndex];
                };
                var foldDescInnerHeight = this.foldDescInner.outerHeight(true);
                if (type) {
                    this.foldDescWrap.css('height', foldDescInnerHeight);
                    var transitionData = parseCssObj('height', this.foldDescWrap);
                    win.setTimeout($.proxy(function () {
                        this.outCallback('active');
                    }, this), transitionData);
                } else {
                    this.foldDescWrap.css('height', '');
                    var transitionData = parseCssObj('height', this.foldDescWrap);
                    win.setTimeout($.proxy(function () {
                        this.outCallback('deactive');
                    }, this), transitionData);
                }
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isFoldActive = false;
                this.foldInner.removeClass(this.opts.classAttr.opened);
                this.foldInnerBtn.attr(this.opts.ariaAttr.expanded, 'false');
                this.foldDescWrap.css('height', '');
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
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
                obj : '.cp-feature-carousel'
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
                    new win.g2.cpFeatureCarousel.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
