(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.footer = global.g2.footer || {};
    global.g2.footer.Component = factory();
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
                footerInfo : '.site-footer__info',
                footerInfoTopbtn : '.btn-top',
                utilShare : '.util-share',
                shareBtn : '.btn-share',
                openClass : 'is-open',
                accessData : {
                    EXPANDED : 'aria-expanded'
                },
                sitemapWrap : '.site-footer__sitemap-wrap',
                accordionObjs : [],
                accordionOpts : {
                    accordionList : '.site-footer__sitemap',
                    accordionItem : '.site-footer__sitemap-item',
                    btn : '.sitemap-title-cta',
                    panel : '.site-footer__sitemap-list',
                    panelInner : '.sitemap-item-wrap',
                },
                notice : '.site-footer__notice',
                noticeList : '.site-footer__notice-list',
                noticeItem : '.site-footer__notice-item',
                noticeSwiper : '.swiper-container',
                noticeListFocus : false,
                carouselController : '.site-footer__notice-controls',
                carouselOpts : {
                    init : false,
                    direction : 'vertical',
                    initialSlide : 0,
                    speed : 750,
                    slidesPerView:1,
                    loop : true
                },
                globalText : {},
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
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
                this.buildControl();
                this.buildTimer();
                this.buildSwiper();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.footerInfo = this.obj.find(this.opts.footerInfo);
                this.utilShare = this.footerInfo.find(this.opts.utilShare);
                this.shareBtn = this.utilShare.find(this.opts.shareBtn);
                this.footerInfoTopbtn = this.footerInfo.find(this.opts.footerInfoTopbtn);
                this.notice = this.obj.find(this.opts.notice);
                this.noticeList = this.notice.find(this.opts.noticeList);
                this.noticeItem = this.noticeList.find(this.opts.noticeItem);
                this.noticeSwiper = this.noticeList.find(this.opts.noticeSwiper);
                this.carouselController = this.notice.find(this.opts.carouselController);
                this.sitemapWrap = this.obj.find(this.opts.sitemapWrap);
            },
            initOpts : function () {
                if (this.noticeItem.length < 2) {
                    this.opts.carouselOpts.loop = false;
                }
                // globalText
                var globalText = this.obj.data('global-text');
                if (globalText !== isUndefined) {
                    for (var gKey in globalText) {
                        var gText = $.trim(globalText[gKey]);
                        this.opts.globalText[gKey] = gText.length ? gText : gKey;
                    }
                }
            },
            buildAccordion : function () {
                for (var i = 0, max = this.sitemapWrap.length; i < max; i++) {
                    var target = this.sitemapWrap.eq(i);
                    target.data('global-text', this.opts.globalText);
                    this.opts.accordionObjs.push(new HiveAccordion(target, this.opts.accordionOpts));
                }
            },
            destroyAccordion : function () {
                for (var i = 0, max = this.opts.accordionObjs.length; i < max; i++) {
                    this.opts.accordionObjs[i].destroy();
                }
                this.opts.accordionObjs = [];
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
                    this.footerInfoTopbtn.on(this.changeEvents('click'), $.proxy(this.topMoveFunc, this));
                    this.noticeList.on(this.changeEvents('mouseenter mouseleave'), $.proxy(this.noticeListMouseFunc, this));
                    this.utilShare.on(this.changeEvents('click'), this.opts.shareBtn, $.proxy(this.onClickBtn, this));
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    this.footerInfoTopbtn.off(this.changeEvents('click'));
                    this.noticeList.off(this.changeEvents('mouseenter mouseleave'));
                    this.utilShare.off(this.changeEvents('click'));
                    $(win).off(this.changeEvents('resize orientationchange'));
                }
            },
            topMoveFunc : function (e) {
                e.preventDefault();
                Util.scrollMoveFunc($('body'));
            },
            accessbilityFunc : function (type) {
                var accessData = this.opts.accessData;
                if (type) {
                    this.shareBtn.attr(accessData.EXPANDED, 'true');
                } else {
                    this.shareBtn.attr(accessData.EXPANDED, 'false');
                }
            },
            bindOutsideEvents : function (type, idx) {
                (type) ? this.utilShare.eq(idx).on('clickoutside focusoutside', $.proxy(this.onClickoutsideFunc, this)) : this.utilShare.eq(idx).off('clickoutside focusoutside');
            },
            onClickBtn : function (e) {
                e.preventDefault();
                var target = $(e.delegateTarget),
                    targetIndex = target.index();
                if (!target.hasClass(this.opts.openClass)) {
                    target.addClass(this.opts.openClass);
                    this.accessbilityFunc(true);
                    this.bindOutsideEvents(true, targetIndex);
                } else {
                    target.removeClass(this.opts.openClass);
                    this.accessbilityFunc(false);
                    this.bindOutsideEvents(false, targetIndex);
                }
            },
            onClickoutsideFunc : function (e) {
                var target = $(e.currentTarget);
                target.find(this.opts.shareBtn).trigger('click');
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
                var noticeItem = this.noticeItem,
                    aHeight = [];
                for (var nMin = 0, nMax = noticeItem.length; nMin < nMax; nMin++) {
                    var item = noticeItem.eq(nMin);
                    aHeight.push(item.outerHeight(true));
                }
                this.noticeList.css('height', Math.max.apply(null, aHeight));
                if (!Util.isSupportTransform || Util.isSupportTransform && (this.winWidth > 1023)) {
                    if (this.opts.viewType !== 'pc') {
                        this.opts.viewType = 'pc';
                        this.destroyAccordion();
                    }
                } else {
                    if (this.opts.viewType !== 'mo') {
                        this.opts.viewType = 'mo';
                        this.buildAccordion();
                    }
                }
            },
            noticeListMouseFunc : function (e) {
                if (e.type === 'mouseenter') {
                    this.opts.noticeListFocus = true;
                    // this.timer.pause();
                } else if (e.type === 'mouseleave') {
                    this.opts.noticeListFocus = false;
                    // this.timer.play();
                }
            },
            controlSwiper : function () {
                if (this.controller.isPlay) {
                    this.timer.pause();
                } else {
                    this.opts.objFocus = false;
                    this.timer.play();
                }
            },
            buildControl : function () {
                Util.def(this, {
                    controller : {
                        instance : null,
                        isPlay : false,
                        controlClass : $.proxy(function (type) {
                            if (this.controller.instance == null) return;
                            this.controller.instance.controlClass(type);
                        }, this)
                    }
                });
                if (this.carouselController.length && (this.noticeItem.length > 1)) {
                    this.controller.instance = new Controller(this.obj, {
                        carouselController : this.opts.carouselController,
                        isPlay : this.controller.isPlay,
                        globalText : this.opts.globalText,
                        on : {
                            play : $.proxy(function () {
                                this.controller.isPlay = true;
                                this.controlSwiper();
                            }, this),
                            pause : $.proxy(function () {
                                this.controller.isPlay = false;
                                this.controlSwiper();
                            }, this),
                            prev : $.proxy(function () {
                                this.timer.progress(0);
                                this.carousel.slideprev();
                            }, this),
                            next : $.proxy(function () {
                                this.timer.progress(0);
                                this.carousel.slidenext();
                            }, this)
                        }
                    });
                } else {
                    this.carouselController.hide();
                }
            },
            buildTimer : function () {
                Util.def(this, {
                    timer : {
                        instance : null,
                        play : $.proxy(function () {
                            if (this.timer.instance == null) return;
                            this.controller.controlClass(false);
                            this.timer.instance.play();
                        }, this),
                        pause : $.proxy(function () {
                            if (this.timer.instance == null) return;
                            this.controller.controlClass(true);
                            this.timer.instance.pause();
                        }, this),
                        progress : $.proxy(function (num) {
                            if (this.timer.instance == null) return;
                            this.timer.instance.progress(num);
                        }, this)
                    }
                });
                if (this.noticeItem.length > 1) {
                    this.timer.instance = new Timer(this.obj, {
                        on : {
                            complete : $.proxy(function () {
                                this.carousel.slidenext();
                            }, this)
                        }
                    });
                }
            },
            buildSwiper : function () {
                Util.def(this, {
                    carousel : {
                        instance : null,
                        update : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.update();
                        }, this),
                        slidenext : $.proxy(function (speed, runCallbacks) {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.slideNext(speed, runCallbacks);
                        }, this),
                        slideprev : $.proxy(function (speed, runCallbacks) {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.slidePrev(speed, runCallbacks);
                        }, this)
                    }
                });
                if (this.carousel.instance == null && this.noticeSwiper.length) {
                    var moveEnd = $.proxy(function () {
                        var index = this.carousel.instance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.timer.progress(0);
                        if (!this.opts.noticeListFocus && !this.controller.isPlay) {
                            this.timer.play();
                        }
                        this.opts.currentIndex = index;
                    }, this);
                    this.opts.carouselOpts.on = {
                        init : moveEnd,
                        transitionEnd : moveEnd
                    };
                    this.carousel.instance = new Swiper(this.noticeSwiper, this.opts.carouselOpts);
                    this.noticeSwiper.addClass('swiper-no-swiping');
                    this.carousel.instance.init();
                    win.setTimeout($.proxy(function () {
                        this.carousel.update();
                    }, this), 30);
                }
            },
            outCallback : function (ing) {
                var callbackObj = this.opts[ing];
                if (callbackObj == null) return;
                callbackObj();
            },
            reInit : function () {
                // Global Callback
            }
        };
        function Controller (container, args) {
            if (!(this instanceof Controller)) {
                return new Controller(container, args);
            }
            var defParams = {
                carouselController : null,
                prevBtn : '.btn-prev',
                controlBtn : '.btn-pause',
                nextBtn : '.btn-next',
                isPlay : true,
                classAttr : {
                    play : 'btn-play',
                    pause : 'btn-pause'
                },
                customEvent : '.Controller' + (new Date()).getTime() + Math.random(),
                globalText : {},
                on : {
                    play : null,
                    pause : null,
                    prev : null,
                    next : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Controller.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.bindEvents(true);
            },
            setElements : function () {
                this.carouselController = this.obj.find(this.opts.carouselController);
                this.controlBtn = this.carouselController.find(this.opts.controlBtn);
                this.prevBtn = this.carouselController.find(this.opts.prevBtn);
                this.nextBtn = this.carouselController.find(this.opts.nextBtn);
            },
            initLayout : function () {
                this.controlClass(this.opts.isPlay);
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
                    this.controlBtn.on(this.changeEvents('click'), $.proxy(this.controlClickFunc, this));
                    this.prevBtn.on(this.changeEvents('click'), $.proxy(this.prevClickFunc, this));
                    this.nextBtn.on(this.changeEvents('click'), $.proxy(this.nextClickFunc, this));
                } else {
                    this.controlBtn.off(this.changeEvents('click'));
                    this.prevBtn.off(this.changeEvents('click'));
                    this.nextBtn.off(this.changeEvents('click'));
                }
            },
            controlClickFunc : function (e) {
                e.preventDefault();
                this.opts.isPlay = !this.opts.isPlay;
                if (this.opts.isPlay) {
                    this.outCallback('play');
                } else {
                    this.outCallback('pause');
                }
                this.controlClass(this.opts.isPlay);
            },
            prevClickFunc : function (e) {
                e.preventDefault();
                this.outCallback('prev');
            },
            nextClickFunc : function (e) {
                e.preventDefault();
                this.outCallback('next');
            },
            controlClass : function (type) {
                var globalText = this.opts.globalText,
                    classAttr = this.opts.classAttr;
                if (type) {
                    if (this.controlBtn.hasClass(classAttr.play)) return;
                    this.controlBtn.addClass(classAttr.play).removeClass(classAttr.pause);
                    this.controlBtn.find('.blind').text(globalText['Play']);
                } else {
                    if (this.controlBtn.hasClass(classAttr.pause)) return;
                    this.controlBtn.addClass(classAttr.pause).removeClass(classAttr.play);
                    this.controlBtn.find('.blind').text(globalText['Pause']);
                }
                this.opts.isPlay = type;
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        function Timer (container, args) {
            if (!(this instanceof Timer)) {
                return new Timer(container, args);
            }
            var defParams = {
                barCSSEl : $('<x/>'),
                autoPlay : 3,
                progress : null,
                remainFill : null,
                customEvent : '.Timer' + (new Date()).getTime() + Math.random(),
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Timer.prototype = {
            init : function () {
                this.initOpts();
                this.initLayout();
            },
            initOpts : function () {
                this.opts.autoPlay = this.opts.autoPlay * 1000;
                this.opts.remainFill = this.opts.autoPlay;
            },
            initLayout : function () {
                this.opts.barCSSEl.css('num', 0);
            },
            play : function () {
                this.opts.barCSSEl.stop().animate({
                    'num' : 100
                }, {
                    duration : this.opts.remainFill,
                    easing : 'linear',
                    step : $.proxy(function (data) {
                        this.opts.progress = data;
                    }, this),
                    complete : $.proxy(function () {
                        this.outCallback('complete');
                    }, this)
                });
            },
            pause : function () {
                this.stop(this.opts.progress);
            },
            stop : function (num) {
                var ramainDuration = 100 - num,
                    ramainDurationPercent = ramainDuration / 100;
                this.opts.barCSSEl.stop().css('num', num);
                this.opts.remainFill = this.opts.autoPlay * ramainDurationPercent;
                this.opts.progress = num;
            },
            progress : function (num) {
                if (num == isUndefined) {
                    num = 0;
                }
                if (num < 0) {
                    num = 0;
                } else if (num >= 1) {
                    num = 1;
                }
                this.stop(num * 100);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
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
                obj : '.site-footer'
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
                    new win.g2.footer.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
