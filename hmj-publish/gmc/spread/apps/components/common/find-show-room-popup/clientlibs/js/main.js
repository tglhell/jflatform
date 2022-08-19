(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpLayerShowRoom = global.g2.cpLayerShowRoom || {};
    global.g2.cpLayerShowRoom.Component = factory();
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
                layerObj : container,
                jsPicture : '.js-picture',
                carouselOpts : {
                    spaceBetween : 15,
                    slidesPerView : 4,
                    breakpoints : {
                        768 : {
                            spaceBetween : 20
                        }
                    }
                },
                carouselInstance : null,
                carouselWrap : '.models-slider__wrap',
                carouselContainer : '.swiper-container',
                panelList : '.models-slider__panel',
                panelItem : '.models-slider__panel-item',
                thumbTab : 'a.models-slider__nav-item',
                swiperInstance : null,
                currentIndex : null,
                classAttr : {
                    active : 'is-active',
                    selected : 'is-selected'
                },
                ariaAttr : {
                    selected : 'aria-selected'
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.layerObj = $(this.opts.layerObj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.bindCallBackEvents();
            },
            setElements : function () {
                this.jsPicture = this.layerObj.find(this.opts.jsPicture);
                this.carouselWrap = this.layerObj.find(this.opts.carouselWrap);
                this.thumbTab = this.carouselWrap.find(this.opts.thumbTab);
                this.panelList = this.layerObj.find(this.opts.panelList);
                this.panelItem = this.panelList.find(this.opts.panelItem);
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindCallBackEvents : function () {
                this.layerObj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.layerObj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
            },
            openBeforeFunc : function () {
                this.layerObj.css({
                    'opacity' : 0,
                    'display' : 'block'
                });
                this.setElements();
                this.buildPictureImg();
                this.buildCarousel();
                this.buildLineup();
                this.loadComponent();
                this.bindEvents(true);
            },
            closeAfterFunc : function () {
                this.destroyCarousel();
                this.destroyLineup();
                this.bindEvents(false);
            },
            loadComponent : function () {
                this.syncAria(this.opts.currentIndex);
                this.lineup.play(this.opts.currentIndex);
            },
            buildPictureImg : function () {
                var notLoaded = this.jsPicture.not('[data-load="true"]');
                for (var i = 0, max = notLoaded.length; i < max; i++) {
                    (function (index) {
                        new PictureImg(notLoaded.eq(index));
                    })(i);
                }
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.carouselWrap, this.opts.carouselOpts);
                    this.opts.currentIndex = this.opts.carouselOpts.initialSlide;
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
                }
                this.opts.currentIndex = this.opts.swiperInstance.realIndex;
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('transitionStart transitionEnd breakpoint');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            buildLineup : function () {
                Util.def(this, {
                    lineup : {
                        init : false,
                        instances : [],
                        currentIndex : null,
                        isAllHide : $.proxy(function () {
                            var flag = true;
                            for (var min = 0, max = this.lineup.instances.length; min < max; min++) {
                                var instance = this.lineup.instances[min];
                                if (instance.isActive) {
                                    flag = false;
                                }
                            }
                            return flag;
                        }, this),
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
                                    this.lineup.allHideToPlay();
                                }, this);
                                activeInstance.component.hide(viewFunc);
                            }
                        }, this),
                        allHideToPlay : $.proxy(function () {
                            var isAllHide = this.lineup.isAllHide();
                            if (isAllHide) {
                                var activeInstance = this.lineup.instances[this.lineup.currentIndex];
                                if (!activeInstance.component.opts.isActive) {
                                    activeInstance.isActive = true;
                                    activeInstance.component.play();
                                }
                            }
                        }, this),
                        play : $.proxy(function (index) {
                            var activeInstance = this.lineup.instances[index];
                            if (activeInstance) {
                                this.lineup.currentIndex = index;
                                if (!this.lineup.init) {
                                    this.lineup.init = true;
                                    activeInstance.isActive = true;
                                    activeInstance.component.play();
                                } else {
                                    this.lineup.hideAll(index);
                                }
                            }
                        }, this),
                        patchLayout : $.proxy(function (type) {
                            if (type) {
                                this.panelWrap.css('height', this.panelWrap.outerHeight(true));
                            } else {
                                this.panelWrap.css('height', '');
                            }
                        }, this),
                        build : $.proxy(function () {
                            for (var min = 0, max = this.panelItem.length; min < max; min++) {
                                var panelItem = this.panelItem.eq(min);
                                var lineUp = new Lineup(panelItem);
                                var data = {
                                    component : lineUp,
                                    isActive : false
                                }
                                this.lineup.instances.push(data);
                            }
                        }, this)
                    }
                });
                this.lineup.build();
            },
            destroyLineup : function () {
            },
            bindEvents : function (type) {
                if (type) {
                    this.thumbTab.on(this.changeEvents('click'), $.proxy(this.thumbTabClick, this));
                } else {
                    this.thumbTab.off(this.changeEvents('click'));
                }
            },
            thumbTabClick : function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    _index = this.thumbTab.index(_target);
                this.syncAria(_index);
                this.lineup.play(_index);
            },
            syncAria : function (index) {
                var thumbTab = this.thumbTab,
                    activeTab = thumbTab.eq(index),
                    notActiveTab = thumbTab.not(activeTab),
                    classAttr = this.opts.classAttr,
                    ariaAttr = this.opts.ariaAttr;
                activeTab.closest('.swiper-slide').addClass(classAttr.selected);
                activeTab.attr(ariaAttr.selected, 'true');
                notActiveTab.closest('.swiper-slide').removeClass(classAttr.selected);
                notActiveTab.attr(ariaAttr.selected, 'false');
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
                selcTitle : '.models-slider__model-text',
                selcImg : '.models-slider__model-img',
                tweenAttr : {
                    selcTitle : {
                        duration : .3,
                        delay : 0,
                        step1 : {
                            opacity : 0,
                            y : -10
                        },
                        step2 : {
                            opacity : 1,
                            y : 0
                        },
                        step3 : {
                            opacity : 0,
                            y : -10
                        }
                    },
                    selcImg : {
                        duration : .3,
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
                this.selcTitle = this.obj.find(this.opts.selcTitle);
                this.selcImg = this.obj.find(this.opts.selcImg);
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
                this.obj.hide();
                this.obj.removeClass(this.opts.classAttr.active);
                this.selcTitle.css('opacity', 0);
                this.selcImg.css('opacity', 0);
            },
            play : function () {
                this.opts.isActive = true;
                var tweenAttr = this.opts.tweenAttr;
                this.obj.css('display', '');
                this.obj.addClass(this.opts.classAttr.active);
                for (var key in tweenAttr) {
                    var step2 = Util.def({
                        delay : tweenAttr[key].delay
                    }, tweenAttr[key].step2);
                    TweenLite.fromTo(this[key], tweenAttr[key].duration, tweenAttr[key].step1, step2);
                }
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.opts.isActive = false;
                var tweenAttr = this.opts.tweenAttr;
                for (var key in tweenAttr) {
                    var step3 = Util.def({
                        delay : tweenAttr[key].delay
                    }, tweenAttr[key].step3);
                    TweenLite.to(this[key], tweenAttr[key].duration, step3);
                }
                win.clearTimeout(this.opts.showTime);
                this.opts.showTime = win.setTimeout($.proxy(function () {
                    this.obj.hide();
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
                obj : '#find-show-room-layer'
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
                    new win.g2.cpLayerShowRoom.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
