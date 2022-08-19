(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpIndexVehicle = global.g2.cpIndexVehicle || {};
    global.g2.cpIndexVehicle.Component = factory();
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
                panelWrap : '.cp-index-vehicle__panel-wrap',
                panelItem : '.cp-index-vehicle__panel',
                panelMedia : '.cp-index-vehicle__selc-media',
                carouselInstance : null,
                carouselOpts : {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    breakpoints: {
                        768: {
                            slidesPerView: 4,
                            slidesPerGroup: 4
                        }
                    }
                },
                carouselWrap : '.cp-index-vehicle__tab-swiper',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                thumbTab : 'a.cp-index-vehicle__tab-item',
                tabLineInner : '.line-inner',
                duration : 200,
                swiperInstance : null,
                currentIndex : null,
                isBlankControl : {
                    active : false,
                    num : 0
                },
                classAttr : {
                    active : 'is-active',
                    selected : 'is-selected',
                    hover : 'is-hover',
                    right : 'is-right'
                },
                ariaAttr : {
                    selected : 'aria-selected'
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
                this.buildCmVideo();
                this.buildHeightMatch();
                this.buildCarousel();
                this.buildLineup();
                this.bindEvents();
                this.loadComponent();
            },
            setElements : function () {
                this.panelWrap = this.obj.find(this.opts.panelWrap);
                this.panelItem = this.panelWrap.find(this.opts.panelItem);
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.carouselContainer = this.carouselWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
                this.thumbTab = this.slides.find(this.opts.thumbTab);
            },
            buildCmVideo : function () {
                Util.def(this, {
                    cmvideo : {
                        instance : [],
                        play : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == null) return;
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
                        }, this)
                    }
                });
                for (var min = 0, max = this.panelItem.length; min < max; min++) {
                    var panelItem = this.panelItem.eq(min),
                        panelMedia = panelItem.find(this.opts.panelMedia),
                        panelMedia = panelMedia.find('.js-video');
                    if (panelMedia.length) {
                        this.cmvideo.instance.push(panelMedia.data('HiveVideo'));
                    } else {
                        this.cmvideo.instance.push(null);
                    }
                }
            },
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.cp-index-vehicle__tab-title'],
                        matchCommonOpts : {
                            column : this.slides.length,
                            childElement : '>'+this.opts.carouselItem
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
            controlBlank : function () {
                if (this.opts.carouselInstance == null) return;
                var params = this.opts.swiperInstance.params,
                    slidesPerGroup = params.slidesPerGroup,
                    slideNum = this.slides.length,
                    viewNum = Math.ceil(slideNum / slidesPerGroup),
                    isMOBILE = RESPONSIVE.MOBILE.WIDTH > Util.winSize().w;
                if (isMOBILE) {
                    if (this.opts.isBlankControl.active) {
                        var layout = [];
                        for (var addMin = 0, addMax = this.opts.isBlankControl.num; addMin < addMax; addMin++) {
                            layout.push(slideNum + addMin);
                        }
                        this.opts.swiperInstance.removeSlide(layout);
                        this.opts.isBlankControl.active = false;
                    }
                } else {
                    if (slideNum < (slidesPerGroup * viewNum)) {
                        var layout = [],
                            addSlides = (slidesPerGroup * viewNum) - slideNum;
                        for (var addMin = 0, addMax = addSlides; addMin < addMax; addMin++) {
                            layout.push('<div class="swiper-slide"><div class="slide-inner"></div></div>');
                        }
                        this.opts.isBlankControl.active = true;
                        this.opts.isBlankControl.num = addSlides;
                        this.opts.swiperInstance.addSlide(slideNum, layout);
                    }
                }
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
                    this.opts.swiperInstance.on('breakpoint', $.proxy(function () {
                        this.controlBlank();
                    }, this));
                    this.controlBlank();
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
            barAnimate : function (index) {
                var tabBtns = this.thumbTab,
                    range = Math.abs(this.lineup.currentIndex - index),
                    devide = 100 / range,
                    props = [];
                if (this.lineup.currentIndex < index) {
                    for (var cMin = this.lineup.currentIndex, cMax = index; cMin <= cMax; cMin++) {
                        var index = props.length,
                            tabBtn = tabBtns.eq(cMin);
                        if (index == 0) {
                            props.push({
                                'TARGET' : tabBtn,
                                'INDEX' : cMin
                            });
                        } else {
                            props.push({
                                'TARGET' : tabBtn,
                                'INDEX' : cMin,
                                'MIN' : (index - 1) * devide,
                                'MAX' : index * devide,
                                'PROGRESS' : 0
                            });
                        }
                    }
                } else if (this.lineup.currentIndex > index) {
                    for (var cMax = this.lineup.currentIndex, cMin = index; cMin <= cMax; cMax--) {
                        var index = props.length,
                            tabBtn = tabBtns.eq(cMax);
                        if (index == 0) {
                            props.push({
                                'TARGET' : tabBtn,
                                'INDEX' : cMax
                            });
                        } else {
                            props.push({
                                'TARGET' : tabBtn,
                                'INDEX' : cMax,
                                'MIN' : (index - 1) * devide,
                                'MAX' : index * devide,
                                'PROGRESS' : 0
                            });
                        }
                    }
                }
                var demo = {score:0}
                TweenLite.to(demo, (((this.opts.duration * 2) - 30) / 1000), {
                    score : 100,
                    onUpdate : $.proxy(function () {
                        var score = demo.score;
                        for (var pMin = 1, pMax = props.length; pMin < pMax; pMin++) {
                            var prop = props[pMin],
                                prevIndex = pMin - 1,
                                prevProp = props[prevIndex];
                            if (prop['MIN'] < score && prop['MAX'] >= score) {
                                var percent = ((score - prop['MIN']) / (prop['MAX'] - prop['MIN'])) * 100;
                                if (prop['PROGRESS'] == 0) {
                                    if (prop['INDEX'] > prevProp['INDEX']) {
                                        prevProp['TARGET'].closest('.swiper-slide').addClass(this.opts.classAttr.right);
                                        prop['TARGET'].closest('.swiper-slide').removeClass(this.opts.classAttr.right);
                                    } else {
                                        prevProp['TARGET'].closest('.swiper-slide').removeClass(this.opts.classAttr.right);
                                        prop['TARGET'].closest('.swiper-slide').addClass(this.opts.classAttr.right);
                                    }
                                    prevProp['TARGET'].find(this.opts.tabLineInner).css('width', '100%');
                                    if (pMin >= 2) {
                                        props[pMin - 2]['TARGET'].find(this.opts.tabLineInner).css('width', 0);
                                    }
                                } else {
                                    prevProp['TARGET'].find(this.opts.tabLineInner).css('width', (100 - percent) + '%');
                                }
                                prop['TARGET'].find(this.opts.tabLineInner).css('width', percent + '%');
                                prop['PROGRESS']++;
                            }
                        }
                    }, this)
                });
            },
            buildLineup : function () {
                Util.def(this, {
                    lineup : {
                        instances : [],
                        isActive : false,
                        currentIndex : null,
                        hideAll : $.proxy(function (not_index) {
                            for (var min = 0, max = this.lineup.instances.length; min < max; min++) {
                                var instance = this.lineup.instances[min];
                                if ((min != not_index) && instance.component.opts.isActive) {
                                    this.lineup.hide(min);
                                }
                            }
                        }, this),
                        hide : $.proxy(function (index) {
                            var activeInstance = this.lineup.instances[index];
                            if (activeInstance) {
                                var viewFunc = $.proxy(function () {
                                    activeInstance.isActive = false;
                                }, this);
                                activeInstance.component.hide(viewFunc);
                            }
                        }, this),
                        play : $.proxy(function (index) {
                            var activeInstance = this.lineup.instances[index];
                            if (activeInstance) {
                                if (this.lineup.currentIndex == index) return;
                                this.lineup.currentIndex = index;
                                activeInstance.isActive = true;
                                if (this.lineup.isActive) {
                                    this.lineup.patchLayout(true);
                                }
                                var viewFunc = $.proxy(function () {
                                    this.lineup.patchLayout(false);
                                }, this);
                                activeInstance.component.play(viewFunc);
                                this.lineup.hideAll(index);
                                this.lineup.isActive = true;
                            }
                        }, this),
                        patchLayout : $.proxy(function (type) {
                            if (type) {
                                this.panelWrap.css('position', 'relative');
                                var activeItem = this.panelItem.eq(this.lineup.currentIndex);
                                activeItem.css({
                                    'opacity' : 0,
                                    'position' : 'absolute',
                                    'display' : 'block',
                                    'width' : '100%'
                                })
                                this.panelWrap.css({
                                    'height' : Util.getBoundingClientRect(activeItem).height
                                });
                                this.panelItem.css({
                                    'position' : 'absolute',
                                    'width' : '100%'
                                });
                            } else {
                                this.panelWrap.css({
                                    'position' : '',
                                    'height' : ''
                                });
                                this.panelItem.css({
                                    'position' :  '',
                                    'width' : ''
                                });
                            }
                        }, this)
                    }
                });

                for (var min = 0, max = this.panelItem.length; min < max; min++) {
                    var panelItem = this.panelItem.eq(min);
                    var lineUp = new Lineup(panelItem, {
                        on : {
                            selcMediaPlayComplete : $.proxy(function () {
                                this.cmvideo.play(this.lineup.currentIndex);
                            }, this),
                            selcMediaHideComplete : $.proxy(function () {
                                this.cmvideo.pauseAll(this.lineup.currentIndex);
                            }, this)
                        }
                    });
                    var data = {
                        component : lineUp,
                        isActive : false
                    }
                    this.lineup.instances.push(data);
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
            bindEvents : function () {
                this.thumbTab.on(this.changeEvents('click'), $.proxy(this.thumbTabClick, this));
                this.thumbTab.on(this.changeEvents('mouseenter mouseleave'), $.proxy(this.thumbTabHover, this));
            },
            thumbTabClick : function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    _index = this.thumbTab.index(_target);
                this.barAnimate(_index);
                this.syncAria(_index);
                this.syncThumb(_index);
                this.lineup.play(_index);
            },
            thumbTabHover: function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    classAttr = this.opts.classAttr;
                if (e.type == 'mouseenter') {
                    _target.addClass(classAttr.hover);
                } else {
                    _target.removeClass(classAttr.hover);
                }
            },
            syncAria : function (index) {
                var thumbTab = this.thumbTab,
                    activeTab = thumbTab.eq(index),
                    notActiveTab = thumbTab.not(activeTab),
                    classAttr = this.opts.classAttr,
                    ariaAttr = this.opts.ariaAttr;
                activeTab.addClass(classAttr.active).attr(ariaAttr.selected, 'true');
                notActiveTab.removeClass(classAttr.active).attr(ariaAttr.selected, 'false');
            },
            syncThumb : function (index) {
                this.slides.eq(index).addClass(this.opts.classAttr.selected).siblings().removeClass(this.opts.classAttr.selected);
            },
            loadComponent : function () {
                this.barAnimate(this.opts.currentIndex);
                this.syncAria(this.opts.currentIndex);
                this.syncThumb(this.opts.currentIndex);
                this.lineup.play(this.opts.currentIndex);
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Lineup (container, args) {
            if (!(this instanceof Lineup)) {
                return new Lineup(container, args);
            }
            var defParams = {
                isActive : false,
                selcEyebrow : '.cp-index-vehicle__selc-eyebrow',
                selcTitle : '.cp-index-vehicle__selc-title',
                selcDesc : '.cp-index-vehicle__selc-desc',
                selcMedia : '.cp-index-vehicle__selc-media',
                selcCta : '.cp-index-vehicle__selc-text .cm-btn',
                selcCtaMo : '.cp-index-vehicle__selc-cta',
                tweenAttr : {
                    selcEyebrow : {
                        duration : 1,
                        delay : 0,
                        step1 : {
                            opacity : 0,
                            y : 50
                        },
                        step2 : {
                            opacity : 1,
                            y : 0
                        },
                        step3 : {
                            opacity : 0,
                            y : -50
                        }
                    },
                    selcTitle : {
                        duration : 1,
                        delay : 0,
                        step1 : {
                            opacity : 0,
                            y : 50
                        },
                        step2 : {
                            opacity : 1,
                            y : 0
                        },
                        step3 : {
                            opacity : 0,
                            y : -50
                        }
                    },
                    selcDesc : {
                        duration : 1,
                        delay : 0,
                        step1 : {
                            opacity : 0,
                            y : 50
                        },
                        step2 : {
                            opacity : 1,
                            y : 0
                        },
                        step3 : {
                            opacity : 0,
                            y : -50
                        }
                    },
                    selcCta : {
                        duration : 1,
                        delay : .2,
                        step1 : {
                            opacity : 0,
                        },
                        step2 : {
                            opacity : 1,
                        },
                        step3 : {
                            opacity : 0,
                        }
                    },
                    selcCtaMo : {
                        duration : 1,
                        delay : .2,
                        step1 : {
                            opacity : 0,
                        },
                        step2 : {
                            opacity : 1,
                        },
                        step3 : {
                            opacity : 0,
                        }
                    },
                    selcMedia : {
                        duration : .5,
                        delay : 0,
                        step1 : {
                            opacity : 0
                        },
                        step2 : {
                            opacity : 1
                        },
                        step3 : {
                            opacity : 0
                        }
                    }
                },
                showTime : null,
                classAttr : {
                    active : 'is-active'
                },
                ariaAttr : {
                    hidden : 'aria-hidden'
                },
                on : {
                    selcMediaPlayComplete : null,
                    selcMediaHideComplete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Lineup.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.initLayout();
            },
            setElements : function () {
                this.selcEyebrow = this.obj.find(this.opts.selcEyebrow);
                this.selcTitle = this.obj.find(this.opts.selcTitle);
                this.selcDesc = this.obj.find(this.opts.selcDesc);
                this.selcMedia = this.obj.find(this.opts.selcMedia);
                this.selcCta = this.obj.find(this.opts.selcCta);
                this.selcCtaMo = this.obj.find(this.opts.selcCtaMo);
            },
            initOpts : function () {
                var tweenAttr = this.opts.tweenAttr,
                    aDurations = [];
                for (var key in tweenAttr) {
                    aDurations.push((tweenAttr[key].duration + tweenAttr[key].delay) * 1000);
                }
                this.allduration = Math.max.apply(null, aDurations);
            },
            initLayout : function () {
                this.obj.removeClass(this.opts.classAttr.active);
                this.selcEyebrow.css('opacity', 0);
                this.selcTitle.css('opacity', 0);
                this.selcDesc.css('opacity', 0);
                this.selcMedia.css('opacity', 0);
                this.selcCta.css('opacity', 0);
                this.selcCtaMo.css('opacity', 0);
            },
            play : function (callback) {
                var cb = callback || function () {};
                this.opts.isActive = true;
                var tweenAttr = this.opts.tweenAttr;
                this.obj.addClass(this.opts.classAttr.active);
                this.obj.css({
                    'zIndex' : 10,
                    'opacity' : ''
                });
                this.obj.attr(this.opts.ariaAttr.hidden, 'false');
                var complete = $.proxy(function (key) {
                    var _this = this;
                    return (function (d) {
                        return function (d) {
                            _this[key].css('transform', '');
                            _this.outCallback(key + 'PlayComplete');
                        };
                    })(key);
                }, this);
                for (var key in tweenAttr) {
                    var step2 = Util.def({
                        delay : tweenAttr[key].delay,
                        onComplete : complete(key)
                    }, tweenAttr[key].step2);
                    TweenLite.fromTo(this[key], tweenAttr[key].duration, tweenAttr[key].step1, step2);
                }
                win.clearTimeout(this.opts.showTime);
                this.opts.showTime = win.setTimeout($.proxy(function () {
                    this.obj.css('zIndex', '');
                    cb();
                }, this), this.allduration);
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.opts.isActive = false;
                var tweenAttr = this.opts.tweenAttr;
                var complete = $.proxy(function (key) {
                    var _this = this;
                    return (function (d) {
                        return function (d) {
                            _this[key].css('transform', '');
                            _this.outCallback(key + 'HideComplete');
                        };
                    })(key);
                }, this);
                for (var key in tweenAttr) {
                    var step3 = Util.def({
                        delay : tweenAttr[key].delay,
                        onComplete : complete(key)
                    }, tweenAttr[key].step3);
                    TweenLite.to(this[key], tweenAttr[key].duration, step3);
                }
                this.obj.css('zIndex', '');
                this.obj.attr(this.opts.ariaAttr.hidden, 'true');
                TweenLite.to(this.obj, (250 / 1000), {
                    opacity : 0,
                    display : 'none'
                });
                win.clearTimeout(this.opts.showTime);
                this.opts.showTime = win.setTimeout($.proxy(function () {
                    this.obj.removeClass(this.opts.classAttr.active);
                    cb();
                }, this), this.allduration);
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
                obj : '.cp-index-vehicle'
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
                    new win.g2.cpIndexVehicle.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
