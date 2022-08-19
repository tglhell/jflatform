(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.galleryWithTab = global.g2.galleryWithTab || {};
    global.g2.galleryWithTab.Component = factory();
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
                jsPicture : '.js-animate-picture',
                cpTabsWrap : '.cp-gallery-with-tabs__wrap',
                cmBtnSwiper : '.cp-swiper-tab-area',
                cmTabContent : '.cm-tab-content',
                cmTabItem : '.cm-tab-item',
                galleryLayerWrap : '.cp-gallery-layer-wrap',
                cmLayer : '.cm-layer',
                globalText : {},
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
                this.buildHiveTab();
                this.buildTab();
                this.buildLayer();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.cpTabsWrap = this.obj.find(this.opts.cpTabsWrap);
                this.cmTabContent = this.obj.find(this.opts.cmTabContent);
                this.cmTabItem = this.cmTabContent.find(this.opts.cmTabItem);
                this.cmBtnSwiper = this.obj.find(this.opts.cmBtnSwiper);
                this.galleryLayerWrap = this.obj.find(this.opts.galleryLayerWrap);
                this.galleryLayer = this.galleryLayerWrap.find(this.opts.cmLayer);
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
            buildHiveTab : function () {
                Util.def(this, {
                    hivetab : {
                        instance : null,
                        build : $.proxy(function () {
                            if (this.cpTabsWrap.length) {
                                this.hivetab.instance = new HiveTab(this.cpTabsWrap);
                            }
                        }, this)
                    }
                });
                this.hivetab.build();
            },
            buildTab : function () {
                new Tab(this.cmBtnSwiper);
            },
            buildLayer : function () {
                Util.def(this, {
                    layers : {
                        instance : [],
                        hasValue : false,
                        build : $.proxy(function () {
                            var build = $.proxy(function (obj, min) {
                                var layerInstance = new Layer(obj, {
                                    tabItem : this.cmTabItem.eq(min),
                                    on : {
                                        loaded : $.proxy(function (instance) {
                                            if (instance.opts.location.hasValue) {
                                                this.layers.hasValue = true;
                                                var tabname = obj.attr('data-tabtarget');
                                                this.cmBtnSwiper.find('.tab-btn').filter('[data-tabtarget-name="' + tabname + '"]').triggerHandler('click');
                                                this.tabStart();
                                            }
                                        }, this)
                                    }
                                });
                                this.layers.instance.push(layerInstance);
                            }, this)
                            for (var i = 0, max = this.galleryLayer.length; i < max; i++) {
                                var galleryLayer = this.galleryLayer.eq(i);
                                build(galleryLayer, i);
                            }
                            if (!this.layers.hasValue) {
                                this.loadComponent();
                            }
                        }, this)
                    }
                });
                this.layers.build();
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
                this.cpTabsWrap.on(this.changeEvents('hiveTabStart'), $.proxy(this.tabStart, this));
            },
            tabStart : function () {
                var instance = this.hivetab.instance;
                var index = instance.opts.currentIndex;
                var jsPictures = instance.cmTabItem.eq(index).find(this.opts.jsPicture);
                for (var i = 0, max = jsPictures.length; i < max; i++) {
                    (function (index) {
                        var jsPicture = jsPictures.eq(index);
                        if (jsPicture.attr('data-load') != 'true') {
                            jsPicture.attr('data-load', 'true');
                            new PictureImg(jsPicture);
                        }
                    })(i);
                }
            },
            loadComponent : function () {
                this.tabStart();
            },
            reInit : function () {
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
        function Layer (container, args) {
            var defParams = {
                obj : container,
                tabItem : null,
                galleryItem : '.img-gallery-box',
                galleryLink : '.js-layer-opener',
                layerObjDimmed : '.cm-layer__dimmed',
                layerObjBody : '.cm-layer__body',
                layerObjWrapper : '.cm-layer__wrapper',
                layerOpts : {
                    effect : 'default',
                    customToggle : true,
                    useScrollLock : false
                },
                jsPicture : '.js-animate-picture',
                carouselInstance : null,
                carouselOpts : {
                    slidesPerView : 'auto',
                    customFocus : false,
                    centeredSlides : true
                },
                carouselWrap : '.cm-layer__content-inner',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselImg : '.slide-image',
                foldTxtWrap : '.fold-text-wrap',
                foldTxtBtn : '.fold-text-btn',
                swiperInstance : null,
                currentIndex : null,
                shareObj : '.js-share',
                layerInstance : null,
                isTweenTraisition : false,
                location : {
                    hasValue : false,
                    isActive : false,
                    pathname : win.location.pathname
                },
                stateAttr : {
                    ID : 'componentID',
                    INDEX : 'slide'
                },
                classAttr : {
                    hasDescription : 'has-description'
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    loaded : null,
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        Layer.prototype = {
            init : function () {
                this.setElements();
                this.buildLayer();
                this.buildFoldTxt();
                this.buildShare();
                this.bindEvents(true);
                this.bindCallBackEvents();
                this.loadComponent();
                this.outCallback('loaded');
            },
            setElements : function () {
                this.galleryItem = this.opts.tabItem.find(this.opts.galleryItem);
                this.galleryLink = this.galleryItem.find(this.opts.galleryLink);
                this.layerObjDimmed = this.obj.find(this.opts.layerObjDimmed);
                this.layerObjBody = this.obj.find(this.opts.layerObjBody);
                this.layerObjWrapper = this.obj.find(this.opts.layerObjWrapper);
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.carouselImg = this.slides.find(this.opts.carouselImg);
                this.foldTxtWrap = this.slides.find(this.opts.foldTxtWrap);
            },
            buildLayer : function () {
                this.opts.layerInstance = new HiveLayer(this.obj, this.opts.layerOpts);
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
                                            win.setTimeout($.proxy(function () {
                                                this.arrowPosition();
                                            }, this), duration);
                                        }, this),
                                        deactive : $.proxy(function () {
                                            var duration = 200;
                                            this.updateAutoHeight(duration);
                                            win.setTimeout($.proxy(function () {
                                                this.arrowPosition();
                                            }, this), duration);
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
                    this.galleryLink.on(this.changeEvents('click'), $.proxy(this.galleryLinkClick, this));
                } else {
                    this.galleryLink.off(this.changeEvents('click'));
                }
            },
            getMaxIndex : function (index) {
                var _index = index,
                    maxIndex = this.slides.length - 1;
                if (_index == isUndefined || _index < 0) {
                    _index = 0;
                } else {
                    if (maxIndex < _index) {
                        _index = maxIndex;
                    }
                }
                return _index;
            },
            galleryLinkClick : function (e) {
                var _target = $(e.currentTarget),
                    _index = _target.data('swiper-index');
                this.opts.carouselOpts.initialSlide = this.getMaxIndex(_index);
            },
            bindCallBackEvents : function () {
                this.obj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.obj.on(this.changeEvents('layerCloseBefore'), $.proxy(this.closeBeforeFunc, this));
            },
            setScrollLock : function (type) {
                Util.scrollLock(type);
                $('html').toggleClass('is-layer-open', type);
            },
            openBeforeFunc : function (e, data) {
                if (data) {
                    if (data.opts.openerTarget == null) {
                        this.openerTarget = null;
                    } else {
                        this.openerTarget = $(data.opts.openerTarget[0]);
                    }
                }
                this.setScrollLock(true);
                this.obj.css({
                    'opacity' : 0,
                    'display' : 'block'
                });
                this.buildPictureImg();
                this.buildCarousel();
                this.controlDescription();
                this.toggleAnimation('show', this.opts.carouselOpts.initialSlide);
            },
            closeBeforeFunc : function () {
                this.toggleAnimation('hide', this.opts.currentIndex);
            },
            saveComponent : function (index) {
                var stateAttr = this.opts.stateAttr;
                var hasStateID = false;
                var hasStateINDEX = false;
                var search = $.trim(win.location.search.replace('?', ''));
                var aSearch = search.length ? search.split('&') : [];
                var currentPath = this.opts.location.pathname;
                if (index == null) {
                    for (var i = 0, max = aSearch.length; i < max; i++) {
                        var a = aSearch[i];
                        if ((a.indexOf(stateAttr.ID) != -1) || (a.indexOf(stateAttr.INDEX) != -1)) {
                            aSearch.splice(i, 1);
                            i--;
                            max--;
                        }
                    }
                    if (aSearch.length) {
                        win.history.replaceState(null, null, currentPath + '?' + aSearch.join('&'));
                    } else {
                        win.history.replaceState(null, null, currentPath);
                    }
                } else {
                    for (var i = 0, max = aSearch.length; i < max; i++) {
                        var a = aSearch[i];
                        if (a.indexOf(stateAttr.ID) != -1) {
                            aSearch[i] = stateAttr.ID + '=' + this.obj.attr('id');
                            hasStateID = true;
                        }
                        if (a.indexOf(stateAttr.INDEX) != -1) {
                            aSearch[i] = stateAttr.INDEX + '=' + index;
                            hasStateINDEX = true;
                        }
                    }
                    if (!hasStateID) {
                        aSearch.push(stateAttr.ID + '=' + this.obj.attr('id'));
                    }
                    if (!hasStateINDEX) {
                        aSearch.push(stateAttr.INDEX + '=' + index);
                    }
                    win.history.replaceState(null, null, currentPath + '?' + aSearch.join('&'));
                }
            },
            loadComponent : function () {
                var search = $.trim(win.location.search.replace('?', ''));
                if (!search.length) return;
                var options = search.split('&'),
                    props = {};
                for (var osMin = 0, osMax = options.length; osMin < osMax; osMin++) {
                    var option = options[osMin],
                        keyVal = option.split('=');
                    props[keyVal[0]] = keyVal[1];
                }
                if (props['componentID'] !== this.obj.attr('id')) return;
                this.opts.location.isActive = true;
                this.opts.location.hasValue = true;
                this.opts.carouselOpts.initialSlide = this.getMaxIndex(parseFloat(props['slide']));
                this.obj.trigger('openLayer');
            },
            controlDescription : function () {
                if (this.opts.swiperInstance == null) return;
                var index = this.opts.swiperInstance.realIndex,
                    slides = this.slides,
                    activeEl = slides.eq(index),
                    activeElDesc = activeEl.find(this.opts.foldTxtBtn);
                if (activeElDesc.length) {
                    this.carouselContainer.addClass(this.opts.classAttr.hasDescription);
                } else {
                    this.carouselContainer.removeClass(this.opts.classAttr.hasDescription);
                }
            },
            buildPictureImg : function () {
                var _this = this;
                var jsPictures = this.obj.find(this.opts.jsPicture);
                for (var i = 0, max = jsPictures.length; i < max; i++) {
                    (function (index) {
                        var jsPicture = jsPictures.eq(index);
                        if (jsPicture.attr('data-load') != 'true') {
                            jsPicture.attr('data-load', 'true');
                            new PictureImg(jsPicture);
                        }
                    })(i);
                }
                Util.imgLoaded(jsPictures).done($.proxy(function () {
                    win.setTimeout($.proxy(function () {
                        this.updateCarousel();
                    }, this), 70);
                }, this));
            },
            arrowPosition : function () {
                if (this.opts.carouselInstance == null) return;
                var winWidth = Util.winSize().w;
                if (winWidth < RESPONSIVE.MOBILE.WIDTH) {
                    this.swiperSize = RESPONSIVE.MOBILE.NAME;
                    var topSize = this.carouselWrap.position().top + (this.carouselImg.eq(0).outerHeight() / 2);
                    this.swiperTween = TweenLite.to(this.swiperArrowBtns, (250 / 1000), {
                        top : topSize
                    });
                } else {
                    if (this.swiperSize !== 'OTHER') {
                        this.swiperSize = 'OTHER';
                        if (this.swiperTween != null) {
                            this.swiperTween.kill();
                        }
                        this.swiperArrowBtns.css('top', '');
                    }
                }
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.carouselWrap, this.opts.carouselOpts);
                    this.swiperBtnNextWrap = this.opts.carouselInstance.carouselBtnNext.parent();
                    this.swiperBtnPrevWrap = this.opts.carouselInstance.carouselBtnPrev.parent();
                    this.swiperArrowBtns = this.swiperBtnNextWrap.add(this.swiperBtnPrevWrap);
                    this.swiperSize = null;
                    this.swiperTween = null;
                    this.opts.currentIndex = this.opts.carouselOpts.initialSlide;
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.opts.swiperInstance.on('resize', $.proxy(function () {
                        win.clearTimeout(this.resizeEndTime);
                        this.resizeEndTime = win.setTimeout($.proxy(function () {
                            this.updateCarousel();
                            this.arrowPosition();
                        }, this), 150);
                    }, this));
                    this.opts.swiperInstance.on('tweenTransitionStart', $.proxy(function () {
                        this.opts.isTweenTraisition = true;
                        this.share.close(this.opts.currentIndex);
                    }, this));
                    this.opts.swiperInstance.on('transitionStart', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.share.mo.sync(index);
                        if (!this.opts.isTweenTraisition) {
                            this.share.close(this.opts.currentIndex);
                        }
                    }, this));
                    this.opts.swiperInstance.on('transitionEnd', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        this.opts.isTweenTraisition = false;
                        if (this.opts.currentIndex == index) return;
                        this.arrowPosition();
                        this.controlDescription();
                        this.saveComponent(index);
                        this.opts.currentIndex = index;
                    }, this));
                    this.arrowPosition();
                    this.foldtxt.build();
                    this.share.mo.sync(this.opts.currentIndex);
                    this.saveComponent(this.opts.currentIndex);
                }
            },
            updateCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.update();
            },
            updateAutoHeight : function (speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.updateAutoHeight(speed);
            },
            slideToLoop : function (index, speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.slideToLoop(index, speed);
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('tweenTransitionStart transitionStart transitionEnd resize');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            toggleAnimation : function (type, index) {
                var galleryLink = this.galleryLink.filter('[data-swiper-index="' + index + '"]'),
                    isLocationActive = this.opts.location.isActive || !galleryLink.length,
                    speed = {
                        showDelay : isLocationActive ? 0 : 200,
                        hideDelay : isLocationActive ? 0 : 100,
                        tweens : isLocationActive ? 0 : 450,
                        animate : isLocationActive ? 0 : 450
                    };
                if (type === 'show') {
                    var tweenOpts = {
                        'set' : {
                            opacity : 0
                        },
                        'to' : {
                            delay : speed.showDelay / 1000,
                            opacity : 1,
                            display : 'block'
                        }
                    };
                    var animationStep = {
                        1 : $.proxy(function (callback) {
                            TweenLite.set(this.obj, tweenOpts['set']);
                        }, this),
                        2 : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            tweenOpts['to']['onComplete'] = cb;
                            TweenLite.to(this.obj, speed.tweens / 1000, tweenOpts['to']);
                            Util.findFocus(this.layerObjWrapper);
                        }, this),
                        3 : $.proxy(function (callback) {
                            // this.obj.stop().animate({'opacity' : 1}, speed.animate, $.proxy(function () {
                            //     animationStep['4']();
                            // }, this));
                        }, this),
                        4 : $.proxy(function (callback) {
                            // this.obj.css(basicCss);
                        }, this)
                    };
                    animationStep['1']();
                    animationStep['2'](animationStep['3']);
                } else {
                    var tweenOpts = {
                        'set' : {
                            opacity : 1
                        },
                        'to' : {
                            delay : speed.hideDelay / 1000,
                            opacity : 0,
                            display : 'none'
                        }
                    };
                    var animationStep = {
                        1 : $.proxy(function (callback) {
                            TweenLite.set(this.obj, tweenOpts['set']);
                        }, this),
                        2 : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            tweenOpts['to']['onComplete'] = animationStep['4'];
                            TweenLite.to(this.obj, speed.tweens / 1000, tweenOpts['to']);
                            // this.obj.stop().animate({'opacity' : 0}, speed.animate, $.proxy(function () {
                            //     cb();
                            // }, this));
                        }, this),
                        3 : $.proxy(function (callback) {
                            // tweenOpts['to']['onComplete'] = animationStep['4'];
                            // TweenLite.to(this.obj, speed.tweens / 1000, tweenOpts['to']);
                        }, this),
                        4 : $.proxy(function (callback) {
                            this.foldtxt.kill();
                            this.share.closeAll();
                            this.destroyCarousel();
                            this.obj.hide();
                            this.setScrollLock(false);
                            // this.obj.css(basicCss);
                            this.saveComponent(null);
                        }, this)
                    };
                    animationStep['1']();
                    animationStep['2'](animationStep['3']);
                }
                this.opts.location.isActive = false;
            },
            controlSwiping : function (type) {
                this.carouselContainer.toggleClass('swiper-no-swiping', !type);
            },
            buildShare : function () {
                Util.def(this, {
                    share : {
                        downloadurls : {},
                        active : $.proxy(function (num) {
                            this.share.pc.open(num);
                            this.share.mo.open();
                            this.controlSwiping(false);
                        }, this),
                        deactive : $.proxy(function (num) {
                            this.share.pc.close(num);
                            this.share.mo.close();
                            this.controlSwiping(true);
                        }, this),
                        close : $.proxy(function (num) {
                            this.share.deactive(num);
                        }, this),
                        closeAll : $.proxy(function () {
                            this.share.pc.closeAll();
                            this.share.mo.close();
                            this.controlSwiping(true);
                        }, this)
                    }
                });
                this.buildShareData();
            },
            buildShareData : function () {
                var _this = this;
                Util.def(this, {
                    share : {
                        pc : {
                            instance : {},
                            open : $.proxy(function (num) {
                                var prop = this.share.pc.instance[num];
                                prop.open();
                            }, this),
                            close : $.proxy(function (num) {
                                var prop = this.share.pc.instance[num];
                                prop.close();
                            }, this),
                            closeAll : $.proxy(function () {
                                for (var pKey in this.share.pc.instance) {
                                    (function (key) {
                                        var prop = _this.share.pc.instance[key];
                                        if (prop.isActive) {
                                            _this.share.pc.close(key);
                                        }
                                    })(pKey);
                                }
                            }, this)
                        }
                    }
                });
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

                // pc
                for (var min = 0, max = this.slides.length; min < max; min++) {
                    var slide = this.slides.eq(min),
                        slideImg = slide.find(this.opts.carouselImg),
                        shareObj = slide.find(this.opts.shareObj);
                    this.share.downloadurls[min] = slideImg.attr('data-download-url');
                    this.share.pc.instance[min] = buildShare(shareObj);
                }

                // mo
                var moShareObj = this.carouselWrap.find('>' + this.opts.shareObj);
                Util.def(this, {
                    share : {
                        mo : buildShare(moShareObj)
                    }
                });
                this.share.mo.sync = $.proxy(function (num) {
                    var downloadEl = moShareObj.find('[data-icon="svg-download"]').closest('.share-item-link');
                    downloadEl.attr('href', this.share.downloadurls[num]);
                }, this);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
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
                obj : '.cp-gallery-with-tabs'
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
                    new win.g2.galleryWithTab.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
