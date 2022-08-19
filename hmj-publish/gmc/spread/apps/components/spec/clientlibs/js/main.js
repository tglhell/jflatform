(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpSpecs = global.g2.cpSpecs || {};
    global.g2.cpSpecs.HiveSticky = factory();
}(this, function () { 'use strict';

    var HiveSticky = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.G2.util;
        function HiveSticky (container, args) {
            if (!(this instanceof HiveSticky)) {
                return new HiveSticky(container, args);
            }
            var defParams = {
                body : $('body'),
                align : 'top', // Could be 'top', 'bottom', 'topAndBottom'
                alignCss : {
                    top : {
                        top : 0,
                        bottom : 'auto'
                    },
                    bottom : {
                        top : 'auto',
                        bottom : 0
                    }
                },
                stickyWrapElements : container || '.hive-sticky-wrap',
                overedElements : null,
                overedClass : 'sticky-over',
                fixedClass : 'sticky-active',
                customEvent : '.HiveSticky' + (new Date()).getTime() + Math.random(),
                spaceBetweenObjectCheck : false,
                spaceBetween : 0,
                spaceStickyElements : null,
                useSticky : true,
                breakpoints : {},
                fps : 120,
                easing : null,
                easingClass : 'sticky-ease',
                duration : 250,
                clickID : null,
                prop : {},
                callbackData : {},
                currentActiveKeys : null,
                currentBreakKey : 'always',
                fixedTween : null,
                viewType : null,
                scrollElements : null,
                scrollStart : null,
                resizeStart : null,
                // isFixedConflict : (function () {
                //     var ua = window.navigator.userAgent,
                //         isIPhone = ua.match(/(iPhone|iPad|iPod)/i),
                //         isAndroid = ua.match(/Android/i);
                //     if (Util.isDevice) {
                //         return (isIPhone) ? true : false;
                //     }
                // })(),
                isFixedConflict : false,
                stickyMove : null,
                stickyMoveBefore : null,
                stickyMoveAfter : null,
                loadAfter : null
            };
            if (!(this.stickyWrap = $(defParams.stickyWrapElements)).length) return;
            var customOpts = Util.def({}, this.stickyWrap.data('hivesticky-opts') || {}),
                customOpts = Util.def(customOpts, args || {});
            this.opts = Util.def(defParams, customOpts);
            this.init();
        }
        HiveSticky.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.initLayout();
                this.setOpts();
                this.onScrollFunc();
                this.loadControl();
                this.bindEvents(true);
                this.bindCallBackEvents();
            },
            setElements : function () {
                if (this.opts.scrollElements == null) {
                    this.scrollElements = $(win);
                } else {
                    this.scrollElements = $(this.opts.scrollElements);
                }
                // spaceBetween
                if (typeof this.opts.spaceBetween !== 'number') {
                    this.opts.spaceBetweenObjectCheck = true;
                    this.spaceBetweenObj = this.opts.spaceBetween;
                }
            },
            initOpts : function () {
                var _this = this,
                    alignCss = this.opts.alignCss;
                this.alignRemoveCss = {};
                for (var key in alignCss) {
                    this.alignRemoveCss[key] = '';
                }
                this.stickyPos = (this.stickyWrap.css('position') === 'absolute') ? 'side' : '';
                if (this.stickyPos === 'side' && this.opts.easing != null) {
                    this.stickyWrap.css('position', 'absolute');
                    this.opts.align = 'top';
                }
            },
            initLayout : function () {
                var stickyWrapClass = this.stickyWrap.attr('class').split(' ')[0],
                    jsStickyWrapClass = 'js-' + stickyWrapClass;
                if (this.stickyPos !== 'side') {
                    if (!this.stickyWrap.parent().hasClass(jsStickyWrapClass)) {
                        this.stickyWrap.wrap('<div class="' + jsStickyWrapClass + '" />');
                    }
                    this.jsStickyWrap = this.stickyWrap.parent();
                    if (this.opts.easing != null) {
                        this.jsStickyWrap.addClass(this.opts.easingClass);
                        if (this.opts.align === 'top') {
                            this.stickyWrap.css('bottom', 'auto');
                        } else if (this.opts.align === 'bottom') {
                            this.stickyWrap.css('top', 'auto');
                        }
                    }
                } else {
                    this.jsStickyWrap = this.stickyWrap.parents().filter(function () {
                        var position = $(this).css('position');
                        return (position === 'relative' || position === 'absolute') ? true : false;
                    }).eq(0);
                    this.jsStickyWrap = (this.jsStickyWrap.length) ? this.jsStickyWrap : $('body');
                }
                // isFixedConflict
                if (this.opts.isFixedConflict) {
                    var fixedClass = 'hiveStickyfixedArea',
                        fixedElements = '<div class="' + fixedClass + '"></div>';
                    this.stickyWrap.after(fixedElements);
                    this.fixedWrap = this.stickyWrap.next('.' + fixedClass);
                }
            },
            setOpts : function () {
                var _this = this;
                var winWidth = Util.winSize().w,
                    winHeight = Util.winSize().h;
                // breakpoints
                var breakpoints = this.opts.breakpoints,
                    breakKeyMins = [],
                    breakKeyMin,
                    alignCss = this.opts.alignCss;
                for (var key in breakpoints) {
                    if (key >= winWidth) {
                        breakKeyMins.push(key);
                        breakKeyMin = Math.min.apply(null, breakKeyMins);
                    } else {
                        breakKeyMin = null;
                    }
                }
                this.breakOpts = Util.def({}, this.opts);
                if (breakKeyMin != null) {
                    this.breakOpts = Util.def(this.breakOpts, breakpoints[breakKeyMin]);
                }
                var animateMargin = (function () {
                    if (_this.spaceBetweenObj.attr('data-animate-top') == isUndefined) {
                        return 0;
                    } else {
                        return parseFloat(_this.spaceBetweenObj.attr('data-animate-top'));
                    }
                })();
                if (this.opts.spaceBetweenObjectCheck) {
                    this.breakOpts.spaceBetween = this.spaceBetweenObj.outerHeight() + animateMargin;
                }

                for (var cssKey in alignCss) {
                    alignCss[cssKey][cssKey] = 0 + this.breakOpts.spaceBetween;
                }
                if (this.opts.currentBreakKey !== breakKeyMin) {
                    this.opts.currentBreakKey = breakKeyMin;

                    this.pushWrap = this.stickyWrap;

                    // useSticky
                    if (!this.breakOpts.useSticky) {
                        if (this.stickyWrap.hasClass(this.opts.fixedClass)) {
                            if (this.stickyPos !== 'side') {
                                this.stickyWrap.css(this.alignRemoveCss);
                            }
                            this.stickyWrap.removeClass(this.opts.fixedClass);
                            if (this.opts.isFixedConflict && this.stickyPos !== 'side') {
                                this.jsStickyWrap.append(this.stickyWrap);
                            }
                        }
                        this.jsStickyWrap.css('height', '');
                    }

                    // overedElements
                    if (this.breakOpts.overedElements !== null) {
                        this.overedElements = this.stickyWrap.closest(this.breakOpts.overedElements);
                    }
                    // spaceStickyElements
                    this.spaceStickyElements = $(this.breakOpts.spaceStickyElements);
                }

                // default
                var bodyOffset = (this.opts.scrollElements == null) ? this.opts.body.offset() : this.scrollElements.offset(),
                    jsStickWrapOffsetTop = ((this.opts.scrollElements == null) ? 0 : this.scrollElements.scrollTop()) + this.jsStickyWrap.offset().top,
                    offsetTop = jsStickWrapOffsetTop - bodyOffset.top,
                    offsetTop = offsetTop < 0 ? 0 : offsetTop,
                    stickyHeight = (this.breakOpts.useSticky && this.stickyPos !== 'side') ? this.pushWrap.outerHeight(true) : 0,
                    offsetBottom = offsetTop + stickyHeight,
                    alignBottomOffset = offsetBottom - winHeight;
                this.opts.prop['offsetTop'] = Math.floor(offsetTop, 10);
                this.opts.prop['offsetBottom'] = Math.floor(offsetBottom, 10);
                this.opts.prop['stickyHeight'] = Math.ceil(stickyHeight, 10);
                this.opts.prop['alignBottomOffset'] = Math.ceil(alignBottomOffset, 10);

                // overedElements
                if (this.breakOpts.overedElements !== null) {
                    if (this.overedElements.length) {
                        var overedElementsOffsetTop = this.overedElements.offset().top,
                            overedElementsHeight = this.overedElements.outerHeight(),
                            stickyWrap = this.stickyWrap,
                            stickyWrapHeight = stickyWrap.outerHeight();
                        this.opts.prop['overedElementsOffset'] = overedElementsOffsetTop + overedElementsHeight - stickyWrapHeight;

                    }
                }

                // spaceStickyElements
                var spaceStickyCondition = this.spaceStickyElements.length;
                this.spaceStickyData = {
                    offsetTop : spaceStickyCondition ? this.spaceStickyElements.parent().offset().top : 0,
                    stickyHeight : spaceStickyCondition ? this.spaceStickyElements.outerHeight() : 0
                };

                this.setLayout();
            },
            setLayout : function () {
                var prop = this.opts.prop;
                if (this.stickyPos !== 'side') {
                    if (this.breakOpts.useSticky) {
                        this.jsStickyWrap.css('height', prop.stickyHeight);
                    }
                    this.opts.callbackData = prop;
                } else {
                    this.opts.callbackData = {};
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
                    this.scrollElements.on(this.changeEvents('scroll'), $.proxy(this.onScrollFunc, this));
                    $(win).on(this.changeEvents('resize'), $.proxy(this.onResizeFunc, this));
                } else {
                    this.scrollElements.off(this.changeEvents('scroll'));
                    $(win).off(this.changeEvents('resize'));
                }
            },
            onScrollFunc : function () {
                this.winScrollTop = this.scrollElements.scrollTop();
                if (this.opts.scrollStart == null) {
                    this.opts.scrollStart = this.winScrollTop;
                    if (this.opts.easing == null) {
                        this.outCallback('stickyMoveBefore');
                        this.scrollAnimateFunc();
                    }
                }
                win.clearTimeout(this.scrollEndTimeout);
                this.scrollEndTimeout = win.setTimeout($.proxy(this.onScrollEndFunc, this), 60);
            },
            onScrollEndFunc : function () {
                this.opts.scrollStart = null;
                if (this.opts.easing == null) {
                    this.setOpts();
                    this.stickyFixedFunc();
                    this.outCallback('stickyMoveAfter', this.opts.currentActiveKeys);
                }
                Util.cancelAFrame.call(win, this.scrollRequestFrame);
            },
            scrollAnimateFunc : function () {
                this.setOpts();
                this.stickyFixedFunc();
                this.outCallback('stickyMove');
                this.scrollRequestFrame = Util.requestAFrame.call(win, $.proxy(this.scrollAnimateFunc, this));
            },
            stickyFixedFunc : function () {
                var prop = this.opts.prop,
                    align = this.breakOpts.align,
                    alignCss = this.opts.alignCss,
                    winScrollTop = this.winScrollTop,
                    spaceBetween = (this.stickyPos !== 'side') ? this.breakOpts.spaceBetween : 0;

                var lockScroll = $('html').data('lockScroll'),
                    lockType = (lockScroll != null) ? true : false,
                    scrollTop = (lockType) ? lockScroll.top : winScrollTop;

                if (align === 'top') {
                    var alignData = alignCss[align];
                    this.condition = scrollTop > (prop.offsetTop - spaceBetween);
                    if (this.breakOpts.overedElements !== null) {
                        this.overCondition = scrollTop > prop.overedElementsOffset;
                    }
                } else if (align === 'bottom') {
                    var alignData = alignCss[align];
                    this.condition = scrollTop < (prop.alignBottomOffset + spaceBetween);
                } else if (align === 'topAndBottom') {
                    this.condition = scrollTop > (prop.offsetTop - spaceBetween) ||
                        scrollTop < (prop.alignBottomOffset + spaceBetween);
                    if (scrollTop > (prop.offsetTop - spaceBetween)) {
                        var alignData = alignCss['top'];
                    } else if (scrollTop < (prop.alignBottomOffset + spaceBetween)) {
                        var alignData = alignCss['bottom'];
                    }
                }
                if (this.condition) {
                    if (this.breakOpts.useSticky) {
                        if (!this.stickyWrap.hasClass(this.opts.fixedClass)) {
                            this.stickyWrap.addClass(this.opts.fixedClass);
                            if (this.opts.isFixedConflict && this.stickyPos !== 'side') {
                                this.fixedWrap.append(this.stickyWrap);
                            }
                        }
                    }
                    if (this.opts.scrollElements !== null) {
                        alignData['top'] = this.scrollElements.offset().top;
                    }
                    if (this.breakOpts.useSticky) {
                        if (this.stickyPos !== 'side') {
                            this.opts.fixedTween = TweenLite.to(this.stickyWrap, (250 / 1000), {
                                top : alignData['top']
                            });
                            // this.stickyWrap.css(alignData);
                        }
                    }
                } else {
                    if (this.breakOpts.useSticky) {
                        if (this.stickyWrap.hasClass(this.opts.fixedClass)) {
                            if (this.stickyPos !== 'side') {
                                if (this.opts.fixedTween !== null) {
                                    this.opts.fixedTween.kill();
                                    this.opts.fixedTween = null;
                                }
                                this.stickyWrap.css(this.alignRemoveCss);
                            }
                            this.stickyWrap.removeClass(this.opts.fixedClass);
                            if (this.opts.isFixedConflict && this.stickyPos !== 'side') {
                                this.jsStickyWrap.append(this.stickyWrap);
                            }
                        }
                    }
                }
                if (this.breakOpts.overedElements !== null) {
                    if (this.overCondition) {
                        if (!this.stickyWrap.hasClass(this.opts.overedClass)) {
                            this.stickyWrap.addClass(this.opts.overedClass);
                        }
                        // this.stickyWrap.css({
                        //     'top' : 'auto',
                        //     'bottom' : 0
                        // });
                    } else {
                        if (this.stickyWrap.hasClass(this.opts.overedClass)) {
                            this.stickyWrap.removeClass(this.opts.overedClass);
                        }
                    }
                } else {
                    if (this.stickyWrap.hasClass(this.opts.overedClass)) {
                        this.stickyWrap.removeClass(this.opts.overedClass);
                    }
                }
            },
            onResizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTimeout);
                this.resizeEndTimeout = win.setTimeout($.proxy(this.onResizeEndFunc, this), 150);
            },
            onResizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.onScrollFunc();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.onScrollFunc();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            loadControl : function () {
                this.outCallback('loadAfter');
            },
            outCallback : function (ing) {
                var callbackObj = this.opts[ing],
                    condition = ing === 'stickyMove';
                if (condition) {
                    this.stickyWrap.trigger(ing, {
                        arg : arguments[1],
                        arg2 : arguments[2],
                        clickID : this.opts.clickID,
                        instance : this
                    });
                } else {
                    if (ing === 'stickyMoveAfter') {
                        this.stickyWrap.trigger(ing, {
                            arg : arguments[1],
                            clickID : this.opts.clickID,
                            instance : this
                        });
                        this.opts.clickID = null;
                    } else {
                        this.stickyWrap.trigger(ing, {
                            data : this.opts.callbackData,
                            clickID : this.opts.clickID,
                            instance : this
                        });
                    }
                }
                if (callbackObj == null) return;
                if (condition) {
                    callbackObj({
                        arg : arguments[1],
                        arg2 : arguments[2],
                        clickID : this.opts.clickID,
                        instance : this
                    });
                } else {
                    if (ing === 'stickyMoveAfter') {
                        callbackObj({
                            arg : arguments[1],
                            clickID : this.opts.clickID,
                            instance : this
                        });
                        this.opts.clickID = null;
                    } else {
                        callbackObj({
                            data : this.opts.callbackData,
                            clickID : this.opts.clickID,
                            instance : this
                        });
                    }
                }
            },
            bindCallBackEvents : function () {
                this.stickyWrap.on('destroy', $.proxy(this.destroy, this));
                this.stickyWrap.on('reInit', $.proxy(this.reInit, this));
            },
            destroy : function () {
                this.bindEvents(false);
            },
            reInit : function () {
                this.bindEvents(false);
                this.bindEvents(true);
                this.onResizeFunc();
            }
        };
        return HiveSticky;
    })();
    return HiveSticky;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpSpecs = global.g2.cpSpecs || {};
    global.g2.cpSpecs.Component = factory();
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
                stickyOpts : {
                    fixedClass : 'is-fixed',
                    spaceBetweenObjectCheck : true,
                    spaceBetween : $('.site-navi-bar')
                },
                carouselOpts : {
                    slidesPerView : 2,
                    initialSlide : 0
                },
                carouselWrap : '.cp-spec__bar-wrap',
                jsSelectWrap : '.js-select-wrap',
                selectPlaceHolder : '.cm-select__placeholder',
                selectOptions : '.cm-select__options',
                specSection : '.cp-spec__section',
                specSectionContent : '.cp-spec__section-content',
                specSectionElContent : '.el-content',
                selectMoView : '.select-mobile-view',
                classAttr : {
                    move : 'is-move',
                    opened : 'is-opened'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                sizeAttr : {
                    swiper : null
                },
                useCloseFocus : true,
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
                this.buildSelect();
                this.buildSpecContents();
                this.buildCarousel();
                this.buildSticky();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.jsSelectWrap = this.carouselWrap.find(this.opts.jsSelectWrap);
                this.selectPlaceHolder = this.jsSelectWrap.find(this.opts.selectPlaceHolder);
                this.selectMoView = this.carouselWrap.find(this.opts.selectMoView);
                this.specSection = this.obj.find(this.opts.specSection);
                this.specSectionContent = this.specSection.find(this.opts.specSectionContent);
                this.specSectionElContent = this.specSectionContent.find(this.opts.specSectionElContent);
                this.specSectionElContent = this.specSectionContent.find(this.opts.specSectionElContent);
            },
            buildSelect : function () {
                Util.def(this, {
                    select : {
                        instance : [],
                        destroy : $.proxy(function () {
                            for (var i = 0, max = this.select.instance.length; i < max; i++) {
                                var instance = this.select.instance[i];
                                if (instance != isUndefined && instance['ACTIVE']) {
                                    this.select.default(i);
                                }
                            }
                            var openSelect = this.jsSelectWrap.filter('.'+this.opts.classAttr.opened);
                            if (openSelect.length) {
                                openSelect.find(this.opts.selectPlaceHolder).triggerHandler('click');
                            }
                        }, this),
                        move : $.proxy(function (index) {
                            if (this.select.instance[index] == isUndefined) return;
                            if (this.select.instance[index]['ACTIVE']) return;
                            this.select.instance[index]['ACTIVE'] = true;
                            this.selectMoView.append(this.select.instance[index]['OPTIONS']);
                        }, this),
                        default : $.proxy(function (index) {
                            if (this.select.instance[index] == isUndefined) return;
                            if (!this.select.instance[index]['ACTIVE']) return;
                            this.select.instance[index]['ACTIVE'] = false;
                            this.select.instance[index]['WRAP'].append(this.select.instance[index]['OPTIONS']);
                        }, this),
                        build : $.proxy(function () {
                            var build = $.proxy(function (obj, min) {
                                var selectOptions = obj.find(this.opts.selectOptions),
                                    hiveSelect = obj.data('HiveSelect');
                                hiveSelect.opts.on['open'] = $.proxy(function () {
                                    win.setTimeout($.proxy(function () {
                                        if (this.select.instance[min]['ACTIVE']) {
                                            Util.findFocus(this.select.instance[min]['OPTIONS']);
                                        }
                                        this.opts.useCloseFocus = true;
                                    }, this), 30);
                                }, this);
                                hiveSelect.opts.on['close'] = $.proxy(function () {
                                    if (this.opts.useCloseFocus) {
                                        if (this.select.instance[min]['ACTIVE']) {
                                            hiveSelect.selectBtn.focus();
                                        }
                                    }
                                    this.opts.useCloseFocus = true;
                                }, this);
                                var data = {
                                    WRAP : obj,
                                    OPTIONS : selectOptions,
                                    ACTIVE : false
                                };
                                this.select.instance.push(data);
                            }, this);
                            for (var i = 0, max = this.jsSelectWrap.length; i < max; i++) {
                                var jsSelectWrap = this.jsSelectWrap.eq(i);
                                build(jsSelectWrap, i);
                            }
                        }, this)
                    }
                });
                this.select.build();
            },
            buildSpecContents : function () {
                Util.def(this, {
                    contents : {
                        instance : [],
                        destroy : $.proxy(function () {
                            this.specSectionElContent.removeClass(this.opts.classAttr.move);
                        }, this),
                        play : $.proxy(function (index) {
                            if (index == 1) {
                                this.specSectionElContent.addClass(this.opts.classAttr.move);
                            } else {
                                this.specSectionElContent.removeClass(this.opts.classAttr.move);
                            }
                            var openSelect = this.jsSelectWrap.filter('.'+this.opts.classAttr.opened);
                            if (openSelect.length) {
                                openSelect.find(this.opts.selectPlaceHolder).triggerHandler('click');
                            }
                        }, this)
                    }
                });
            },
            buildCarousel : function () {
                Util.def(this, {
                    carousel : {
                        instance : null,
                        swiperinstance : null,
                        destroy : $.proxy(function () {
                            if (this.carousel.instance == null) return;
                            this.carousel.swiperinstance.off('transitionStart transitionEnd');
                            this.carousel.instance.destroy(true, true);
                            this.carousel.instance = null;
                            this.carousel.swiperinstance = null;
                        }, this),
                        build : $.proxy(function () {
                            if (this.carousel.instance != null) return;
                            this.carousel.instance = new HiveSwiper(this.carouselWrap, this.opts.carouselOpts);
                            this.opts.currentIndex = this.opts.carouselOpts.initialSlide;
                            this.carousel.swiperinstance = this.carousel.instance.carousel;
                            this.carousel.swiperinstance.on('transitionStart', $.proxy(function () {
                                var index = this.carousel.swiperinstance.realIndex;
                                if (this.opts.currentIndex == index) return;
                                this.contents.play(index);
                            }, this));
                            this.carousel.swiperinstance.on('transitionEnd', $.proxy(function () {
                                var index = this.carousel.swiperinstance.realIndex;
                                if (this.opts.currentIndex == index) return;
                                this.opts.currentIndex = index;
                            }, this));
                            this.contents.play(this.carousel.swiperinstance.realIndex);
                        }, this)
                    }
                });
            },
            buildSticky : function () {
                Util.def(this, {
                    sticky : {
                        instance : null,
                        build : $.proxy(function () {
                            this.opts.stickyOpts['overedElements'] = this.obj;
                            this.sticky.instance = new win.g2.cpSpecs.HiveSticky(this.carouselWrap, this.opts.stickyOpts);
                        }, this)
                    }
                });
                this.sticky.build();
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
                    this.selectPlaceHolder.on(this.changeEvents('mousedown click'), $.proxy(this.placeholderFunc, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.selectPlaceHolder.off(this.changeEvents('mousedown click'));
                }
            },
            placeholderFunc : function (e) {
                var target = $(e.currentTarget);
                if (e.type === 'mousedown') {
                    this.opts.useCloseFocus = false;
                } else if (e.type === 'click') {
                    var targetWrap = target.closest(this.opts.jsSelectWrap),
                        targetIndex = this.jsSelectWrap.index(targetWrap),
                        targetOptions = targetWrap.find(this.opts.selectOptions);
                    if (this.opts.sizeAttr.swiper == RESPONSIVE.MOBILE.NAME) {
                        if (targetWrap.hasClass(this.opts.classAttr.opened)) {
                            this.select.move(targetIndex);
                        } else {
                            this.select.default(targetIndex);
                        }
                    }
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
                    if (this.opts.sizeAttr.swiper !== RESPONSIVE.MOBILE.NAME) {
                        this.opts.sizeAttr.swiper = RESPONSIVE.MOBILE.NAME;
                        this.carousel.build();
                        this.select.destroy();
                    }
                } else {
                    if (this.opts.sizeAttr.swiper !== 'OTHER') {
                        this.opts.sizeAttr.swiper = 'OTHER';
                        this.carousel.destroy();
                        this.contents.destroy();
                        this.select.destroy();
                    }
                }
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
                obj : '.cp-spec'
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
                    new win.g2.cpSpecs.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
