(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpGallery = global.g2.cpGallery || {};
    global.g2.cpGallery.Component = factory();
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
                galleryGrid : '.cp-gallery__grid',
                galleryItem : '.cp-gallery__item',
                galleryLink : '.item-link',
                layerObj : '.cm-layer',
                layerObjDimmed : '.cm-layer__dimmed',
                layerObjBody : '.cm-layer__body',
                layerObjWrapper : '.cm-layer__wrapper',
                layerOpts : {
                    effect : 'default',
                    customToggle : true,
                    useScrollLock : false
                },
                carouselInstance : null,
                carouselOpts : {
                    slidesPerView : 'auto',
                    customFocus : false,
                    centeredSlides : true
                },
                carouselWrap : '.cp-gallery__slider',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselImg : '.slide-image',
                carouselTxt : '.fold-text-inner',
                carouselTxtBtn : '.fold-text-btn',
                swiperInstance : null,
                currentIndex : null,
                shareObj : '.js-share',
                layerInstance : null,
                isTweenTraisition : false,
                classAttr : {
                    opened : 'is-opened'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                location : {
                    isActive : false,
                    pathname : win.location.pathname
                },
                stateAttr : {
                    ID : 'componentID',
                    INDEX : 'slide'
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
                this.buildLayer();
                this.buildShare();
                this.bindEvents(true);
                this.bindCallBackEvents();
                this.loadComponent();
            },
            setElements : function () {
                this.galleryGrid = this.obj.find(this.opts.galleryGrid);
                this.galleryItem = this.galleryGrid.find(this.opts.galleryItem);
                this.galleryLink = this.galleryItem.find(this.opts.galleryLink);
                this.layerObj = this.obj.find(this.opts.layerObj);
                this.layerObjDimmed = this.layerObj.find(this.opts.layerObjDimmed);
                this.layerObjBody = this.layerObj.find(this.opts.layerObjBody);
                this.layerObjWrapper = this.layerObj.find(this.opts.layerObjWrapper);
                this.carouselWrap = this.layerObj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.carouselTxt = this.slides.find(this.opts.carouselTxt);
                this.carouselTxtBtn = this.carouselTxt.find(this.opts.carouselTxtBtn);
            },
            buildLayer : function () {
                this.opts.layerInstance = new HiveLayer(this.layerObj, this.opts.layerOpts);
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
                    this.carouselTxtBtn.on(this.changeEvents('click'), $.proxy(this.carouselTxtBtnClick, this));
                } else {
                    this.galleryLink.off(this.changeEvents('click'));
                    this.carouselTxtBtn.off(this.changeEvents('click'));
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
            carouselTxtBtnClick : function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    _slideTxt = _target.closest(this.opts.carouselTxt);
                _slideTxt.toggleClass(this.opts.classAttr.opened);
                if (_slideTxt.hasClass(this.opts.classAttr.opened)) {
                    _target.attr(this.opts.ariaAttr.expanded, 'true');
                } else {
                    _target.attr(this.opts.ariaAttr.expanded, 'false');
                }
            },
            bindCallBackEvents : function () {
                this.layerObj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.layerObj.on(this.changeEvents('layerCloseBefore'), $.proxy(this.closeBeforeFunc, this));
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
                this.layerObj.css({
                    'opacity' : 0,
                    'display' : 'block'
                });
                this.buildCarousel();
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
                            aSearch[i] = stateAttr.ID + '=' + this.layerObj.attr('id');
                            hasStateID = true;
                        }
                        if (a.indexOf(stateAttr.INDEX) != -1) {
                            aSearch[i] = stateAttr.INDEX + '=' + index;
                            hasStateINDEX = true;
                        }
                    }
                    if (!hasStateID) {
                        aSearch.push(stateAttr.ID + '=' + this.layerObj.attr('id'));
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
                if (props['componentID'] !== this.layerObj.attr('id')) return;
                this.opts.location.isActive = true;
                this.opts.carouselOpts.initialSlide = this.getMaxIndex(parseFloat(props['slide']));
                // this.galleryLink.filter('[data-swiper-index="' + parseFloat(props['slide']) + '"]').trigger('clickCustom');
                this.layerObj.trigger('openLayer');
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.carouselWrap, this.opts.carouselOpts);
                    this.opts.currentIndex = this.opts.carouselOpts.initialSlide;
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
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
                        this.saveComponent(index);
                        this.opts.currentIndex = index;
                    }, this));
                    this.share.mo.sync(this.opts.currentIndex);
                    this.saveComponent(this.opts.currentIndex);
                }
            },
            slideToLoop : function (index, speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.slideToLoop(index, speed);
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('tweenTransitionStart transitionStart transitionEnd');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            toggleAnimation : function (type, index) {
                var winTop = $(win).scrollTop(),
                    galleryLink = this.galleryLink.filter('[data-swiper-index="' + index + '"]'),
                    galleryImg = galleryLink.find('.gallery-img'),
                    galleryLinkOffset = galleryLink.length ? galleryLink.offset() : {left : 0, top : 0},
                    slide = this.slides.eq(index),
                    slideOffset = slide.offset(),
                    basicCss = {
                        position : '',
                        zIndex : '',
                        left : '',
                        top : '',
                        width : '',
                        height : ''
                    },
                    isLocationActive = this.opts.location.isActive || !galleryLink.length,
                    speed = {
                        tweens : isLocationActive ? 0 : 800,
                        animate : isLocationActive ? 0 : 500
                    };
                if (type === 'show') {
                    var tweenOpts = {
                        'set' : {
                            position : 'fixed',
                            zIndex : 100,
                            left : galleryLinkOffset.left,
                            top : galleryLinkOffset.top - winTop,
                            width : galleryLink.outerWidth(true),
                            height : galleryLink.outerHeight(true)
                        },
                        'to' : {
                            left : slideOffset.left,
                            top : slideOffset.top - winTop,
                            width : slide.outerWidth(true),
                            height : slide.outerHeight(true),
                            ease : Expo.easeInOut
                        }
                    };
                    var animationStep = {
                        1 : $.proxy(function (callback) {
                            TweenLite.set(galleryImg, tweenOpts['set']);
                        }, this),
                        2 : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            tweenOpts['to']['onComplete'] = cb;
                            TweenLite.to(galleryImg, speed.tweens / 1000, tweenOpts['to']);
                            Util.findFocus(this.layerObjWrapper);
                        }, this),
                        3 : $.proxy(function (callback) {
                            this.layerObj.stop().animate({'opacity' : 1}, speed.animate, $.proxy(function () {
                                animationStep['4']();
                            }, this));
                        }, this),
                        4 : $.proxy(function (callback) {
                            galleryImg.css(basicCss);
                        }, this)
                    };
                    animationStep['1']();
                    animationStep['2'](animationStep['3']);
                } else {
                    var tweenOpts = {
                        'set' : {
                            position : 'fixed',
                            zIndex : 100,
                            left : slideOffset.left,
                            top : slideOffset.top - winTop,
                            width : slide.outerWidth(true),
                            height : slide.outerHeight(true)
                        },
                        'to' : {
                            left : galleryLinkOffset.left,
                            top : galleryLinkOffset.top - winTop,
                            width : galleryLink.outerWidth(true),
                            height : galleryLink.outerHeight(true),
                            ease : Expo.easeInOut
                        }
                    };
                    var animationStep = {
                        1 : $.proxy(function (callback) {
                            TweenLite.set(galleryImg, tweenOpts['set']);
                        }, this),
                        2 : $.proxy(function (callback) {
                            var cb = callback || function () {};
                            this.layerObj.stop().animate({'opacity' : 0}, speed.animate, $.proxy(function () {
                                cb();
                            }, this));
                        }, this),
                        3 : $.proxy(function (callback) {
                            tweenOpts['to']['onComplete'] = animationStep['4'];
                            TweenLite.to(galleryImg, speed.tweens / 1000, tweenOpts['to']);
                        }, this),
                        4 : $.proxy(function (callback) {
                            this.share.closeAll();
                            this.destroyCarousel();
                            this.layerObj.stop().hide();
                            this.setScrollLock(false);
                            galleryImg.css(basicCss);
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
                var moShareObj = this.carouselContainer.find('>' + this.opts.shareObj);
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
                obj : '.cp-gallery'
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
                    new win.g2.cpGallery.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
