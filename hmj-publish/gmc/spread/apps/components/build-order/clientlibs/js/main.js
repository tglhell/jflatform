(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.deviceRotate = factory();
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
                container : '.device-alert',
                graphic : '.graphic',
                device : '.device',
                arrows : '.arrows',
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                sizeAttr : {
                    view : null
                },
                classAttr : {
                    active : 'is-active'
                },
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                if (Util.isDevice) {
                    this.setElements();
                    this.buildMotion();
                    this.resizeFunc();
                    this.bindEvents(true);
                }
            },
            setElements : function () {
                this.graphic = this.obj.find(this.opts.graphic);
                this.device = this.graphic.find(this.opts.device);
                this.arrows = this.graphic.find(this.opts.arrows);
            },
            buildMotion : function () {
                Util.def(this, {
                    motion : {
                        isActive : false,
                        timeline : [],
                        timeout : [],
                        destroy : $.proxy(function () {
                            if (!this.motion.isActive) return;
                            this.motion.isActive = false;
                            for (var tMin = 0, tMax = this.motion.timeline.length; tMin < tMax; tMin++) {
                                this.motion.timeline[tMin].kill();
                            }
                            this.motion.timeline = [];
                            for (var toMin = 0, toMax = this.motion.timeout.length; toMin < toMax; toMin++) {
                                win.clearTimeout(this.motion.timeout[toMin]);
                            }
                            this.motion.timeout = [];
                        }, this),
                        move : $.proxy(function () {
                            var tweenDuration = (1200 / 1000);
                            var nextTime = 3000;
                            var step1 = $.proxy(function () {
                                var tween = TweenLite.fromTo(this.arrows, tweenDuration, {
                                    rotation : 0
                                }, {
                                    ease : Back.easeInOut.config(1.5),
                                    transformOrigin : 'center',
                                    rotation : 90,
                                    onComplete : $.proxy(function () {
                                        this.motion.timeout.push(win.setTimeout($.proxy(function () {
                                            tween.restart();
                                        }, this), nextTime));
                                    }, this)
                                });
                                return tween;
                            }, this);
                            var step2 = $.proxy(function () {
                                var tween = TweenLite.fromTo(this.device, tweenDuration, {
                                    rotation : 0
                                }, {
                                    ease : Back.easeInOut.config(0.7),
                                    transformOrigin : 'center',
                                    rotation : 90,
                                    onComplete : $.proxy(function () {
                                        this.motion.timeout.push(win.setTimeout($.proxy(function () {
                                            tween.restart();
                                        }, this), nextTime));
                                    }, this)
                                });
                                return tween;
                            }, this);
                            this.motion.timeline.push(step1());
                            this.motion.timeline.push(step2());
                        }, this),
                        build : $.proxy(function () {
                            if (this.motion.isActive) return;
                            this.motion.isActive = true;
                            this.motion.move();
                        }, this)
                    }
                });
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
                var wWidth = win.screen.availWidth;
                var wHeight = win.screen.availHeight;
                if (Util.isIOS) {
                    var wWidth = Util.winSize().w;
                    var wHeight = Util.winSize().h;
                }
                if (wWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.sizeAttr.view !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.sizeAttr.view = RESPONSIVE.TABLET3.NAME;
                    }
                    if (wWidth <= wHeight) {
                        if (this.obj.hasClass(this.opts.classAttr.active)) {
                            this.obj.removeClass(this.opts.classAttr.active);
                            this.motion.destroy();
                            this.ariaAccessbility(false, this.obj);
                        }
                    } else {
                        if (!this.obj.hasClass(this.opts.classAttr.active)) {
                            this.obj.addClass(this.opts.classAttr.active);
                            this.motion.build();
                            Util.findFocus(this.obj);
                            this.ariaAccessbility(true, this.obj);
                        }
                    }
                } else {
                    if (this.opts.sizeAttr.view !== 'OTHER') {
                        this.opts.sizeAttr.view = 'OTHER';
                        this.obj.removeClass(this.opts.classAttr.active);
                        this.motion.destroy();
                        this.ariaAccessbility(false, this.obj);
                    }
                }
            },
            ariaAccessbility : function (type, obj) {
                var objParents = obj.parents();
                if (type) {
                    obj.removeAttr('aria-hidden').siblings().attr('aria-hidden', 'true');
                    for (var i = 0, max = objParents.length; i < max; i++) {
                        var _target = objParents.eq(i);
                        _target.siblings().attr('aria-hidden', 'true');
                    }
                } else {
                    obj.siblings().removeAttr('aria-hidden');
                    for (var i = 0, max = objParents.length; i < max; i++) {
                        var _target = objParents.eq(i);
                        _target.siblings().removeAttr('aria-hidden');
                    }
                }
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
        new window.g2.deviceRotate();
    });
}(this));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.Nav = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                orderNav : '.build-order-nav',
                selModel : '.build-select-model',
                selModelCont : '.build-select-model__contents',
                selModelPlaceholder : '.build-select-model__placeholder',
                selModelLayer : '.build-select-model__layer',
                orderNavStep : '.build-order-nav__step',
                orderNavStepInner : '.build-order-nav__step-inner',
                carouselOpts : {
                    init : false,
                    slidesPerView : 'auto',
                    updateOnWindowResize : false,
                    freeMode : true
                },
                classAttr : {
                    active : 'is-active',
                    opened : 'is-opened',
                    scroll : 'is-scroll'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                isNavActive : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildSwiper();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.orderNav = this.obj.find(this.opts.orderNav);
                this.selModel = this.orderNav.find(this.opts.selModel);
                this.selModelCont = this.selModel.find(this.opts.selModelCont);
                this.selModelPlaceholder = this.selModel.find(this.opts.selModelPlaceholder);
                this.selModelLayer = this.selModel.find(this.opts.selModelLayer);
                this.orderNavStep = this.orderNav.find(this.opts.orderNavStep);
                this.carouselContainer = this.orderNavStep.find('.swiper-container');
                this.carouselSlide = this.carouselContainer.find('.swiper-slide');
                this.carouselPrevBtn = this.orderNavStep.find('.swiper-btn-prev');
                this.carouselNextBtn = this.orderNavStep.find('.swiper-btn-next');
                this.orderNavStepInner = this.orderNavStep.find(this.opts.orderNavStepInner);
                this.orderNavStepList = this.orderNavStepInner.find('ol');
                this.orderNavStepChild = this.orderNavStepList.children();
            },
            buildSwiper : function () {
                Util.def(this, {
                    carousel : {
                        instance : null,
                        setwidth : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            // var width = 0;
                            // for (var min = 0, max = this.orderNavStepChild.length; min < max; min++) {
                            //     var stepChild = this.orderNavStepChild.eq(min);
                            //     width += stepChild.outerWidth(true);
                            // }
                            this.carouselSlide.css('width', 'auto');
                        }, this),
                        setbtn : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            var carouselContainer = this.carouselContainer,
                                carouselSlide = this.carouselSlide,
                                condition = carouselContainer.outerWidth(true) < carouselSlide.outerWidth(true);
                            if (condition) {
                                this.orderNavStep.addClass(this.opts.classAttr.scroll);
                                this.carouselPrevBtn.css('display', '');
                                this.carouselNextBtn.css('display', '');
                            } else {
                                this.orderNavStep.removeClass(this.opts.classAttr.scroll);
                                this.carouselPrevBtn.hide();
                                this.carouselNextBtn.hide();
                            }
                            carouselContainer.toggleClass('swiper-no-swiping', !condition);
                        }, this),
                        setdimmed : $.proxy(function (progress) {
                            if (this.carousel.instance == null) return;
                            if (progress <= 0) {
                                this.carouselPrevBtn.removeClass('is-dimmed');
                            } else {
                                this.carouselPrevBtn.addClass('is-dimmed');
                            }
                            if (progress >= 1) {
                                this.carouselNextBtn.removeClass('is-dimmed');
                            } else {
                                this.carouselNextBtn.addClass('is-dimmed');
                            }
                        }, this),
                        slideprev : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.slidePrev();
                        }, this),
                        slidenext : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.slideNext();
                        }, this),
                        slideto : $.proxy(function (target) {
                            if (this.carousel.instance == null) return;
                            var currentTranslate = this.carousel.instance.translate,
                                targetW = target.outerWidth(true),
                                targetL = target.offset().left,
                                orderNavStepW = this.orderNavStep.outerWidth(true),
                                orderNavStepL = this.orderNavStep.offset().left,
                                totalPosition = orderNavStepL + (orderNavStepW / 2) - (targetW / 2),
                                _position = currentTranslate + totalPosition - targetL;
                            this.carousel.instance.translateTo(_position);
                        }, this),
                        update : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.update();
                        }, this)
                    }
                });
                Util.def(this.opts.carouselOpts, {
                    on : {
                        init : $.proxy(function () {
                            win.setTimeout($.proxy(function () {
                                this.resizeFunc();
                                this.carousel.instance.update();
                                // this.carousel.slideto(this.orderNavStepChild.filter('.'+this.opts.classAttr.active)); vue
                            }, this), 150);
                        }, this),
                        progress : $.proxy(function (a) {
                            this.carousel.setdimmed(a);
                        }, this)
                    }
                });
                this.carousel.instance = new Swiper(this.carouselContainer, this.opts.carouselOpts);
                this.carousel.instance.init();
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
                    this.selModelPlaceholder.on(this.changeEvents('click'), $.proxy(this.navOpen, this));
                    this.carouselPrevBtn.find('button').on(this.changeEvents('click'), $.proxy(this.carouselPrevClick, this));
                    this.carouselNextBtn.find('button').on(this.changeEvents('click'), $.proxy(this.carouselNextClick, this));
                    this.orderNavStepChild.on(this.changeEvents('click'), '>a', $.proxy(this.orderNavStepChildClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.selModelPlaceholder.off(this.changeEvents('click'));
                    this.carouselPrevBtn.find('button').off(this.changeEvents('click'));
                    this.carouselNextBtn.find('button').off(this.changeEvents('click'));
                    this.orderNavStepChild.off(this.changeEvents('click'));
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
                this.carousel.update();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                this.carousel.setwidth();
                this.carousel.setbtn();
            },
            carouselPrevClick : function (e) {
                e.preventDefault();
                this.carousel.slideprev();
            },
            carouselNextClick : function (e) {
                e.preventDefault();
                this.carousel.slidenext();
            },
            navOpen : function (e) {
                e.preventDefault();
                var ariaAttr = this.opts.ariaAttr;
                this.opts.isNavActive = !this.opts.isNavActive;
                if (this.opts.isNavActive) {
                    this.selModelPlaceholder.attr(ariaAttr.expanded, 'true');
                    this.selModel.addClass(this.opts.classAttr.opened);
                    win.setTimeout($.proxy(function () {
                        this.selModelCont.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.selModelPlaceholder.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.selModelPlaceholder.attr(ariaAttr.expanded, 'false');
                    this.selModel.removeClass(this.opts.classAttr.opened);
                    this.selModelCont.off('clickoutside touchendoutside keyupoutside');
                }
            },
            orderNavStepChildClick : function (e) {
                var target = $(e.currentTarget);
                this.carousel.slideto(target);
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.OptionsContentsHeight = factory();
}(this, function () { 'use strict';

    var ContentsHeight = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function ContentsHeight (container, args) {
            if (!(this instanceof ContentsHeight)) {
                return new ContentsHeight(container, args);
            }
            var defParams = {
                container : container,
                contentInner : '.build-order-options__content-inner',
                orderPrice : '.build-order-price',
                isDestroy : false,
                customEvent : '.ContentsHeight' + (new Date()).getTime() + Math.random(),
                viewType : null,
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        ContentsHeight.prototype = {
            init : function () {
                this.setElements();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.contentInner = this.obj.find(this.opts.contentInner);
                this.orderPrice = $(this.opts.orderPrice);
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
            orderPriceHeight : function () {
                var price = this.orderPrice,
                    priceOffset = price.length ? price.offset() : {top:0},
                    priceOffsetTop = price.length ? priceOffset.top : Util.winSize().h;
                return priceOffsetTop;
            },
            setLayout : function () {
                if (this.opts.isDestroy) return;
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.viewType !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.viewType = RESPONSIVE.TABLET3.NAME;
                    }
                    var inner = this.contentInner,
                        innerOffset = inner.offset(),
                        priceOffsetTop = this.orderPriceHeight(),
                        _height = priceOffsetTop - innerOffset.top;
                    inner.css('height', _height);
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                        this.contentInner.css('height', '');
                    }
                }
            },
            destroy : function () {
                this.opts.viewType = null;
                this.opts.isDestroy = true;
                this.contentInner.css('height', '');
                this.bindEvents(false);
            },
            resize : function () {
                this.setLayout();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
            }
        };
        return ContentsHeight;
    })();
    return ContentsHeight;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.OptionsMoreBtn = factory();
}(this, function () { 'use strict';

    var OptionsMoreBtn = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function OptionsMoreBtn (container, args) {
            if (!(this instanceof OptionsMoreBtn)) {
                return new OptionsMoreBtn(container, args);
            }
            var defParams = {
                container : container,
                btnMore : '.build-order-options__img-mo .js-btn-more',
                animate : false,
                playStep : []
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        OptionsMoreBtn.prototype = {
            init : function () {
                this.setElements();
                this.play();
            },
            setElements : function () {
                this.btnMore = this.obj.find(this.opts.btnMore);
            },
            play : function () {
                var step1 = new TimelineMax();
                if (this.opts.animate) {
                    step1.fromTo(this.btnMore, (500 / 1000), {
                        opacity : 0
                    }, {
                        opacity : 1
                    });
                    step1.to(this.btnMore, (1500 / 1000), {
                        delay : .5,
                        ease : Expo.easeOut,
                        width : 0
                    });
                } else {
                    step1.fromTo(this.btnMore, (500 / 1000), {
                        opacity : 0,
                        width : 0
                    }, {
                        opacity : 1
                    });
                }
                this.opts.playStep.push(step1);
            },
            destroy : function () {
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                TweenLite.set(this.btnMore, {
                    width : '',
                    opacity : 0
                });
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
            }
        };
        return OptionsMoreBtn;
    })();
    return OptionsMoreBtn;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.OptionsItem = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                obj : container,
                jsAnimate : '.js-animate',
                moBtnMore : '.build-order-options__img-mo .js-btn-more',
                playStep : [],
                hideStep : [],
                isPlay : false,
                animateAttr : {
                    btnMore : false
                },
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.buildVisualMoreBtn();
                this.buildOptionsContentsHeight();
                this.obj.data('OptionsItem', this);
            },
            setElements : function () {
                this.jsAnimate = this.obj.find(this.opts.jsAnimate);
                this.moBtnMore = this.obj.find(this.opts.moBtnMore);
            },
            initLayout : function () {
                this.obj.hide();
                this.moBtnMore.css('opacity', 0);
            },
            buildVisualMoreBtn : function () {
                Util.def(this, {
                    visualmorebtn : {
                        instance : null,
                        kill : $.proxy(function () {
                            if (this.visualmorebtn.instance == null) return;
                            this.visualmorebtn.instance.destroy();
                            this.visualmorebtn.instance = null;
                        }, this),
                        build : $.proxy(function () {
                            if (this.visualmorebtn.instance !== null) return;
                            this.visualmorebtn.instance = new win.g2.buildOrder.OptionsMoreBtn(this.obj, {
                                animate : this.opts.animateAttr.btnMore
                            });
                            this.opts.animateAttr.btnMore = false;
                        }, this)
                    }
                });
            },
            buildOptionsContentsHeight : function () {
                Util.def(this, {
                    contentsheight : {
                        instance : null,
                        kill : $.proxy(function () {
                            if (this.contentsheight.instance == null) return;
                            this.contentsheight.instance.destroy();
                            this.contentsheight.instance = null;
                        }, this),
                        resize : $.proxy(function () {
                            if (this.contentsheight.instance == null) return;
                            this.contentsheight.instance.resize();
                        }, this),
                        build : $.proxy(function () {
                            if (this.contentsheight.instance !== null) return;
                            this.contentsheight.instance = new win.g2.buildOrder.OptionsContentsHeight(this.obj);
                            Util.imgLoaded(this.obj).done($.proxy(function () {
                                this.contentsheight.resize();
                            }, this));
                        }, this)
                    }
                });
            },
            buildFormwrap : function () {
                var jsBoRadios = this.obj.find('.js-bo-radio-wrap');
                for (var min = 0, max = jsBoRadios.length; min < max; min++) {
                    (function (index) {
                        var jsBoRadio = jsBoRadios.eq(index);
                        if (jsBoRadio.attr('data-load') != 'true') {
                            jsBoRadio.attr('data-load', 'true');
                            new win.G2.Controller.inpRadio.Component(jsBoRadio);
                        }
                    })(min);
                }
                var jsBoChkboxs = this.obj.find('.js-bo-chkbox-wrap');
                for (var min = 0, max = jsBoChkboxs.length; min < max; min++) {
                    (function (index) {
                        var jsBoChkbox = jsBoChkboxs.eq(index);
                        if (jsBoChkbox.attr('data-load') != 'true') {
                            jsBoChkbox.attr('data-load', 'true');
                            new win.G2.Controller.inpCheckbox.Component(jsBoChkbox);
                        }
                    })(min);
                }
            },
            play : function () {
                var _this = this;
                this.jsAnimate = this.obj.find(this.opts.jsAnimate);
                this.obj.css({
                    'opacity' : '',
                    'display' : ''
                });
                this.buildFormwrap();
                this.opts.isPlay = true;
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                for (var min = 0, max = this.jsAnimate.length; min < max; min++) {
                    (function (index) {
                        var jsAnimate = _this.jsAnimate.eq(index);
                        var tween = TweenLite.fromTo(jsAnimate, .5, {
                            'opacity' : 0,
                            'y' : 20
                        }, {
                            'delay' : (index * .1),
                            'opacity' : 1,
                            'y' : 0,
                            'ease' : 'Power2.easeInOut',
                            'onComplete' : $.proxy(function () {
                                if (index == (max - 1)) {
                                    _this.visualmorebtn.build();
                                    _this.contentsheight.build();
                                    _this.outCallback('complete');
                                }
                            }, this)
                        });
                        _this.opts.playStep.push(tween);
                    })(min);
                }
            },
            hide : function (callback) {
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                var duration = (250 / 1000);
                var cb = callback || function () {};
                var tween = TweenLite.to(this.obj, duration, {
                    opacity : 0,
                    display : 'none',
                    onComplete : $.proxy(function () {
                        this.visualmorebtn.kill();
                        this.contentsheight.kill();
                        cb();
                    }, this)
                });
                this.opts.hideStep.push(tween);
            },
            kill : function () {
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                this.obj.hide();
                this.visualmorebtn.kill();
                this.contentsheight.kill();
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.OptionsWrap = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            animateAttr = {
                btnMore : true
            };
        function Component (container, args) {
            var defParams = {
                obj : container,
                optionsItem : '.build-order-options__item',
                activeWrap : null,
                classAttr : {
                    active : 'is-active'
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.buildOptionsItem();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.optionsItem = this.obj.find(this.opts.optionsItem);
            },
            initLayout : function () {
                this.obj.hide();
            },
            buildOptionsItem : function () {
                Util.def(this, {
                    optionitems : {
                        instance : [],
                        isActive : false,
                        allHide : $.proxy(function () {
                            for (var min = 0, max = this.optionitems.instance.length; min < max; min++) {
                                var oInstance = this.optionitems.instance[min];
                                oInstance.kill();
                            }
                        }, this),
                        hide : $.proxy(function () {
                            for (var min = 0, max = this.optionitems.instance.length; min < max; min++) {
                                var oInstance = this.optionitems.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.hide();
                                }
                            }
                        }, this),
                        play : $.proxy(function () {
                            var optionsItem = this.opts.activeWrap.find(this.opts.optionsItem),
                                activeOptionItem = optionsItem.filter('.'+this.opts.classAttr.active),
                                instance = activeOptionItem.data('OptionsItem'),
                                playFunc = $.proxy(function () {
                                    this.outCallback('start');
                                    this.opts.activeWrap.css('display', '').siblings().hide();
                                    instance.play();
                                }, this);
                            if (activeOptionItem.length) {
                                if (instance.opts.isPlay) {
                                    instance.play();
                                } else {
                                    if (this.optionitems.isActive) {
                                        this.optionitems.isActive = false;
                                        for (var min = 0, max = this.optionitems.instance.length; min < max; min++) {
                                            var oInstance = this.optionitems.instance[min];
                                            if (oInstance.opts.isPlay) {
                                                oInstance.hide(playFunc);
                                            }
                                        }
                                    } else {
                                        this.optionitems.allHide();
                                        playFunc();
                                    }
                                }
                            } else {
                                for (var min = 0, max = this.optionitems.instance.length; min < max; min++) {
                                    var oInstance = this.optionitems.instance[min];
                                    if (oInstance.opts.isPlay) {
                                        oInstance.hide($.proxy(function () {
                                            this.outCallback('start');
                                            this.opts.activeWrap.css('display', '').siblings().hide();
                                            this.optionitems.isActive = false;
                                            this.outCallback('complete');
                                        }, this));
                                    }
                                }
                            }
                        }, this)
                    }
                });
                var build = $.proxy(function (optionsItem, min) {
                    this.optionitems.instance.push(new win.g2.buildOrder.OptionsItem(optionsItem, {
                        animateAttr : animateAttr,
                        on : {
                            complete : $.proxy(function () {
                                this.optionitems.isActive = true;
                                this.outCallback('complete');
                            }, this)
                        }
                    }));
                    animateAttr.btnMore = false;
                }, this);
                for (var min = 0, max = this.optionsItem.length; min < max; min++) {
                    var optionsItem = this.optionsItem.eq(min);
                    build(optionsItem, min);
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
                this.obj.on(this.changeEvents('optionview'), $.proxy(this.startView, this));
                this.obj.on(this.changeEvents('optionhide'), $.proxy(this.startHide, this));
            },
            startView : function (e) {
                this.opts.activeWrap = $(e.currentTarget);
                this.play();
            },
            play : function () {
                this.optionitems.play();
            },
            startHide : function () {
                this.hide();
            },
            hide : function () {
                this.optionitems.hide();
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.OrderFinal = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                obj : container,
                orderContent : null,
                classAttr : {
                    expand : 'is-expand'
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
            },
            setElements : function () {
                this.orderContent = this.obj.find(this.opts.orderContent);
            },
            activeExpand : function (type) {
                this.obj.toggleClass(this.opts.classAttr.expand, type);
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.OrderPrice = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                obj : container,
                orderPrice : null,
                orderPriceInner : '.build-order-price__inner',
                summaryWrap : '.build-order-price__summary',
                summaryBtn : '.btn-summary',
                expandBtnWrap : '.build-order-price__expand',
                expandBtn : '.btn-expand',
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                activeAttr : {
                    expand : false
                },
                classAttr : {
                    hide : 'is-hide',
                    expand : 'is-expand'
                },
                on : {
                    change : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildPlay();
                this.bindEvents();
            },
            setElements : function () {
                this.orderPrice = this.obj.find(this.opts.orderPrice);
                this.orderPriceInner = this.orderPrice.find(this.opts.orderPriceInner);
                this.summaryWrap = this.orderPrice.find(this.opts.summaryWrap);
                this.summaryBtn = this.summaryWrap.find(this.opts.summaryBtn);
                this.expandBtnWrap = this.orderPrice.find(this.opts.expandBtnWrap);
                this.expandBtn = this.expandBtnWrap.find(this.opts.expandBtn);
            },
            buildPlay : function () {
                Util.def(this, {
                    animation : {
                        timeline : [],
                        play : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            this.animation.kill();
                            var step1 = new TimelineMax();
                            step1.to(this.expandBtnWrap, (100 / 1000), {
                                opacity : 0,
                                onComplete : $.proxy(function () {
                                    cb();
                                }, this)
                            });
                            step1.to(this.orderPrice, (250 / 1000), {
                                height : this.orderPriceInner.outerHeight(true),
                                onComplete : $.proxy(function () {
                                    this.orderPrice.css('height', '');
                                }, this)
                            });
                            step1.to(this.expandBtnWrap, (250 / 1000), {
                                opacity : 1,
                                onComplete : $.proxy(function () {
                                    this.expandBtnWrap.css('opacity', '');
                                    this.outCallback('change');
                                }, this)
                            });
                            this.animation.timeline.push(step1);
                        }, this),
                        hide : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            this.animation.kill();
                            var step1 = new TimelineMax();
                            step1.to(this.expandBtnWrap, (100 / 1000), {
                                opacity : 0
                            });
                            step1.to(this.orderPrice, (250 / 1000), {
                                height : 0,
                                onComplete : $.proxy(function () {
                                    cb();
                                }, this)
                            });
                            step1.to(this.expandBtnWrap, (250 / 1000), {
                                opacity : 1,
                                onComplete : $.proxy(function () {
                                    this.expandBtnWrap.css('opacity', '');
                                    this.outCallback('change');
                                }, this)
                            });
                            this.animation.timeline.push(step1);
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.animation.timeline.length; min < max; min++) {
                                this.animation.timeline[min].progress(1).kill();
                            }
                            this.animation.timeline = [];
                        }, this)
                    }
                });
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindEvents : function () {
                this.expandBtn.on(this.changeEvents('click'), $.proxy(this.expandBtnClick, this));
            },
            expandBtnClick : function (e) {
                e.preventDefault();
                this.opts.activeAttr.expand = !this.opts.activeAttr.expand;
                if (this.opts.activeAttr.expand) {
                    this.animation.hide($.proxy(function () {
                        this.expandToggle();
                    }, this));
                } else {
                    this.animation.play($.proxy(function () {
                        this.expandToggle();
                    }, this));
                }
            },
            expandToggle : function () {
                this.orderPrice.toggleClass(this.opts.classAttr.hide, this.opts.activeAttr.expand);
            },
            activeExpand : function (type) {
                this.orderPrice.toggleClass(this.opts.classAttr.expand, type);
            },
            reset : function () {
                if (this.opts.activeAttr.expand) {
                    this.opts.activeAttr.expand = false;
                    this.animation.play($.proxy(function () {
                        this.expandToggle();
                    }, this));
                }
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.VisualItem = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                obj : container,
                isPlay : false,
                classAttr : {
                    active : 'is-active'
                },
                motionObj : null,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.initLayout();
                this.obj.data('VisualItem', this);
            },
            initLayout : function () {
                this.obj.hide();
            },
            play : function () {
                var _this = this;
                if (!this.opts.isPlay) {
                    this.obj.css({
                        'display' : '',
                        'opacity' : ''
                    });
                    this.opts.isPlay = true;
                    this.killMotion();
                }
                this.showMotion();
            },
            showMotion : function () {
                if (this.opts.motionObj == null) {
                    this.opts.motionObj = new win.g2.buildOrder.typeVisual(this.obj, {
                        on : {
                            start : $.proxy(function () {
                                this.outCallback('start');
                            }, this),
                            complete : $.proxy(function () {
                                this.outCallback('complete');
                            }, this)
                        }
                    });
                } else {
                    this.opts.motionObj.play();
                }
            },
            hideMotion : function (callback) {
                var cb = callback || function () {};
                if (this.opts.motionObj == null) return;
                this.opts.motionObj.hide(cb);
                this.opts.motionObj = null;
            },
            killMotion : function () {
                if (this.opts.motionObj == null) return;
                this.opts.motionObj.kill();
                this.opts.motionObj = null;
            },
            hide : function (callback) {
                this.opts.isPlay = false;
                this.hideMotion(callback);
            },
            update : function () {
                if (this.opts.motionObj == null) return;
                this.opts.motionObj.update();
            },
            kill : function () {
                this.opts.isPlay = false;
                this.killMotion();
                this.obj.hide();
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.typeVisual = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                obj : container,
                isPlay : false,
                motionObj : null,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        Component.prototype = {
            init : function () {
                this.play();
                this.obj.data('TypeVisual', this);
            },
            play : function (data) {
                var _this = this;
                if (!this.opts.isPlay) {
                    this.opts.isPlay = true;
                    this.killMotion();
                }
                this.showMotion();
            },
            showMotion : function () {
                if (this.opts.motionObj == null) {
                    this.opts.motionObj = new pluginVisual(this.obj, {
                        on : {
                            start : $.proxy(function () {
                                this.outCallback('start');
                            }, this),
                            complete : $.proxy(function () {
                                this.outCallback('complete');
                            }, this)
                        }
                    });
                } else {
                    this.opts.motionObj.play();
                }
            },
            hideMotion : function (callback) {
                var cb = callback || function () {};
                if (this.opts.motionObj == null) return;
                this.opts.motionObj.hide(cb);
                this.opts.motionObj = null;
            },
            killMotion : function () {
                if (this.opts.motionObj == null) return;
                this.opts.motionObj.kill();
                this.opts.motionObj = null;
            },
            hide : function (callback) {
                this.opts.isPlay = false;
                this.hideMotion(callback);
            },
            update : function () {
                if (this.opts.motionObj == null) return;
                this.opts.motionObj.update();
            },
            kill : function () {
                this.opts.isPlay = false;
                this.killMotion();
                this.obj.hide();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
            }
        };

        function pluginVisual (container, args) {
            var defParams = {
                obj : container,
                effect : 'default',
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        pluginVisual.prototype = {
            init : function () {
                this.initOpts();
                this.buildMotion();
                this.play();
            },
            initOpts : function () {
                if (this.obj.attr('data-animate-type') !== isUndefined) {
                    this.opts.effect = this.obj.attr('data-animate-type');
                }
            },
            buildMotion : function () {
                Util.def(this, {
                    motions : {
                        instance : null,
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            var instance = this.obj.data('PlugVisual'),
                                cb = callback || function () {};
                            var complete = $.proxy(function () {
                                this.motions.kill();
                                cb();
                            }, this);
                            instance.hide(complete, true);
                        }, this),
                        update : $.proxy(function () {
                            if (this.motions.instance == null) return;
                            this.motions.instance.update();
                        }, this),
                        kill : $.proxy(function () {
                            if (this.motions.instance == null) return;
                            this.motions.instance.kill();
                        }, this),
                        play : $.proxy(function () {
                            var _this = this;
                            var instance = this.obj.data('PlugVisual');
                            instance.play();
                        }, this)
                    }
                });

                var pluginName = '';

                switch(this.opts.effect) {
                    case 'blur':
                        pluginName = visualScale;
                        break;
                    case 'seat':
                        pluginName = visualSeat;
                        break;
                    case 'exterior_color':
                        pluginName = visualExteriorColor;
                        break;
                    case 'wheel':
                        pluginName = visualWheels;
                        break;
                    case 'interior_design':
                        pluginName = visualInteriorDesign;
                        break;
                    case 'package_option':
                        pluginName = visualPackageOption;
                        break;
                    case 'result':
                        pluginName = visualResult;
                        break;
                    case 'default_byo':
                        pluginName = visualDefaultBYO;
                        break;
                    case 'default':
                        pluginName = visualDefault;
                        break;
                }

                this.motions.instance = new pluginName(this.obj, {
                    effect : this.opts.effect,
                    on : {
                        start : $.proxy(function () {
                            this.outCallback('start');
                        }, this),
                        complete : $.proxy(function () {
                            this.motions.isActive = true;
                            this.outCallback('complete');
                        }, this)
                    }
                });
            },
            play : function () {
                this.motions.play();
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.motions.hide(cb);
            },
            update : function () {
                this.motions.update();
            },
            kill : function () {
                this.motions.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
            }
        };

        // scale
        function visualScale (container, args) {
            var defParams = {
                typeVisual : '.build-type-visual',
                classAttr : {
                    active : 'is-active'
                },
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualScale.prototype = {
            init : function () {
                this.setElements();
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            setElements : function () {
                this.typeVisual = this.obj.find(this.opts.typeVisual);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : [],
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.hide(cb);
                                }
                            }
                        }, this),
                        play : $.proxy(function () {
                            var activeTypeVisual = this.typeVisual.filter('.'+this.opts.classAttr.active),
                                instance = activeTypeVisual.data('VisualScale'),
                                playFunc = $.proxy(function () {
                                    this.outCallback('start');
                                    activeTypeVisual.siblings().hide();
                                    instance.play();
                                }, this);
                            if (activeTypeVisual.length) {
                                if (instance.opts.isPlay) {
                                    instance.play();
                                } else {
                                    if (this.contents.isActive) {
                                        this.contents.isActive = false;
                                        this.contents.hide(playFunc);
                                    } else {
                                        this.contents.kill();
                                        playFunc();
                                    }
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                oInstance.kill();
                            }
                        }, this)
                    }
                });
                for (var min = 0, max = this.typeVisual.length; min < max; min++) {
                    var typeVisual = this.typeVisual.eq(min);
                    this.contents.instance.push(new win.g2.btoStepPowertrain.VisualScale(typeVisual, {
                        on : {
                            complete : $.proxy(function () {
                                this.contents.isActive = true;
                                this.outCallback('complete');
                            }, this)
                        }
                    }));
                }
            },
            play : function () {
                this.contents.play();
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.contents.hide(cb);
            },
            update : function () {

            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // seat
        function visualSeat (container, args) {
            var defParams = {
                typeVisual : '.build-type-visual',
                classAttr : {
                    active : 'is-active'
                },
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualSeat.prototype = {
            init : function () {
                this.setElements();
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            setElements : function () {
                this.typeVisual = this.obj.find(this.opts.typeVisual);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : [],
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.hide(cb);
                                }
                            }
                        }, this),
                        play : $.proxy(function (speed) {
                            var activeTypeVisual = this.typeVisual.filter('.'+this.opts.classAttr.active),
                                instance = activeTypeVisual.data('VisualSeat'),
                                playFunc = $.proxy(function () {
                                    this.outCallback('start');
                                    instance.play(speed);
                                }, this);
                            if (activeTypeVisual.length) {
                                if (instance.opts.isPlay) {
                                    instance.play();
                                } else {
                                    if (this.contents.isActive) {
                                        this.contents.isActive = false;
                                        this.contents.hide();
                                        playFunc();
                                    } else {
                                        this.contents.kill();
                                        playFunc();
                                    }
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                oInstance.kill();
                            }
                        }, this)
                    }
                });
                for (var min = 0, max = this.typeVisual.length; min < max; min++) {
                    var typeVisual = this.typeVisual.eq(min);
                    this.contents.instance.push(new win.g2.btoStepPowertrain.VisualSeat(typeVisual, {
                        on : {
                            complete : $.proxy(function () {
                                this.contents.isActive = true;
                                this.outCallback('complete');
                            }, this),
                            hideComplete : $.proxy(function () {
                                this.contents.isActive = true;
                            }, this)
                        }
                    }));
                }
            },
            play : function () {
                if (this.contents.isActive) {
                    this.contents.play();
                } else {
                    this.contents.play(0);
                    TweenLite.fromTo(this.obj, (250 / 1000), {
                        opacity : 0
                    }, {
                        opacity : 1,
                        onComplete : $.proxy(function () {
                        }, this)
                    });
                }
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 1
                }, {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        cb();
                        this.contents.kill();
                    }, this)
                });
            },
            update : function () {

            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // exterior color
        function visualExteriorColor (container, args) {
            var defParams = {
                typeVisual : '.build-type-visual',
                classAttr : {
                    active : 'is-active'
                },
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualExteriorColor.prototype = {
            init : function () {
                this.setElements();
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            setElements : function () {
                this.typeVisual = this.obj.find(this.opts.typeVisual);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : null,
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            if (this.contents.instance == null) return;
                            this.contents.instance.hide();
                        }, this),
                        play : $.proxy(function (speed) {
                            if (this.contents.instance == null) return;
                            this.outCallback('start');
                            this.contents.instance.play(speed);
                        }, this),
                        kill : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.kill();
                        }, this)
                    }
                });
                this.contents.instance = new win.g2.btoStepExteriorDesign.visualExteriorColor(this.typeVisual, {
                    on : {
                        complete : $.proxy(function () {
                            this.contents.isActive = true;
                            this.outCallback('complete');
                        }, this)
                    }
                });
            },
            play : function () {
                if (this.contents.isActive) {
                    this.contents.play();
                } else {
                    this.contents.play(0);
                    TweenLite.fromTo(this.obj, (250 / 1000), {
                        opacity : 0
                    }, {
                        opacity : 1,
                        onComplete : $.proxy(function () {
                        }, this)
                    });
                }
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 1
                }, {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        cb();
                    }, this)
                });
            },
            update : function () {

            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // wheel
        function visualWheels (container, args) {
            var defParams = {
                typeVisual : '.build-type-visual',
                classAttr : {
                    active : 'is-active'
                },
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualWheels.prototype = {
            init : function () {
                this.setElements();
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            setElements : function () {
                this.typeVisual = this.obj.find(this.opts.typeVisual);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : [],
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.hide(cb);
                                }
                            }
                        }, this),
                        play : $.proxy(function (speed) {
                            var activeTypeVisual = this.typeVisual.filter('.'+this.opts.classAttr.active),
                                instance = activeTypeVisual.data('visualWheels'),
                                playFunc = $.proxy(function () {
                                    this.outCallback('start');
                                    instance.play(speed);
                                }, this);
                            if (activeTypeVisual.length) {
                                if (instance.opts.isPlay) {
                                    instance.play();
                                } else {
                                    if (this.contents.isActive) {
                                        this.contents.isActive = false;
                                        this.contents.hide();
                                        playFunc();
                                    } else {
                                        this.contents.kill();
                                        playFunc();
                                    }
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                oInstance.kill();
                            }
                        }, this)
                    }
                });
                for (var min = 0, max = this.typeVisual.length; min < max; min++) {
                    var typeVisual = this.typeVisual.eq(min);
                    this.contents.instance.push(new win.g2.btoStepExteriorDesign.visualWheels(typeVisual, {
                        on : {
                            complete : $.proxy(function () {
                                this.contents.isActive = true;
                                this.outCallback('complete');
                            }, this),
                            hideComplete : $.proxy(function () {
                                this.contents.isActive = true;
                            }, this)
                        }
                    }));
                }
            },
            play : function () {
                this.contents.play();
                this.contents.isActive = true;
                // if (this.contents.isActive) {
                //     this.contents.play();
                // } else {
                //     this.contents.play(0);
                //     TweenLite.fromTo(this.obj, (250 / 1000), {
                //         opacity : 0
                //     }, {
                //         opacity : 1,
                //         onComplete : $.proxy(function () {
                //         }, this)
                //     });
                // }
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    overflow : 'hidden',
                    opacity : 1
                }, {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        this.obj.css('overflow', '');
                        cb();
                        this.contents.kill();
                    }, this)
                });
            },
            update : function () {

            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // interior design
        function visualInteriorDesign (container, args) {
            var defParams = {
                typeVisual : '.build-type-visual',
                classAttr : {
                    active : 'is-active'
                },
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualInteriorDesign.prototype = {
            init : function () {
                this.setElements();
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            setElements : function () {
                this.typeVisual = this.obj.find(this.opts.typeVisual);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : null,
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            if (this.contents.instance == null) return;
                            this.contents.instance.hide();
                        }, this),
                        play : $.proxy(function (speed) {
                            if (this.contents.instance == null) return;
                            this.outCallback('start');
                            this.contents.instance.play(speed);
                        }, this),
                        kill : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.kill();
                        }, this)
                    }
                });
                this.contents.instance = new win.g2.btoStepInteriorDesign.visualInteriorDesign(this.typeVisual, {
                    on : {
                        complete : $.proxy(function () {
                            this.contents.isActive = true;
                            this.outCallback('complete');
                        }, this)
                    }
                });
            },
            play : function () {
                if (this.contents.isActive) {
                    this.contents.play();
                } else {
                    this.contents.play(0);
                    TweenLite.fromTo(this.obj, (250 / 1000), {
                        opacity : 0
                    }, {
                        opacity : 1,
                        onComplete : $.proxy(function () {
                        }, this)
                    });
                }
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 1
                }, {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        cb();
                    }, this)
                });
            },
            update : function () {
            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // package option
        function visualPackageOption (container, args) {
            var defParams = {
                typeVisual : '.build-type-visual',
                classAttr : {
                    active : 'is-active'
                },
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualPackageOption.prototype = {
            init : function () {
                this.setElements();
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            setElements : function () {
                this.typeVisual = this.obj.find(this.opts.typeVisual);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : [],
                        isActive : false,
                        hide : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.hide(cb);
                                }
                            }
                        }, this),
                        play : $.proxy(function (speed) {
                            var activeTypeVisual = this.typeVisual.filter('.'+this.opts.classAttr.active),
                                instance = activeTypeVisual.data('visualPackageOption'),
                                playFunc = $.proxy(function () {
                                    this.outCallback('start');
                                    activeTypeVisual.siblings().hide();
                                    instance.play(speed);
                                }, this);
                            if (activeTypeVisual.length) {
                                if (instance.opts.isPlay) {
                                    instance.play(speed);
                                } else {
                                    if (this.contents.isActive) {
                                        this.contents.isActive = false;
                                        this.contents.hide(playFunc);
                                    } else {
                                        this.contents.kill();
                                        playFunc();
                                    }
                                }
                            }
                        }, this),
                        update : $.proxy(function () {
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.update();
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.contents.instance.length; min < max; min++) {
                                var oInstance = this.contents.instance[min];
                                oInstance.kill();
                            }
                        }, this)
                    }
                });
                for (var min = 0, max = this.typeVisual.length; min < max; min++) {
                    var typeVisual = this.typeVisual.eq(min);
                    this.contents.instance.push(new win.g2.btoStepPackageOption.visualPackageOption(typeVisual, {
                        on : {
                            complete : $.proxy(function () {
                                this.contents.isActive = true;
                                this.outCallback('complete');
                            }, this)
                        }
                    }));
                }
            },
            play : function () {
                if (this.contents.isActive) {
                    this.contents.play();
                } else {
                    this.contents.play(0);
                    TweenLite.fromTo(this.obj, (250 / 1000), {
                        opacity : 0
                    }, {
                        opacity : 1,
                        onComplete : $.proxy(function () {
                        }, this)
                    });
                }
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.contents.hide(cb);
            },
            update : function () {
                this.contents.update();
            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // result
        function visualResult (container, args) {
            var defParams = {
                type : null,
                timeline : [],
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualResult.prototype = {
            init : function () {
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : null,
                        build : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.build();
                        }, this),
                        update : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.update();
                        }, this),
                        kill : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.kill();
                        }, this)
                    }
                });
                this.contents.instance = new win.g2.btoStepResult.Component(this.obj);
            },
            play : function () {
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 0
                }, {
                    opacity : 1,
                    display : '',
                    onComplete : $.proxy(function () {
                        this.contents.build();
                        this.outCallback('complete');
                    }, this)
                });
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 1
                }, {
                    opacity : 0,
                    display : 'none',
                    onComplete : $.proxy(function () {
                        cb();
                    }, this)
                });
            },
            update : function () {
                this.contents.update();
            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // vr
        function visualDefaultBYO (container, args) {
            var defParams = {
                type : null,
                timeline : [],
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualDefaultBYO.prototype = {
            init : function () {
                this.buildContents();
                this.obj.data('PlugVisual', this);
            },
            buildContents : function () {
                Util.def(this, {
                    contents : {
                        instance : null,
                        build : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.build();
                        }, this),
                        kill : $.proxy(function () {
                            if (this.contents.instance == null) return;
                            this.contents.instance.kill();
                        }, this)
                    }
                });
                this.contents.instance = new win.g2.byoStepDefault.Component(this.obj);
            },
            play : function () {
                this.outCallback('start');
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 0
                }, {
                    opacity : 1,
                    display : '',
                    onComplete : $.proxy(function () {
                        this.contents.build();
                        this.outCallback('complete');
                    }, this)
                });
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 1
                }, {
                    opacity : 0,
                    display : 'none',
                    onComplete : $.proxy(function () {
                        cb();
                    }, this)
                });
            },
            update : function () {

            },
            kill : function () {
                this.contents.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // default
        function visualDefault (container, args) {
            var defParams = {
                type : null,
                timeline : [],
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        visualDefault.prototype = {
            init : function () {
                this.obj.data('PlugVisual', this);
            },
            play : function () {
                this.outCallback('start');
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 0
                }, {
                    opacity : 1,
                    display : '',
                    onComplete : $.proxy(function () {
                        this.outCallback('complete');
                    }, this)
                });
            },
            hide : function (callback) {
                var cb = callback || function () {};
                TweenLite.fromTo(this.obj, (250 / 1000), {
                    opacity : 1
                }, {
                    opacity : 0,
                    display : 'none',
                    onComplete : $.proxy(function () {
                        cb();
                    }, this)
                });
            },
            update : function () {

            },
            kill : function () {
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.VisualWrap = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.build-order-visual__item',
                activeWrap : null,
                classAttr : {
                    active : 'is-active'
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.buildVisualItem();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
            },
            initLayout : function () {
                this.obj.hide();
            },
            buildVisualItem : function () {
                Util.def(this, {
                    visualitems : {
                        instance : [],
                        isActive : false,
                        allHide : $.proxy(function () {
                            for (var min = 0, max = this.visualitems.instance.length; min < max; min++) {
                                var oInstance = this.visualitems.instance[min];
                                oInstance.kill();
                            }
                        }, this),
                        hide : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            for (var min = 0, max = this.visualitems.instance.length; min < max; min++) {
                                var oInstance = this.visualitems.instance[min];
                                if (oInstance.opts.isPlay) {
                                    oInstance.hide(cb);
                                }
                            }
                        }, this),
                        update : $.proxy(function () {
                            for (var min = 0, max = this.visualitems.instance.length; min < max; min++) {
                                var oInstance = this.visualitems.instance[min];
                                oInstance.update();
                            }
                        }, this),
                        play : $.proxy(function () {
                            var visualItem = this.opts.activeWrap.find(this.opts.visualItem),
                                activeOptionItem = visualItem.filter('.'+this.opts.classAttr.active),
                                instance = activeOptionItem.data('VisualItem'),
                                playFunc = $.proxy(function () {
                                    this.outCallback('start');
                                    this.opts.activeWrap.css('display', '');
                                    this.obj.not(this.opts.activeWrap).hide();
                                    instance.play();
                                }, this);
                            if (activeOptionItem.length) {
                                if (instance.opts.isPlay) {
                                    instance.play();
                                } else {
                                    if (this.visualitems.isActive) {
                                        this.visualitems.isActive = false;
                                        for (var min = 0, max = this.visualitems.instance.length; min < max; min++) {
                                            var oInstance = this.visualitems.instance[min];
                                            if (oInstance.opts.isPlay) {
                                                oInstance.hide(playFunc);
                                            }
                                        }
                                    } else {
                                        this.visualitems.allHide();
                                        playFunc();
                                    }
                                }
                            }
                        }, this)
                    }
                });
                var build = $.proxy(function (obj, min) {
                    this.visualitems.instance.push(new win.g2.buildOrder.VisualItem(obj, {
                        on : {
                            start : $.proxy(function () {
                                var activeItem = this.visualItem.filter('.is-active');
                                this.visualItem.not(activeItem).hide();
                            }, this),
                            complete : $.proxy(function () {
                                this.visualitems.isActive = true;
                                this.outCallback('complete');
                            }, this)
                        }
                    }));
                }, this);
                for (var min = 0, max = this.visualItem.length; min < max; min++) {
                    var visualItem = this.visualItem.eq(min);
                    build(visualItem, min);
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
                this.obj.on(this.changeEvents('visualview'), $.proxy(this.startView, this));
                this.obj.on(this.changeEvents('visualhide'), $.proxy(this.startHide, this));
                this.obj.on(this.changeEvents('visualupdate'), $.proxy(this.startUpdate, this));
            },
            startView : function (e) {
                this.opts.activeWrap = $(e.currentTarget);
                this.play();
            },
            play : function () {
                this.visualitems.play();
            },
            startHide : function (e, data) {
                this.hide(data.complete);
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.visualitems.hide(cb);
            },
            startUpdate : function (e) {
                this.visualitems.update();
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.byoStepDefault = global.g2.byoStepDefault || {};
    global.g2.byoStepDefault.Component = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                foldTxtWrap : '.fold-text-wrap',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
            },
            setElements : function () {
                this.foldTxtWrap = this.obj.find(this.opts.foldTxtWrap);
            },
            build : function () {
                this.buildFoldTxt();
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
                        }, this)
                    }
                });
                for (var min = 0, max = this.foldTxtWrap.length; min < max; min++) {
                    var obj = this.foldTxtWrap.eq(min);
                    this.foldtxt.instance.push(new visualContentsFoldTxt(obj));
                }
            },
            kill : function () {
                this.foldtxt.kill();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        function visualContentsFoldTxt (container, args) {
            var defParams = {
                obj : container,
                foldInnerBtn : '.fold-text-btn',
                foldDescWrap : '.fold-desc-wrap',
                foldDescInner : '.fold-desc-inner',
                classAttr : {
                    active : 'is-active'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                isFoldActive : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        visualContentsFoldTxt.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
            },
            setElements : function () {
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
                    this.foldInnerBtn.on(this.changeEvents('click'), $.proxy(this.foldInnerBtnClick, this));
                } else {
                    this.foldInnerBtn.off(this.changeEvents('click'));
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
                this.obj.toggleClass(this.opts.classAttr.active, this.opts.isFoldActive);
                if (this.obj.hasClass(this.opts.classAttr.active)) {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'true');
                } else {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'false');
                }
            },
            foldLayout : function (type, speed) {
                var foldDescInnerHeight = this.foldDescInner.outerHeight(true);
                if (type) {
                    this.foldDescWrap.css('height', foldDescInnerHeight);
                } else {
                    this.foldDescWrap.css('height', '');
                }
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isFoldActive = false;
                this.obj.removeClass(this.opts.classAttr.active);
                this.foldInnerBtn.attr(this.opts.ariaAttr.expanded, 'false');
                this.foldDescWrap.css('height', '');
            }
        };

        return Component;
    })();
    return Component;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepExteriorDesign = global.g2.btoStepExteriorDesign || {};
    global.g2.btoStepExteriorDesign.visualExteriorColor = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
                this.buildPictureImg();
                this.obj.data('visualExteriorColor', this);
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
            },
            buildPictureImg : function () {
                var jsBoPictures = this.obj.find('.js-bo-picture');
                for (var min = 0, max = jsBoPictures.length; min < max; min++) {
                    (function (index) {
                        var jsBoPicture = jsBoPictures.eq(index);
                        if (jsBoPicture.attr('data-load') != 'true') {
                            jsBoPicture.attr('data-load', 'true');
                            new PictureImg(jsBoPicture);
                        }
                    })(min);
                }
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            play : function (speed) {
                var clipDuration = (speed == isUndefined) ? (1000 / 1000) : 0;
                var duration = (speed == isUndefined) ? (250 / 1000) : 0;
                var activeVisual = this.obj.filter('.is-active'),
                    activeItem = activeVisual.find(this.opts.visualItem).filter('.is-active'),
                    infoDisc = activeItem.find('.build-text'),
                    prevItem = this.visualItem.filter(':visible').not(activeItem),
                    prevInfoDisc = prevItem.find('.build-text');
                this.opts.isPlay = true;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].progress(1).kill();
                }
                this.opts.playStep = [];
                this.visualItem.css('zIndex', '');
                activeVisual.css({
                    zIndex : 10,
                    display : ''
                });
                activeItem.css({
                    zIndex : 10,
                    display :  ''
                });
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                activeItem.find('.build-text').css('opacity', '');
                var activeWidth = activeItem.outerWidth(true);
                var activeHeight = activeItem.outerHeight(true);
                var step1 = TweenLite.fromTo(activeItem, clipDuration, {
                    clip : 'rect(0px 0px ' + activeHeight + 'px 0px)'
                }, {
                    clip : 'rect(0px ' + activeWidth + 'px ' + activeHeight + 'px 0px)',
                    ease : Expo.easeInOut,
                    onComplete : $.proxy(function () {
                        this.obj.not(activeVisual).hide();
                        this.visualItem.not(activeItem).hide();
                        activeVisual.css('zIndex', '');
                        activeItem.css({
                            zIndex : '',
                            clip : ''
                        });
                        this.outCallback('complete');
                    }, this)
                });
                var step2 = new TimelineMax();
                step2.to(prevInfoDisc, duration, {
                    opacity : 0
                });
                step2.fromTo(infoDisc, duration, {
                    opacity : 0,
                    y : 10
                }, {
                    delay : duration,
                    opacity : 1,
                    y : 0
                });
                this.opts.playStep.push(step1);
                this.opts.playStep.push(step2);
            },
            hide : function (callback) {
                // this.bindEvents(false);
                // this.opts.isPlay = false;
                // for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                //     this.opts.playStep[i].progress(1).kill();
                // }
                // this.opts.playStep = [];
                // this.obj.show().css({
                //     'zIndex' : ''
                // });
                // var cb = callback || function () {};
                // var infoDisc = this.obj.find('.build-text');
                // var step1 = TweenLite.to(infoDisc, (250 / 1000), {
                //     opacity : 0
                // });
                // cb();
                // this.outCallback('complete');
                // this.opts.hideStep.push(step1);
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepExteriorDesign = global.g2.btoStepExteriorDesign || {};
    global.g2.btoStepExteriorDesign.visualWheels = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null,
                    hideComplete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.obj.data('visualWheels', this);
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
            },
            initLayout : function () {
                this.obj.hide();
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            play : function (speed) {
                var rotateDuration = (speed == isUndefined) ? (1500 / 1000) : 0;
                var duration = (speed == isUndefined) ? (250 / 1000) : 0;
                var activeItem = this.visualItem.filter('.is-active'),
                    infoItem = activeItem.find('.build-type-img'),
                    infoDisc = activeItem.find('.build-text');
                this.opts.isPlay = true;
                this.bindEvents(true);
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].progress(1).kill();
                }
                this.opts.playStep = [];
                this.obj.css({
                    'display' : '',
                    'zIndex' : 10
                });
                this.visualItem.css('zIndex', '');
                activeItem.css({
                    zIndex : 10,
                    display :  ''
                });
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                activeItem.find('.build-text').css('opacity', '');
                var initStart = $.proxy(function () {
                    var halfSize = this.obj.outerWidth(true) / 2,
                        infoItemSize = infoItem.outerHeight(true) / 2;
                    return halfSize + infoItemSize;
                }, this);
                var step1 = new TimelineMax();
                step1.fromTo(infoItem, rotateDuration, {
                    opacity : 0,
                    x : initStart(),
                    rotation : 240
                }, {
                    opacity : 1,
                    x : 0,
                    rotation : 0
                });
                step1.fromTo(infoDisc, duration, {
                    opacity : 0,
                    y : 10
                }, {
                    opacity : 1,
                    y : 0,
                    onComplete : $.proxy(function () {
                        this.visualItem.not(activeItem).hide();
                        this.obj.css('zIndex', '');
                        activeItem.css({
                            zIndex : ''
                        });
                        this.outCallback('hideComplete');
                        this.outCallback('complete');
                    }, this)
                });
                this.opts.playStep.push(step1);
            },
            hide : function (callback) {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].progress(1).kill();
                }
                this.opts.playStep = [];
                this.obj.hide();
                var cb = callback || function () {};
                var infoDisc = this.obj.find('.build-text');
                cb();
                this.outCallback('hideComplete');
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepInteriorDesign = global.g2.btoStepInteriorDesign || {};
    global.g2.btoStepInteriorDesign.visualInteriorDesign = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                cmLayer : '.cm-layer',
                foldTxtWrap : '.fold-text-wrap',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
                this.buildPictureImg();
                this.buildLayer();
                this.buildFoldTxt();
                this.obj.data('visualInteriorDesign', this);
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
                this.cmLayer = this.obj.find(this.opts.cmLayer);
                this.foldTxtWrap = this.obj.find(this.opts.foldTxtWrap);
            },
            buildPictureImg : function () {
                var jsBoPictures = this.obj.find('.js-bo-picture');
                for (var min = 0, max = jsBoPictures.length; min < max; min++) {
                    (function (index) {
                        var jsBoPicture = jsBoPictures.eq(index);
                        if (jsBoPicture.attr('data-load') != 'true') {
                            jsBoPicture.attr('data-load', 'true');
                            new PictureImg(jsBoPicture);
                        }
                    })(min);
                }
            },
            buildLayer : function () {
                Util.def(this, {
                    layer : {
                        instance : [],
                        hide : $.proxy(function () {
                            for (var min = 0, max = this.layer.instance.length; min < max; min++) {
                                var instance = this.layer.instance[min];
                                if (instance.opts.isOpened) {
                                    instance.close();
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.layer.instance.length; min < max; min++) {
                                this.layer.instance[min].kill();
                            }
                            this.layer.instance = [];
                        }, this)
                    }
                });
                for (var min = 0, max = this.cmLayer.length; min < max; min++) {
                    var obj = this.cmLayer.eq(min);
                    this.layer.instance.push(new visualInteriorDesignContentsLayer(obj));
                }
            },
            buildFoldTxt : function () {
                Util.def(this, {
                    foldtxt : {
                        instance : [],
                        hide : $.proxy(function () {
                            for (var min = 0, max = this.foldtxt.instance.length; min < max; min++) {
                                var instance = this.foldtxt.instance[min];
                                if (instance.opts.isFoldActive) {
                                    instance.close();
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.foldtxt.instance.length; min < max; min++) {
                                this.foldtxt.instance[min].kill();
                            }
                            this.foldtxt.instance = [];
                        }, this)
                    }
                });
                for (var min = 0, max = this.foldTxtWrap.length; min < max; min++) {
                    var obj = this.foldTxtWrap.eq(min);
                    this.foldtxt.instance.push(new visualInteriorDesignContentsFoldTxt(obj));
                }
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            play : function (speed) {
                var clipDuration = (speed == isUndefined) ? (1000 / 1000) : 0;
                var duration = (speed == isUndefined) ? (250 / 1000) : 0;
                var activeVisual = this.obj.filter('.is-active'),
                    activeItem = activeVisual.find(this.opts.visualItem).filter('.is-active'),
                    infoDisc = activeItem.find('.build-text'),
                    prevItem = this.visualItem.filter(':visible').not(activeItem),
                    prevInfoDisc = prevItem.find('.build-text');
                this.opts.isPlay = true;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].progress(1).kill();
                }
                this.opts.playStep = [];
                this.visualItem.css('zIndex', '');
                activeVisual.css({
                    zIndex : 10,
                    display : ''
                });
                activeItem.css({
                    zIndex : 10,
                    display :  ''
                });
                this.foldtxt.hide();
                this.layer.hide();
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                activeItem.find('.build-text').css('opacity', '');
                var activeWidth = activeItem.outerWidth(true);
                var activeHeight = activeItem.outerHeight(true);
                var step1 = TweenLite.fromTo(activeItem, clipDuration, {
                    clip : 'rect(0px 0px ' + activeHeight + 'px 0px)'
                }, {
                    clip : 'rect(0px ' + activeWidth + 'px ' + activeHeight + 'px 0px)',
                    ease : Expo.easeInOut,
                    onComplete : $.proxy(function () {
                        this.obj.not(activeVisual).hide();
                        this.visualItem.not(activeItem).hide();
                        activeVisual.css('zIndex', '');
                        activeItem.css({
                            zIndex : '',
                            clip : ''
                        });
                        this.outCallback('complete');
                    }, this)
                });
                var step2 = new TimelineMax();
                step2.to(prevInfoDisc, duration, {
                    opacity : 0
                });
                step2.fromTo(infoDisc, duration, {
                    opacity : 0,
                    y : 10
                }, {
                    delay : duration,
                    opacity : 1,
                    y : 0
                });
                this.opts.playStep.push(step1);
                this.opts.playStep.push(step2);
            },
            hide : function (callback) {
                // this.bindEvents(false);
                // this.opts.isPlay = false;
                // for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                //     this.opts.playStep[i].progress(1).kill();
                // }
                // this.opts.playStep = [];
                // this.obj.show().css({
                //     'zIndex' : ''
                // });
                // var cb = callback || function () {};
                // var infoDisc = this.obj.find('.build-text');
                // var step1 = TweenLite.to(infoDisc, (250 / 1000), {
                //     opacity : 0
                // });
                // cb();
                // this.outCallback('complete');
                // this.opts.hideStep.push(step1);
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.layer.kill();
                this.foldtxt.kill();
                this.opts.hideStep = [];
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        function visualInteriorDesignContentsLayer (container, args) {
            var defParams = {
                obj : container,
                videoObj : null,
                layerInstance : null,
                videoFrame : '.cp-video__frame',
                isOpened : false,
                isPlaying : false,
                isKill : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    active : null,
                    deactive : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        visualInteriorDesignContentsLayer.prototype = {
            init : function () {
                this.setElements();
                this.buildVideo();
                this.buildLayer();
                this.bindCallBackEvents(true);
            },
            setElements : function () {
                this.videoFrame = this.obj.find(this.opts.videoFrame);
            },
            buildVideo : function () {
                this.opts.videoObj = new HiveVideo(this.videoFrame);
            },
            buildLayer : function () {
                this.opts.layerInstance = new HiveLayer(this.obj);
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindCallBackEvents : function (type) {
                if (type) {
                    this.obj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                    this.obj.on(this.changeEvents('layerOpenAfter'), $.proxy(this.openAfterFunc, this));
                    this.obj.on(this.changeEvents('layerCloseBefore'), $.proxy(this.closeBeforeFunc, this));
                    this.obj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
                } else {
                    this.obj.off(this.changeEvents('layerOpenBefore'));
                    this.obj.off(this.changeEvents('layerOpenAfter'));
                    this.obj.off(this.changeEvents('layerCloseBefore'));
                    this.obj.off(this.changeEvents('layerCloseAfter'));
                }
            },
            openBeforeFunc : function () {
                this.opts.isOpened = true;
            },
            openAfterFunc : function () {
                this.outCallback('active');
                this.play();
            },
            closeBeforeFunc : function () {
                this.opts.isOpened = false;
            },
            closeAfterFunc : function () {
                this.pause();
                if (this.opts.isKill) {
                    this.bindCallBackEvents(false);
                }
                this.outCallback('deactive');
            },
            play : function () {
                if (this.opts.isPlaying) return;
                this.opts.isPlaying = true;
                var videoObj = this.opts.videoObj;
                videoObj.play();
            },
            pause : function () {
                if (!this.opts.isPlaying) return;
                this.opts.isPlaying = false;
                var videoObj = this.opts.videoObj;
                videoObj.pause();
            },
            close : function () {
                this.obj.trigger('closeLayer');
            },
            kill : function () {
                this.opts.isKill = true;
                this.obj.trigger('closeLayer');
                this.opts.layerInstance.destroy();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        function visualInteriorDesignContentsFoldTxt (container, args) {
            var defParams = {
                obj : container,
                foldInnerBtn : '.fold-text-btn',
                foldDescWrap : '.fold-desc-wrap',
                foldDescInner : '.fold-desc-inner',
                classAttr : {
                    active : 'is-active'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                isFoldActive : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        visualInteriorDesignContentsFoldTxt.prototype = {
            init : function () {
                this.setElements();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
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
                this.obj.toggleClass(this.opts.classAttr.active, this.opts.isFoldActive);
                if (this.obj.hasClass(this.opts.classAttr.active)) {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'true');
                } else {
                    targetBtn.attr(this.opts.ariaAttr.expanded, 'false');
                }
            },
            foldLayout : function (type, speed) {
                var foldDescInnerHeight = this.foldDescInner.outerHeight(true);
                if (type) {
                    this.foldDescWrap.css('height', foldDescInnerHeight);
                } else {
                    this.foldDescWrap.css('height', '');
                }
            },
            close : function () {
                this.foldInnerBtn.triggerHandler(this.changeEvents('click'));
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isFoldActive = false;
                this.obj.removeClass(this.opts.classAttr.active);
                this.foldInnerBtn.attr(this.opts.ariaAttr.expanded, 'false');
                this.foldDescWrap.css('height', '');
            }
        };

        return Component;
    })();
    return Component;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepPackageOption = global.g2.btoStepPackageOption || {};
    global.g2.btoStepPackageOption.visualPackageOption = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                cmLayer : '.cm-layer',
                visualTab : '.visual-tab',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildLayer();
                this.buildTab();
                this.bindEvents(true);
                this.obj.data('visualPackageOption', this);
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
                this.cmLayer = this.obj.find(this.opts.cmLayer);
                this.visualTab = this.obj.find(this.opts.visualTab);
            },
            buildLayer : function () {
                Util.def(this, {
                    layer : {
                        instance : [],
                        hide : $.proxy(function () {
                            for (var min = 0, max = this.layer.instance.length; min < max; min++) {
                                var instance = this.layer.instance[min];
                                if (instance.opts.isOpened) {
                                    instance.close();
                                }
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.layer.instance.length; min < max; min++) {
                                this.layer.instance[min].kill();
                            }
                            this.layer.instance = [];
                        }, this),
                        build : $.proxy(function () {
                            for (var min = 0, max = this.cmLayer.length; min < max; min++) {
                                var obj = this.cmLayer.eq(min);
                                this.layer.instance.push(new visualPackageOptionContentsLayer(obj));
                            }
                        }, this)
                    }
                });
            },
            buildTab : function () {
                Util.def(this, {
                    foldtxt : {
                        instance : [],
                        update : $.proxy(function () {
                            for (var min = 0, max = this.foldtxt.instance.length; min < max; min++) {
                                this.foldtxt.instance[min].update();
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.foldtxt.instance.length; min < max; min++) {
                                this.foldtxt.instance[min].kill();
                            }
                            this.foldtxt.instance = [];
                        }, this),
                        build : $.proxy(function () {
                            for (var min = 0, max = this.visualTab.length; min < max; min++) {
                                var obj = this.visualTab.eq(min);
                                this.foldtxt.instance.push(new visualPackageOptionContentsTab(obj));
                            }
                        }, this)
                    }
                });
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            play : function (speed) {
                var duration = speed == isUndefined ? (250 / 1000) : 0;
                var delay = speed == isUndefined ? (100 / 1000) : 0;
                this.obj.css({
                    'display' : '',
                    'opacity' : ''
                });
                this.bindEvents(true);
                this.layer.build();
                this.foldtxt.build();
                this.visualItem.css('display', '');
                this.opts.isPlay = true;
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                var buildImg = this.obj.find('.visual-tab-swiper-wrap');
                var infoDisc = this.obj.find('.visual-tab__content-wrap');
                var step1 = TweenLite.fromTo(buildImg, duration, {
                    opacity : 0,
                    left : 30
                }, {
                    display : '',
                    opacity : 1,
                    left : 0
                });
                var step2 = TweenLite.fromTo(infoDisc, duration, {
                    opacity : 0,
                    left : 30
                }, {
                    delay : delay,
                    opacity : 1,
                    left : 0,
                    onComplete : $.proxy(function () {
                        this.outCallback('complete');
                    }, this)
                });
                this.opts.playStep.push(step1);
                this.opts.playStep.push(step2);
            },
            hide : function (callback) {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                this.layer.kill();
                this.foldtxt.kill();
                var cb = callback || function () {};
                var buildImg = this.obj.find('.visual-tab-swiper-wrap');
                var infoDisc = this.obj.find('.visual-tab__content-wrap');
                var step1 = TweenLite.to(buildImg, (150 / 1000), {
                    opacity : 0
                });
                var step2 = TweenLite.to(infoDisc, (150 / 1000), {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        this.obj.hide();
                        this.visualItem.hide();
                        cb();
                        // this.outCallback('complete');
                    }, this)
                });
                this.opts.hideStep.push(step1);
                this.opts.hideStep.push(step2);
            },
            update : function () {
                this.foldtxt.update();
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.layer.kill();
                this.foldtxt.kill();
                this.opts.hideStep = [];
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        function visualPackageOptionContentsLayer (container, args) {
            var defParams = {
                obj : container,
                videoObj : null,
                layerInstance : null,
                videoFrame : '.cp-video__frame',
                isOpened : false,
                isPlaying : false,
                isKill : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    active : null,
                    deactive : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        visualPackageOptionContentsLayer.prototype = {
            init : function () {
                this.setElements();
                this.buildVideo();
                this.buildLayer();
                this.bindCallBackEvents(true);
            },
            setElements : function () {
                this.videoFrame = this.obj.find(this.opts.videoFrame);
            },
            buildVideo : function () {
                this.opts.videoObj = new HiveVideo(this.videoFrame);
            },
            buildLayer : function () {
                this.opts.layerInstance = new HiveLayer(this.obj);
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindCallBackEvents : function (type) {
                if (type) {
                    this.obj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                    this.obj.on(this.changeEvents('layerOpenAfter'), $.proxy(this.openAfterFunc, this));
                    this.obj.on(this.changeEvents('layerCloseBefore'), $.proxy(this.closeBeforeFunc, this));
                    this.obj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
                } else {
                    this.obj.off(this.changeEvents('layerOpenBefore'));
                    this.obj.off(this.changeEvents('layerOpenAfter'));
                    this.obj.off(this.changeEvents('layerCloseBefore'));
                    this.obj.off(this.changeEvents('layerCloseAfter'));
                }
            },
            openBeforeFunc : function () {
                this.opts.isOpened = true;
            },
            openAfterFunc : function () {
                this.outCallback('active');
                this.play();
            },
            closeBeforeFunc : function () {
                this.opts.isOpened = false;
            },
            closeAfterFunc : function () {
                this.pause();
                if (this.opts.isKill) {
                    this.bindCallBackEvents(false);
                }
                this.outCallback('deactive');
            },
            play : function () {
                if (this.opts.isPlaying) return;
                this.opts.isPlaying = true;
                var videoObj = this.opts.videoObj;
                videoObj.play();
            },
            pause : function () {
                if (!this.opts.isPlaying) return;
                this.opts.isPlaying = false;
                var videoObj = this.opts.videoObj;
                videoObj.pause();
            },
            close : function () {
                this.obj.trigger('closeLayer');
            },
            kill : function () {
                this.opts.isKill = true;
                this.obj.trigger('closeLayer');
                this.opts.isOpened = false;
                this.opts.layerInstance.destroy();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        function visualPackageOptionContentsTab (container, args) {
            var defParams = {
                obj : container,
                carouselWrap : '.visual-tab-swiper-wrap',
                carouselContainer : '.swiper-container',
                carouselOpts : {
                    init : false,
                    slidesPerView : 'auto',
                    freeMode : true
                },
                visualTab : '.visual-tab__btn',
                visualTabList : '>ul',
                visualTabBtn : '.btn-tab',
                visualTabPanelWrap : '.visual-tab__content-wrap',
                visualTabPanel : '.visual-tab__content',
                props : {},
                currentIndex : 0,
                classAttr : {
                    active : 'is-active'
                },
                timeline : [],
                sizeAttr : {
                    swiper : null
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        visualPackageOptionContentsTab.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.initDatas();
                this.initLayout();
                this.buildSwiper();
                this.buildActiveBar();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.visualTab = this.obj.find(this.opts.visualTab);
                this.visualTabList = this.visualTab.find(this.opts.visualTabList);
                this.visualTabChild = this.visualTabList.children();
                this.visualTabBtns = this.visualTabList.find(this.opts.visualTabBtn);
                this.visualTabPanelWrap = this.obj.find(this.opts.visualTabPanelWrap);
                this.visualTabPanel = this.visualTabPanelWrap.find(this.opts.visualTabPanel);
            },
            initOpts : function () {
                var visualTabChild = this.visualTabChild,
                    activeChild = visualTabChild.filter('.' + this.opts.classAttr.active);
                if (activeChild.length) {
                    this.opts.currentIndex = activeChild.index();
                }
            },
            initDatas : function () {
                for (var linkMin = 0, linkMax = this.visualTabBtns.length; linkMin < linkMax; linkMin++) {
                    var visualTabBtn = this.visualTabBtns.eq(linkMin),
                        visualTabPanel = this.visualTabPanel.eq(linkMin);
                    if (visualTabBtn.length) {
                        this.opts.props[linkMin] = {
                            'LI' : visualTabBtn.closest('li'),
                            'TAB' : visualTabBtn,
                            'PANEL' : visualTabPanel,
                            'isActive' : false
                        };
                    }
                }
            },
            initLayout : function () {
                this.opts.props[this.opts.currentIndex]['LI'].addClass(this.opts.classAttr.active);
                this.opts.props[this.opts.currentIndex]['PANEL'].css('display', '');
                this.opts.props[this.opts.currentIndex]['isActive'] = true;
            },
            buildSwiper : function () {
                Util.def(this, {
                    carousel : {
                        instance : null,
                        update : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            win.clearTimeout(this.carousel.updatetime);
                            this.carousel.updatetime = win.setTimeout($.proxy(function () {
                                this.carousel.instance.update();
                                this.carousel.slideto(this.visualTabChild.filter('.'+this.opts.classAttr.active));
                            }, this), 30);
                        }, this),
                        slideto : $.proxy(function (target) {
                            if (this.carousel.instance == null) return;
                            var currentTranslate = this.carousel.instance.translate,
                                currentTranslate = isNaN(currentTranslate) ? 0 : currentTranslate,
                                targetW = target.outerWidth(),
                                targetL = target.offset().left,
                                orderNavStepW = this.carouselWrap.outerWidth(),
                                orderNavStepL = this.carouselWrap.offset().left,
                                totalPosition = orderNavStepL + (orderNavStepW / 2) - (targetW / 2),
                                _position = currentTranslate + totalPosition - targetL;
                            this.carousel.instance.translateTo(_position);
                        }, this),
                        build : $.proxy(function () {
                            Util.def(this.opts.carouselOpts, {
                                on : {
                                    init : $.proxy(function () {
                                        win.setTimeout($.proxy(function () {
                                            this.carousel.instance.update();
                                        }, this), 150);
                                    }, this)
                                }
                            });
                            this.carousel.instance = new Swiper(this.carouselContainer, this.opts.carouselOpts);
                            this.carousel.instance.init();
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.instance.destroy(true, true);
                            this.carousel.instance = null;
                        }, this)
                    }
                });
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
                    this.visualTabBtns.on(this.changeEvents('click'), $.proxy(this.visualTabBtnClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.visualTabBtns.off(this.changeEvents('click'));
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
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.sizeAttr.swiper !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.sizeAttr.swiper = RESPONSIVE.TABLET3.NAME;
                        this.carousel.build();
                    }
                } else {
                    if (this.opts.sizeAttr.swiper !== 'OTHER') {
                        this.opts.sizeAttr.swiper = 'OTHER';
                        this.carousel.destroy();
                    }
                }
                this.activebar.update();
            },
            visualTabBtnClick : function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    _index = this.visualTabBtns.index(_target);
                this.carousel.slideto(_target);
                this.controlSlideTo(_index);
            },
            slideTo : function (index, speed) {
                var _this = this,
                    props = this.opts.props,
                    prop = props[index],
                    classAttr = this.opts.classAttr;
                var step1 = new TimelineMax();
                var allClose = $.proxy(function (index) {
                    for (var pKey in props) {
                        (function (key) {
                            var prop = props[key];
                            if ((key != index) && prop['isActive']) {
                                prop['isActive'] = false;
                                prop['LI'].removeClass(classAttr.active);
                                step1.to(prop['PANEL'], (150 / 1000), {
                                    opacity : 0,
                                    display : 'none'
                                });
                            }
                        })(pKey);
                    }
                }, this);
                if (!prop['isActive']) {
                    allClose(index);
                    this.activebar.reset();
                    prop['isActive'] = true;
                    prop['LI'].addClass(classAttr.active);
                    step1.fromTo(prop['PANEL'], (250 / 1000), {
                        opacity : 0,
                    }, {
                        opacity : 1,
                        display : '',
                        onComplete : $.proxy(function () {
                            this.activebar.play(index);
                        }, this)
                    });
                }
                this.opts.timeline.push(step1);
                this.opts.currentIndex = index;
            },
            controlSlideTo : function (index) {
                var props = this.opts.props,
                    prop = props[index];
                if (!prop['isActive']) {
                    this.slideTo(index);
                }
            },
            buildActiveBar : function () {
                Util.def(this, {
                    activebar : {
                        instance : null,
                        play : $.proxy(function (num, speed) {
                            if (this.activebar.instance == null) return;
                            this.activebar.instance.play(num);
                        }, this),
                        reset : $.proxy(function (speed) {
                            if (this.activebar.instance == null) return;
                            this.activebar.instance.reset();
                        }, this),
                        update : $.proxy(function () {
                            if (this.activebar.instance == null) return;
                            this.activebar.instance.update();
                        }, this)
                    }
                });
                if (this.visualTabBtns.length) {
                    this.activebar.instance = new ActiveBar(this.obj, {
                        props : this.opts.props,
                        activeIndex : this.opts.currentIndex
                    });
                }
            },
            update : function () {
                this.carousel.update();
                this.activebar.update();
            },
            kill : function () {
                for (var min = 0, max = this.opts.timeline.length; min < max; min++) {
                    this.opts.timeline[min].progress(1).kill();
                }
                this.carousel.destroy();
                this.bindEvents(false);
            }
        };
        function ActiveBar (container, args) {
            if (!(this instanceof ActiveBar)) {
                return new ActiveBar(container, args);
            }
            var defParams = {
                barLine : '.visual-tab__btn',
                barLineActive : '.visual-tab-line',
                props : {},
                speed : 300,
                activeIndex : null
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        ActiveBar.prototype = {
            init : function () {
                this.setElements();
            },
            setElements : function () {
                this.barLine = this.obj.find(this.opts.barLine);
                this.barLineActive = this.barLine.find(this.opts.barLineActive);
            },
            setLayout : function () {
                this.winWidth = Util.winSize().w;
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.viewType !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.viewType = RESPONSIVE.TABLET3.NAME;
                        this.barLineActive.css({
                            'top' : '',
                            'height' : '',
                            'bottom' : ''
                        });
                    }
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                        this.barLineActive.css({
                            'left' : '',
                            'width' : '',
                            'bottom' : ''
                        });
                    }
                }
            },
            buildData : function (index) {
                this.setLayout();
                var isTablet = (this.opts.viewType === RESPONSIVE.TABLET3.NAME),
                    props = this.opts.props,
                    prop = props[index],
                    propOffsetTop = isTablet ? prop['LI'].offset().left : prop['LI'].offset().top,
                    propHeight = isTablet ? prop['LI'].outerWidth() : prop['LI'].outerHeight(),
                    barLineOffsetTop = isTablet ? this.obj.offset().left : this.obj.offset().top,
                    tweenOpts = {};
                if (isTablet) {
                    var moFixWrapLeft = this.obj.closest('.build-order-visual__wrap').offset().left;
                    var scrollLeft = this.barLine.offset().left;
                    tweenOpts = {
                        left : propOffsetTop - barLineOffsetTop - scrollLeft + moFixWrapLeft,
                        width : propHeight
                    };
                } else {
                    tweenOpts = {
                        top : propOffsetTop - barLineOffsetTop,
                        height : propHeight
                    };
                }
                return tweenOpts;
            },
            play : function (num, speed) {
                var tweenOpts = this.buildData(num);
                var speed = (speed == isUndefined) ? this.opts.speed : speed;
                tweenOpts['force3D']  = !0;
                TweenLite.to(this.barLineActive, speed / 1000, tweenOpts);
                this.opts.activeIndex = num;
            },
            reset : function (speed) {
                // var isTablet = (this.opts.viewType === RESPONSIVE.TABLET3.NAME),
                //     speed = (speed == isUndefined) ? this.opts.speed : speed,
                //     tweenOpts = {};
                // if (isTablet) {
                //     tweenOpts = {
                //         left : 0,
                //         width : '100%',
                //         force3D : !0
                //     };
                // } else {
                //     tweenOpts = {
                //         top : 0,
                //         height : '100%',
                //         force3D : !0
                //     };
                // }
                // TweenLite.to(this.barLineActive, speed / 1000, tweenOpts);
            },
            update : function () {
                if (this.opts.activeIndex == null) return;
                var tweenOpts = this.buildData(this.opts.activeIndex);
                TweenLite.set(this.barLineActive, tweenOpts);
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepPowertrain = global.g2.btoStepPowertrain || {};
    global.g2.btoStepPowertrain.VisualScale = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.obj.data('VisualScale', this);
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildChangeColor : function () {
                Util.def(this, {
                    color : {
                        instance : null,
                        kill : $.proxy(function () {
                            if (this.color.instance == null) return;
                            this.color.instance.kill();
                            this.color.instance = null;
                        }, this),
                        play : $.proxy(function () {
                            if (this.color.instance == null) return;
                            this.color.instance.play();
                        }, this)
                    }
                });
                this.color.instance = new changeExteriorColor(this.obj);
            },
            play : function () {
                this.obj.css({
                    'display' : '',
                    'opacity' : ''
                });
                this.bindEvents(true);
                this.visualItem.css('display', '');
                this.opts.isPlay = true;
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                var buildImg = this.obj.find('.build-type-img').css('display', '');
                var infoItem = this.obj.find('.build-type-item');
                var infoDisc = this.obj.find('.build-text');
                var step1 = TweenLite.fromTo(buildImg.find('img'), (250 / 1000), {
                    opacity : 0,
                    scale : 0.90
                }, {
                    opacity : 1,
                    scale : 1,
                    display : ''
                });
                var step2 = TweenLite.fromTo(infoDisc, (250 / 1000), {
                    opacity : 0,
                    y : 10
                }, {
                    opacity : 1,
                    y : 0,
                    onComplete : $.proxy(function () {
                        this.outCallback('complete');
                    }, this)
                });
                for (var itemMin = 0, itemMax = infoItem.length; itemMin < itemMax; itemMin++) {
                    var item = infoItem.eq(itemMin);
                    var delay = .1;
                    var step3 = TweenLite.fromTo(item, (250 / 1000), {
                        opacity : 0,
                        y : 10
                    }, {
                        opacity : 1,
                        y : 0,
                        delay : delay * itemMin
                    });
                    this.opts.playStep.push(step3);
                }
                this.opts.playStep.push(step1);
                this.opts.playStep.push(step2);
            },
            hide : function (callback) {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                var cb = callback || function () {};
                var buildImg = this.obj.find('.build-type-img');
                var infoItem = this.obj.find('.build-type-item');
                var infoDisc = this.obj.find('.build-text');
                var step1 = TweenLite.to(buildImg.find('img'), (250 / 1000), {
                    opacity : 0,
                    scale : 1.10
                });
                var step2 = TweenLite.to(infoDisc, (250 / 1000), {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        this.obj.hide();
                        this.visualItem.hide();
                        cb();
                        // this.outCallback('complete');
                    }, this)
                });
                var step3 = TweenLite.to(infoItem, (250 / 1000), {
                    opacity : 0
                });
                this.opts.hideStep.push(step1);
                this.opts.hideStep.push(step2);
                this.opts.hideStep.push(step3);
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                this.obj.hide();
                this.visualItem.hide();
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepPowertrain = global.g2.btoStepPowertrain || {};
    global.g2.btoStepPowertrain.VisualSeat = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                visualItem : '.visual-item',
                playStep : [],
                hideStep : [],
                isPlay : false,
                on : {
                    start : null,
                    complete : null,
                    hideComplete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.obj.data('VisualSeat', this);
            },
            setElements : function () {
                this.visualItem = this.obj.find(this.opts.visualItem);
            },
            bindEvents : function (type) {
                if (type) {
                } else {
                }
            },
            buildChangeColor : function () {
                Util.def(this, {
                    color : {
                        instance : null,
                        kill : $.proxy(function () {
                            if (this.color.instance == null) return;
                            this.color.instance.kill();
                            this.color.instance = null;
                        }, this),
                        play : $.proxy(function () {
                            if (this.color.instance == null) return;
                            this.color.instance.play();
                        }, this)
                    }
                });
                this.color.instance = new changeExteriorColor(this.obj);
            },
            play : function (speed) {
                var duration = (speed == isUndefined) ? (250 / 1000) : 0;
                this.obj.css({
                    'display' : '',
                    'zIndex' : 10
                });
                this.opts.isPlay = true;
                this.bindEvents(true);
                this.visualItem.css('display', '');
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                var buildImg = this.obj.find('.build-type-img').css('display', '');
                var infoDisc = this.obj.find('.build-text');
                var step1 = TweenLite.fromTo(buildImg, duration, {
                    opacity : 0
                }, {
                    opacity : 1,
                    display : '',
                    onComplete : $.proxy(function () {
                        // this.obj.css('zIndex', '');
                    }, this)
                });
                var step2 = TweenLite.fromTo(infoDisc, duration, {
                    opacity : 0,
                    y : 10
                }, {
                    delay : duration,
                    opacity : 1,
                    y : 0,
                    onComplete : $.proxy(function () {
                        this.outCallback('hideComplete');
                        this.outCallback('complete');
                    }, this)
                });
                this.opts.playStep.push(step1);
                this.opts.playStep.push(step2);
            },
            hide : function (callback) {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                this.obj.css({
                    'display' : '',
                    'zIndex' : ''
                });
                var cb = callback || function () {};
                var buildImg = this.obj.find('.build-type-img');
                var infoDisc = this.obj.find('.build-text');
                buildImg.css('opacity', '');
                var step1 = TweenLite.to(infoDisc, (250 / 1000), {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        this.obj.hide();
                    }, this)
                });
                cb();
                this.outCallback('hideComplete');
                this.opts.hideStep.push(step1);
            },
            kill : function () {
                this.bindEvents(false);
                this.opts.isPlay = false;
                for (var i = 0, max = this.opts.playStep.length; i < max; i++) {
                    this.opts.playStep[i].kill();
                }
                this.opts.playStep = [];
                for (var i = 0, max = this.opts.hideStep.length; i < max; i++) {
                    this.opts.hideStep[i].kill();
                }
                this.opts.hideStep = [];
                this.obj.hide();
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepResult = global.g2.btoStepResult || {};
    global.g2.btoStepResult.Component = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            var defParams = {
                obj : container,
                resultRecommended : '.build-result-recommended',
                recommendedObj : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
            },
            setElements : function () {
                this.resultRecommended = this.obj.find(this.opts.resultRecommended);
            },
            build : function () {
                this.buildClipboard();
                this.buildFormwrap();
                this.buildRecommended();
                this.buildShare();
            },
            buildClipboard : function () {
                var jsBoCopyClipboards = this.obj.find('.js-bo-copy-clipboard');
                for (var min = 0, max = jsBoCopyClipboards.length; min < max; min++) {
                    (function (index) {
                        var jsBoCopyClipboard = jsBoCopyClipboards.eq(index);
                        if (jsBoCopyClipboard.attr('data-load') != 'true') {
                            jsBoCopyClipboard.attr('data-load', 'true');
                            new win.G2.Controller.copyClipboard.Component(jsBoCopyClipboard);
                        }
                    })(min);
                }
            },
            buildFormwrap : function () {
                var jsBoInpTxts = this.obj.find('.js-bo-input-text-wrap');
                for (var min = 0, max = jsBoInpTxts.length; min < max; min++) {
                    (function (index) {
                        var jsBoInpTxt = jsBoInpTxts.eq(index);
                        if (jsBoInpTxt.attr('data-load') != 'true') {
                            jsBoInpTxt.attr('data-load', 'true');
                            new win.G2.Controller.inpText.Component(jsBoInpTxt);
                        }
                    })(min);
                }
            },
            buildShare : function () {
                Util.def(this, {
                    share : {
                        instance : null,
                        destroy : $.proxy(function () {
                            if (this.share.instance == null) return;
                            this.share.instance.destroy();
                            this.share.instance = null;
                        }, this),
                        build : $.proxy(function () {
                            if (this.share.instance !== null) return;
                            this.share.instance = new Share(this.obj);
                        }, this)
                    }
                });
                this.share.build();
            },
            buildRecommended : function () {
                if (this.opts.recommendedObj !== null) return;
                this.opts.recommendedObj = new win.g2.btoStepResultRecommended.Component(this.resultRecommended);
            },
            destroyRecommended : function () {
                if (this.opts.recommendedObj == null) return;
                this.opts.recommendedObj.kill();
                this.opts.recommendedObj = null;
            },
            updateRecommended : function () {
                if (this.opts.recommendedObj == null) return;
                this.opts.recommendedObj.update();
            },
            buildGlobalMethod : function (obj) {
                var jsBoCmBtns = obj.find('.cm-btn');
                for (var min = 0, max = jsBoCmBtns.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmBtn = jsBoCmBtns.eq(index);
                        if (jsBoCmBtn.attr('data-load') != 'true') {
                            jsBoCmBtn.attr('data-load', 'true');
                            new CommonCta(jsBoCmBtn);
                        }
                    })(min);
                }
            },
            update : function () {
                this.updateRecommended();
                this.buildGlobalMethod(this.obj);
            },
            kill : function () {
                if (this.share != isUndefined) {
                    this.share.destroy();
                }
                this.destroyRecommended();
            }
        };
        function Share (container, args) {
            if (!(this instanceof Share)) {
                return new Share(container, args);
            }
            var defParams = {
                utilWrap : '.detail-util',
                utilShare : '.js-util-share',
                btnShare : '.btn-share',
                utilList : '.util-list',
                menuItem : 'a',
                classAttr : {
                    open : 'is-open'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                isActive : false,
                customEvent : '.Share' + (new Date()).getTime() + Math.random(),
                viewType : null,
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Share.prototype = {
            init : function () {
                this.setElements();
                this.buildClipboard();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.utilWrap = this.obj.find(this.opts.utilWrap);
                this.utilShare = this.utilWrap.find(this.opts.utilShare);
                this.btnShare = this.utilShare.find(this.opts.btnShare);
                this.utilList = this.utilShare.find(this.opts.utilList);
                this.menuItem = this.utilList.find(this.opts.menuItem);
            },
            buildClipboard : function () {
                new win.G2.Controller.copyClipboard.Component(this.utilShare);
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
                    this.btnShare.on(this.changeEvents('click'), $.proxy(this.shareClick, this));
                    this.menuItem.on(this.changeEvents('click'), $.proxy(this.menuItemClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.btnShare.off(this.changeEvents('click'));
                    this.menuItem.off(this.changeEvents('click'));
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setLayout();
            },
            setLayout : function () {
                if (this.winWidth > (RESPONSIVE.MOBILE.WIDTH - 1)) {
                    if (this.opts.viewType !== 'pc') {
                        this.opts.viewType = 'pc';
                    }
                } else {
                    if (this.opts.viewType !== 'mo') {
                        this.opts.viewType = 'mo';
                    }
                }
            },
            menuItemClick : function (e) {
                e.preventDefault();
                if (this.opts.isActive && (this.opts.viewType === 'pc')) {
                    this.btnShare.triggerHandler(this.changeEvents('click'));
                }
            },
            shareClick : function (e) {
                e.preventDefault();
                var classAttr = this.opts.classAttr;
                var ariaAttr = this.opts.ariaAttr;
                if (!this.opts.isActive) {
                    this.opts.isActive = true;
                    this.utilShare.addClass(classAttr.open);
                    this.btnShare.attr(ariaAttr.expanded, 'true');
                    win.setTimeout($.proxy(function () {
                        this.utilShare.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.btnShare.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.opts.isActive = false;
                    this.utilShare.removeClass(classAttr.open);
                    this.btnShare.attr(ariaAttr.expanded, 'false');
                    this.utilShare.off('clickoutside touchendoutside keyupoutside');
                }
            },
            destroy : function () {
                this.bindEvents(false);
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
    global = global;
    global.g2 = global.g2 || {};
    global.g2.btoStepResultRecommended = global.g2.btoStepResultRecommended || {};
    global.g2.btoStepResultRecommended.Component = factory();
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
                    spaceBetween: 121,
                    breakpoints: {
                        1360: {
                            slidesPerView: 3,
                            slidesPerGroup: 3
                        },
                        768: {
                            slidesPerView: 2,
                            slidesPerGroup: 2
                        }
                    }
                },
                carouselWrap : '.build-result-recommended__inner',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                contentBox : '.content-box',
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
                this.buildHeightMatch();
                this.buildCarousel();
                this.resizeFunc();
                this.bindEvents(true);
                this.loadComponent();
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.contentBox = this.slides.find(this.opts.contentBox);
            },
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.build-result-recommended__item-text', '.build-result-recommended__item-info'],
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
                        destroy : $.proxy(function () {
                            if (!this.heightmatch.instance.length) return;
                            for (var min = 0, max = this.heightmatch.instance.length; min < max; min++) {
                                var instance = this.heightmatch.instance[min];
                                instance.destroy();
                            }
                            this.heightmatch.instance = [];
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
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.obj, this.opts.carouselOpts);
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.opts.swiperInstance.on('transitionStart', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                    }, this));
                    this.opts.swiperInstance.on('transitionEnd', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.opts.currentIndex = index;
                    }, this));
                    this.pagination = $(this.opts.swiperInstance.pagination.$el);
                    this.nextEl = $(this.opts.swiperInstance.navigation.$nextEl).parent();
                    this.prevEl = $(this.opts.swiperInstance.navigation.$prevEl).parent();
                    this.opts.currentIndex = this.opts.swiperInstance.realIndex;
                }
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('transitionStart transitionEnd breakpoint');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            updateHeightCarousel : function (speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.updateAutoHeight(speed);
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
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                var navigationEl = this.nextEl.add(this.prevEl);
                if (this.winWidth < RESPONSIVE.MOBILE.WIDTH) {
                    var contentBoxHeight = this.contentBox.outerHeight(true);
                    this.pagination.css('top', contentBoxHeight);
                    navigationEl.css('top', (contentBoxHeight / 2) - (this.nextEl.outerHeight(true) / 2));
                } else {
                    this.pagination.css('top', '');
                    navigationEl.css('top', '');
                }
            },
            loadComponent : function () {
                $(win).on(this.changeEvents('load'), $.proxy(function () {
                    this.resizeFunc();
                }, this));
                Util.imgLoaded(this.obj).done($.proxy(function () {
                    win.setTimeout($.proxy(function () {
                        this.resizeFunc();
                    }, this), 70);
                }, this));
            },
            update : function () {
                this.kill();
                this.init();
            },
            kill : function () {
                if (this.heightmatch != isUndefined) {
                    this.heightmatch.destroy();
                }
                this.destroyCarousel();
                this.bindEvents(false);
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
    global.g2 = global.g2 || {};
    global.g2.buildOrder = global.g2.buildOrder || {};
    global.g2.buildOrder.Component = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            doc = win.document,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                obj : container,
                orderNav : '.build-order-nav',
                orderContent : '.build-order-content',
                orderVisual : '.build-order-visual',
                orderVisualWrap : '.build-order-visual__wrap',
                orderOptions : '.build-order-options',
                orderOptionsWrap : '.build-order-options__wrap',
                orderPrice : '.build-order-price',
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                sizeAttr : {
                    view : null
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
                this.buildLayer();
                this.buildCommonObj();
                this.buildContentsHeight();
                this.buildNav();
                this.buildVisualWrap();
                this.buildOptionsWrap();
                this.buildOrderPrice();
                this.buildOrderFinal();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.orderNav = this.obj.find(this.opts.orderNav);
                this.orderVisual = this.obj.find(this.opts.orderVisual);
                this.orderVisualWrap = this.orderVisual.find(this.opts.orderVisualWrap);
                this.orderOptions = this.obj.find(this.opts.orderOptions);
                this.orderOptionsWrap = this.orderOptions.find(this.opts.orderOptionsWrap);
            },
            buildLayer : function () {
                var jsBoCmLayers = $('.js-bo-cm-layer');
                for (var min = 0, max = jsBoCmLayers.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmLayer = jsBoCmLayers.eq(index);
                        if (jsBoCmLayer.attr('data-load') != 'true') {
                            jsBoCmLayer.attr('data-load', 'true');
                            new HiveLayer(jsBoCmLayer);
                        }
                    })(min);
                }
            },
            buildCommonObj : function () {
                Util.def(this, {
                    orderprice : {
                        instance : null,
                        reset : $.proxy(function () {
                            if (this.orderprice.instance == null) return;
                            this.orderprice.instance.reset();
                        }, this),
                        activeExpand : $.proxy(function (type) {
                            if (this.orderprice.instance == null) return;
                            this.orderprice.instance.activeExpand(type);
                        }, this)
                    }
                });
                Util.def(this, {
                    orderfinal : {
                        instance : null,
                        activeExpand : $.proxy(function (type) {
                            if (this.orderfinal.instance == null) return;
                            this.orderfinal.instance.activeExpand(type);
                        }, this)
                    }
                });
            },
            buildContentsHeight : function () {
                Util.def(this, {
                    contentsheight : {
                        instance : null,
                        kill : $.proxy(function () {
                            if (this.contentsheight.instance == null) return;
                            this.contentsheight.instance.destroy();
                            this.contentsheight.instance = null;
                        }, this),
                        update : $.proxy(function () {
                            if (this.contentsheight.instance == null) return;
                            this.contentsheight.instance.update();
                        }, this),
                        build : $.proxy(function () {
                            this.contentsheight.kill();
                            this.contentsheight.instance = new ContentsHeight(this.obj, {
                                orderNav : this.opts.orderNav,
                                orderPrice : this.opts.orderPrice
                            });
                        }, this)
                    }
                });
            },
            buildNav : function () {
                Util.def(this, {
                    nav : {
                        instance : null
                    }
                });
                if (this.nav.instance == null && this.orderNav.length) {
                    this.nav.instance = new win.g2.buildOrder.Nav(this.obj);
                }
            },
            buildVisualWrap : function () {
                Util.def(this, {
                    visualwrapcontrol : {
                        instance : null,
                        start : $.proxy(function () {
                            if (this.visualwrapcontrol.instance == null) return;
                            var activeWrap = this.visualwrapcontrol.instance.opts.activeWrap;
                            if (activeWrap != null && !activeWrap.hasClass('step-preview')) {
                                this.orderprice.activeExpand(false);
                                this.orderprice.reset();
                            } else {
                                this.orderprice.activeExpand(true);
                            }
                            if (activeWrap != null && !activeWrap.hasClass('step-complete')) {
                                $('body').removeClass('is-heightauto');
                                this.contentsheight.build();
                                this.orderfinal.activeExpand(false);
                                this.contentsheight.update();
                            } else {
                                $('body').addClass('is-heightauto');
                                this.contentsheight.kill();
                                this.orderfinal.activeExpand(true);
                            }
                        }, this),
                        complete : $.proxy(function () {
                        }, this)
                    }
                });
                this.visualwrapcontrol.instance = new win.g2.buildOrder.VisualWrap(this.orderVisualWrap, {
                    on : {
                        start : $.proxy(function () {
                            // console.log('visualwrap start');
                            this.visualwrapcontrol.start();
                        }, this),
                        complete : $.proxy(function () {
                            // console.log('visualwrap complete');
                            this.buildGlobalMethod();
                            this.visualwrapcontrol.complete();
                        }, this)
                    }
                });
            },
            buildOptionsWrap : function () {
                new win.g2.buildOrder.OptionsWrap(this.orderOptionsWrap, {
                    on : {
                        start : $.proxy(function () {
                            // console.log('optionswrap start');
                        }, this),
                        complete : $.proxy(function () {
                            // console.log('optionswrap complete');
                            this.buildGlobalMethod();
                        }, this)
                    }
                });
            },
            buildOrderPrice : function () {
                this.orderprice.instance = new win.g2.buildOrder.OrderPrice(this.obj, {
                    orderPrice : this.opts.orderPrice,
                    on : {
                        change : $.proxy(function () {
                            this.contentsheight.update();
                        }, this)
                    }
                });
            },
            buildOrderFinal : function () {
                this.orderfinal.instance = new win.g2.buildOrder.OrderFinal(this.obj, {
                    orderContent : this.opts.orderContent
                });
            },
            buildGlobalMethod : function (obj) {
                var _this = this;
                var jsBoCmBtnMores = $('.cm-btn-more');
                for (var min = 0, max = jsBoCmBtnMores.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmBtnMore = jsBoCmBtnMores.eq(index);
                        if (jsBoCmBtnMore.attr('data-load') != 'true') {
                            jsBoCmBtnMore.attr('data-load', 'true');
                            new win.G2.Controller.moreCta.Component(jsBoCmBtnMore);
                        }
                    })(min);
                }
                var jsBoCmBtns = $('.cm-btn');
                for (var min = 0, max = jsBoCmBtns.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmBtn = jsBoCmBtns.eq(index);
                        if (jsBoCmBtn.attr('data-load') != 'true') {
                            jsBoCmBtn.attr('data-load', 'true');
                            new win.G2.Controller.CommonCta.Component(jsBoCmBtn);
                        }
                    })(min);
                }
                var jsSelects = $('.js-select-wrap');
                for (var min = 0, max = jsSelects.length; min < max; min++) {
                    (function (index) {
                        var jsSelect = jsSelects.eq(index);
                        var onMethod = {
                            on : {
                                open : $.proxy(function () {
                                    $(_this.opts.orderPrice).addClass('remove-dimmed');
                                }, _this),
                                close : $.proxy(function () {
                                    $(_this.opts.orderPrice).removeClass('remove-dimmed');
                                }, _this)
                            }
                        };
                        if (jsSelect.attr('data-load') != 'true') {
                            jsSelect.attr('data-load', 'true');
                            new win.G2.Controller.select.Component(jsSelect, onMethod);
                        } else {
                            var HiveSelect = jsSelect.data('HiveSelect');
                            HiveSelect.opts['on'] = onMethod['on'];
                        }
                    })(min);
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
                    $(doc).on('click', '.js-btn-more', $.proxy(function (e) {
                        e.preventDefault();
                        $('.build-order-content__left').addClass('is-layer-active');
                        var activeWrap = this.visualwrapcontrol.instance.opts.activeWrap;
                        activeWrap.trigger('visualupdate');
                    }, this));
                    $(doc).on('click', '.build-layer-btn a', $.proxy(function (e) {
                        e.preventDefault();
                        $('.build-order-content__left').removeClass('is-layer-active');
                    }, this));
                    $(doc).on('click', '.build-order-price__summary .btn-summary', $.proxy(function () {
                        $('.build-order-price').toggleClass('is-opened');
                        $('.site-build-order').toggleClass('is-dimmed');
                    }, this));
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
                this.setLayout();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.sizeAttr.view !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.sizeAttr.view = RESPONSIVE.TABLET3.NAME;
                        var activeWrap = this.visualwrapcontrol.instance.opts.activeWrap;
                        if (activeWrap != null && activeWrap.hasClass('step-preview')) {
                            this.orderprice.reset();
                        }
                    }
                } else {
                    if (this.opts.sizeAttr.view !== 'OTHER') {
                        this.opts.sizeAttr.view = 'OTHER';
                    }
                }
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function ContentsHeight (container, args) {
            if (!(this instanceof ContentsHeight)) {
                return new ContentsHeight(container, args);
            }
            var defParams = {
                container : container,
                isDestroy : false,
                customEvent : '.ContentsHeight' + (new Date()).getTime() + Math.random(),
                sizeAttr : {
                    view : null
                },
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        ContentsHeight.prototype = {
            init : function () {
                this.setElements();
                this.resizeFunc();
                this.bindEvents(true);
                this.bindCallbackEvents(true);
            },
            setElements : function () {
                this.orderNav = $(this.opts.orderNav);
                this.orderNavModelLayer = this.orderNav.find('.build-select-model__layer');
                this.contentInner = this.obj.find(this.opts.contentInner);
                this.orderPrice = $(this.opts.orderPrice);
                this.orderPriceSummaryLayer = this.orderPrice.find('.build-order-price__summary .summary-layer');
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
            bindCallbackEvents : function (type) {
                if (type) {
                    this.obj.on(this.changeEvents('ui-refresh'), $.proxy(this.reFresh, this));
                } else {
                    this.obj.off(this.changeEvents('ui-refresh'));
                }
            },
            reFresh : function () {
                this.update();
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
                var wHeight = Util.winSize().h;
                this.obj.css('height', wHeight);
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.sizeAttr.view !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.sizeAttr.view = RESPONSIVE.TABLET3.NAME;
                        this.orderNavModelLayer.css('max-height', '');
                        this.orderPriceSummaryLayer.css('height', '');
                    }
                } else {
                    if (this.opts.sizeAttr.view !== 'OTHER') {
                        this.opts.sizeAttr.view = 'OTHER';
                    }
                    var orderNavHeight = this.orderNav.height();
                    var orderPriceHeight = this.orderPrice.height();
                    this.orderNavModelLayer.css('max-height', wHeight - orderNavHeight);
                    this.orderPriceSummaryLayer.css('height', wHeight - orderNavHeight - orderPriceHeight);
                }
            },
            update : function () {
                this.resizeFunc();
            },
            destroy : function () {
                this.opts.sizeAttr.view = null;
                this.opts.isDestroy = true;
                this.obj.css('height', '');
                this.orderNavModelLayer.css('max-height', '');
                this.orderPriceSummaryLayer.css('height', '');
                this.bindEvents(false);
                this.bindCallbackEvents(false);
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
                obj : '.site-build-order'
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
                    new win.g2.buildOrder.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
