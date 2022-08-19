(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.bigQuote = global.g2.bigQuote || {};
    global.g2.bigQuote.Component = factory();
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
                tweenObj : null,
                noImageClass : 'is-no-image',
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                viewType : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                if (!this.obj.hasClass(this.opts.noImageClass)) {
                    this.resizeFunc();
                    this.bindEvents(true);
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
                        if (this.opts.tweenObj !== null) {
                            this.opts.tweenObj.destroy();
                        }
                        this.opts.tweenObj = new MoTween(this.obj);
                    }
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                        if (this.opts.tweenObj !== null) {
                            this.opts.tweenObj.destroy();
                        }
                        this.opts.tweenObj = new PcTween(this.obj);
                    }
                }
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function PcTween (container, args) {
            var defParams = {
                obj : container,
                parallaxSection : '.cp-bigquote__parallax',
                parallaxWrap : '.cp-bigquote__parallax-wrap',
                parallaxSpace : '.cp-bigquote__parallax-space',
                parallaxInner : '.cp-bigquote__parallax-inner',
                parallaxTxt : '.parallax-text',
                parallaxImgLeft : '.parallax-img-left',
                parallaxImgRight : '.parallax-img-right',
                smagicOpts : {
                    triggerHook : 0
                },
                timeline : [],
                isDestroy : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        PcTween.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.resizeFunc();
                this.bindEvents(true);
                this.buildController();
                this.buildScene();
            },
            setElements : function () {
                this.parallaxSection = this.obj.find(this.opts.parallaxSection);
                this.parallaxWrap = this.parallaxSection.find(this.opts.parallaxWrap);
                this.parallaxSpace = this.parallaxWrap.find(this.opts.parallaxSpace);
                this.parallaxInner = this.parallaxSpace.find(this.opts.parallaxInner);
                this.parallaxTxt = this.parallaxInner.find(this.opts.parallaxTxt);
                this.parallaxImgLeft = this.parallaxInner.find(this.opts.parallaxImgLeft);
                this.parallaxImgRight = this.parallaxInner.find(this.opts.parallaxImgRight);
            },
            initOpts : function () {
                this.opts.smagicOpts['triggerElement'] = this.parallaxSection.get(0);
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
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 50);
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
                if (this.opts.isDestroy) return;
                var minHeight = this.parallaxInner.outerHeight(true);
                this.parallaxWrap.css('min-height', minHeight);
            },
            buildController : function () {
                this.controller = new ScrollMagic.Controller();
            },
            buildScene : function () {
                var parallaxTxt = this.parallaxTxt,
                    parallaxImgLeft = this.parallaxImgLeft,
                    parallaxImgRight = this.parallaxImgRight,
                    smagicOpts = this.opts.smagicOpts;

                var sectionBox = new TimelineMax();
                sectionBox.fromTo(parallaxTxt.get(0), 1, {
                    y : "0%"
                }, {
                    ease: Linear.easeNone,
                    y : "0%"
                })
                .to(parallaxTxt.get(0), 2, {
                    ease: Linear.easeNone,
                    y : "0%"
                });
                new ScrollMagic.Scene(Util.def(smagicOpts, {
                    duration: '125%'
                })).addTo(this.controller).setPin(this.parallaxSection.get(0)).setTween(sectionBox);

                var leftBox = new TimelineMax();
                leftBox.fromTo(parallaxImgLeft.get(0), 1, {
                    y : "0%"
                }, {
                    ease : Linear.easeNone,
                    opacity : 0,
                    y : "-300%"
                });
                new ScrollMagic.Scene(Util.def(smagicOpts, {
                    duration: '150%'
                })).addTo(this.controller).setTween(leftBox);

                var rightBox = new TimelineMax();
                rightBox.fromTo(parallaxImgRight.get(0), 1, {
                    y : "0%"
                }, {
                    ease : Linear.easeNone,
                    opacity : 0,
                    y : "-200%"
                });
                new ScrollMagic.Scene(Util.def(smagicOpts, {
                    duration: '125%'
                })).addTo(this.controller).setTween(rightBox);

                this.opts.timeline.push(sectionBox);
                this.opts.timeline.push(leftBox);
                this.opts.timeline.push(rightBox);
            },
            destroy : function () {
                this.opts.isDestroy = true;
                this.bindEvents(false);
                this.controller.destroy();
                for (var i = 0, max = this.opts.timeline.length; i < max; i++) {
                    this.opts.timeline[i].progress(1).kill();
                }
                this.parallaxSection.unwrap().removeAttr('style');
                this.parallaxWrap.css('min-height', '');
                this.parallaxTxt.css('transform', '');
                this.parallaxImgLeft.css({
                    'opacity' : '',
                    'transform' : ''
                });
                this.parallaxImgRight.css({
                    'opacity' : '',
                    'transform' : ''
                });
            }
        };
        function MoTween (container, args) {
            var defParams = {
                obj : container,
                parallaxSection : '.cp-bigquote__parallax',
                parallaxWrap : '.cp-bigquote__parallax-wrap',
                parallaxSpace : '.cp-bigquote__parallax-space',
                parallaxInner : '.cp-bigquote__parallax-inner',
                parallaxTxt : '.parallax-text',
                parallaxImgLeft : '.parallax-img-left',
                parallaxImgRight : '.parallax-img-right',
                smagicOpts : {
                    triggerHook : 0
                },
                noImageClass : 'is-no-image',
                timeline : [],
                isDestroy : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        MoTween.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.resizeFunc();
                this.bindEvents(true);
                this.buildController();
                this.buildScene();
            },
            setElements : function () {
                this.parallaxSection = this.obj.find(this.opts.parallaxSection);
                this.parallaxWrap = this.parallaxSection.find(this.opts.parallaxWrap);
                this.parallaxSpace = this.parallaxWrap.find(this.opts.parallaxSpace);
                this.parallaxInner = this.parallaxSpace.find(this.opts.parallaxInner);
                this.parallaxTxt = this.parallaxInner.find(this.opts.parallaxTxt);
                this.parallaxImgRight = this.parallaxInner.find(this.opts.parallaxImgRight);
            },
            initOpts : function () {
                this.opts.smagicOpts['triggerElement'] = this.parallaxSection.get(0);
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
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 50);
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
                if (this.opts.isDestroy) return;
                var minHeight = this.parallaxInner.outerHeight(true);
                this.parallaxWrap.css('min-height', minHeight);
            },
            buildController : function () {
                this.controller = new ScrollMagic.Controller();
            },
            buildScene : function () {
                var parallaxTxt = this.parallaxTxt,
                    parallaxImgRight = this.parallaxImgRight,
                    smagicOpts = this.opts.smagicOpts,
                    magicDuration = Util.winSize().h;

                if (this.obj.hasClass(this.opts.noImageClass)) {
                    var sectionBox = new TimelineMax();
                    sectionBox.fromTo(parallaxTxt.get(0), 1, {
                        y : "0%"
                    }, {
                        ease: Linear.easeNone,
                        y : "0%"
                    })
                    .to(parallaxTxt.get(0), 1, {
                        ease: Linear.easeNone,
                        y : "0%"
                    });
                    new ScrollMagic.Scene(Util.def(smagicOpts, {
                        duration: magicDuration + 'px'
                    })).addTo(this.controller).setPin(this.parallaxSection.get(0)).setTween(sectionBox);
                } else {
                    var sectionBox = new TimelineMax();
                    sectionBox.fromTo(parallaxTxt.get(0), 1, {
                        y : "0%"
                    }, {
                        ease: Linear.easeNone,
                        y : "0%"
                    })
                    .to(parallaxTxt.get(0), 2, {
                        ease: Linear.easeNone,
                        y : "0%"
                    });
                    new ScrollMagic.Scene(Util.def(smagicOpts, {
                        duration: (magicDuration * 2) + 'px'
                    })).addTo(this.controller).setPin(this.parallaxSection.get(0)).setTween(sectionBox);

                    var rightBox = new TimelineMax();
                    rightBox.fromTo(parallaxImgRight.get(0), 1, {
                        y : "100%"
                    }, {
                        ease : Linear.easeNone,
                        opacity : 0,
                        y : "-160%"
                    });
                    new ScrollMagic.Scene(Util.def(smagicOpts, {
                        duration: (magicDuration * 2) + 'px'
                    })).addTo(this.controller).setTween(rightBox);
                }

                this.opts.timeline.push(sectionBox);
                this.opts.timeline.push(rightBox);
            },
            destroy : function () {
                this.opts.isDestroy = true;
                this.bindEvents(false);
                this.controller.destroy();
                for (var i = 0, max = this.opts.timeline.length; i < max; i++) {
                    this.opts.timeline[i].progress(1).kill();
                }
                this.parallaxSection.unwrap().removeAttr('style');
                this.parallaxWrap.css('min-height', '');
                this.parallaxTxt.css('transform', '');
                this.parallaxImgRight.css({
                    'opacity' : '',
                    'transform' : ''
                });
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
                obj : '.cp-bigquote',
                isAemEditMode : Util.isAemEditMode()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                if (!this.opts.isAemEditMode) {
                    this.callComponent();
                }
            },
            callComponent : function () {
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    new win.g2.bigQuote.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
