(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cardList = global.g2.cardList || {};
    global.g2.cardList.Component = factory();
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
                tabArea : '.cp-card-list__tab',
                tabInner : '.cp-card-list__tab-inner',
                tabSelectBtn : '.select-btn',
                tabSelectText : '> span',
                tabList : '.cp-card-list__tab-list',
                tabItem : '.cp-card-list__tab-item',
                tabLink : '.cp-card-list__tab-link',
                carouselInstance : null,
                swiperInstance : null,
                carouselOpts : {
                    slidesPerView : 4,
                    speed : 350,
                    breakpoints : {
                        1024 : {
                            slidesPerView : 6
                        }
                    }
                },
                tabPanel : '.cp-card-list__panel',
                tabPanelCard : '.cp-card-list__panel-card',
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                classAttr : {
                    opened : 'is-opened',
                    selected : 'is-selected'
                },
                activeAttr : {
                    moOpen : false
                },
                sizeAttr : {
                    swiper : null
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
                this.initOpts();
                this.buildHeightMatch();
                this.buildTabPanel();
                this.resizeFunc();
                this.bindEvents(true);
                this.bindCallbackEvents();
                this.loadComponent();
            },
            setElements : function () {
                this.tabArea = this.obj.find(this.opts.tabArea);
                this.tabInner = this.tabArea.find(this.opts.tabInner);
                this.tabSelectBtn = this.tabInner.find(this.opts.tabSelectBtn);
                this.tabSelectText = this.tabSelectBtn.find(this.opts.tabSelectText);
                this.tabList = this.tabInner.find(this.opts.tabList);
                this.tabItem = this.tabList.find(this.opts.tabItem);
                this.tabLink = this.tabItem.find(this.opts.tabLink);
                this.tabPanel = this.obj.find(this.opts.tabPanel);
                this.tabPanelCards = this.tabPanel.find(this.opts.tabPanelCard);
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
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.tab-text'],
                        matchCommonOpts : {
                            column : this.tabItem.length,
                            childElement : '>'+this.opts.tabItem,
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
                                    for (var j = 0, jmax = _this.tabItem.length; j < jmax; j++) {
                                        var listTarget = _this.tabItem.eq(j),
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
                                    _this.heightmatch.instance.push(new HeightMatch(_this.tabList, _this.heightmatch.matchCommonOpts));
                                })(i);
                            }
                        }, this)
                    }
                });
                this.heightmatch.build();
            },
            buildTabPanel : function () {
                var _this = this;
                Util.def(this, {
                    panel : {
                        instance : [],
                        activeIndex : (function () {
                            var tabItem = _this.tabItem,
                                activeTabItem = tabItem.filter('.'+_this.opts.classAttr.selected),
                                activeIndex = activeTabItem.length ? tabItem.index(activeTabItem) : 0;
                            return activeIndex;
                        })(),
                        allHide : $.proxy(function (index) {
                            for (var i = 0, max = this.panel.instance.length; i < max; i++) {
                                var instance = this.panel.instance[i];
                                if (index != i && instance != isUndefined) {
                                    if (instance.opts.isActive) {
                                        instance.hide();
                                    }
                                }
                            }
                        }, this),
                        play : $.proxy(function (index) {
                            if (this.panel.instance[index] != isUndefined) {
                                this.panel.allHide(index);
                                this.panel.instance[index].play();
                                this.panel.activeIndex = index;
                            }
                        }, this),
                        build : $.proxy(function () {
                            for (var tabMin = 0, tabMax = this.tabPanelCards.length; tabMin < tabMax; tabMin++) {
                                var tabWrap = this.tabPanelCards.eq(tabMin);
                                this.panel.instance.push(new tabPanel(tabWrap));
                            }
                        }, this)
                    }
                });
                this.panel.build();
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
                    this.tabSelectBtn.on(this.changeEvents('click'), $.proxy(this.selctBtnClick, this));
                    this.tabLink.on(this.changeEvents('click'), $.proxy(this.tabLinkClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.tabSelectBtn.off(this.changeEvents('click'));
                    this.tabLink.off(this.changeEvents('click'));
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
                if (this.winWidth < RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.sizeAttr.swiper !== RESPONSIVE.MOBILE.NAME) {
                        this.opts.sizeAttr.swiper = RESPONSIVE.MOBILE.NAME;
                        this.destroyCarousel();
                    }
                } else {
                    if (this.opts.sizeAttr.swiper !== 'OTHER') {
                        this.opts.sizeAttr.swiper = 'OTHER';
                        this.buildCarousel();
                    }
                }
            },
            selctBtnClick : function (e) {
                e.preventDefault();
                this.opts.activeAttr.moOpen = !this.opts.activeAttr.moOpen;
                if (this.opts.activeAttr.moOpen) {
                    this.tabInner.addClass(this.opts.classAttr.opened);
                    this.tabSelectBtn.attr(this.opts.ariaAttr.expanded, 'true');
                    win.setTimeout($.proxy(function () {
                        this.tabArea.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.tabSelectBtn.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.tabInner.removeClass(this.opts.classAttr.opened);
                    this.tabSelectBtn.attr(this.opts.ariaAttr.expanded, 'false');
                    this.tabArea.off('clickoutside touchendoutside keyupoutside');
                }
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.tabArea, this.opts.carouselOpts);
                    this.opts.currentIndex = this.opts.carouselOpts.initialSlide;
                    this.opts.swiperInstance = this.opts.carouselInstance.carousel;
                    this.opts.swiperInstance.on('transitionStart', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                    }, this));
                    this.opts.swiperInstance.on('transitionEnd', $.proxy(function () {
                        var index = this.opts.swiperInstance.realIndex;
                        if (this.opts.currentIndex == index) return;
                        this.opts.carouselOpts.initialSlide = index;
                        this.opts.currentIndex = index;
                    }, this));
                }
            },
            destroyCarousel : function () {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.off('transitionStart transitionEnd');
                this.opts.carouselInstance.destroy(true, true);
                this.opts.swiperInstance = null;
                this.opts.carouselInstance = null;
            },
            updateHeightCarousel : function (speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.carouselInstance.updateAutoHeight(speed);
            },
            tabLinkClick : function (e) {
                e.preventDefault();
                var target = $(e.currentTarget),
                    targetItem = target.closest(this.opts.tabItem),
                    index = targetItem.index(),
                    classAttr = this.opts.classAttr;
                var currentTxt = $.trim(target.find('.tab-text span').text());
                this.tabSelectText.text(currentTxt);
                targetItem.addClass(classAttr.selected).siblings().removeClass(classAttr.selected);
                if (this.tabInner.hasClass(this.opts.classAttr.opened)) {
                    this.tabSelectBtn.triggerHandler(this.changeEvents('click'));
                    if (this.opts.sizeAttr.swiper == RESPONSIVE.MOBILE.NAME) {
                        this.tabSelectBtn.focus();
                    }
                }
                this.panel.play(index);
            },
            loadComponent : function () {
                this.panel.play(this.panel.activeIndex);
            },
            bindCallbackEvents : function () {
                this.obj.on(this.changeEvents('rerun'), $.proxy(this.rerun, this));
                this.obj.on(this.changeEvents('destroy'), $.proxy(this.destroy, this));
            },
            rerun : function () {
                this.destroy();
                this.setElements();
                this.initOpts();
                this.resizeFunc();
                this.bindEvents(true);
            },
            destroy : function () {
                this.opts.sizeAttr.swiper = null;
                this.bindEvents(false);
            },
            reInit : function () {
                // Global Callback
            }
        };

        // tabPanel
        function tabPanel (container, args) {
            var defParams = {
                isActive : false,
                customEvent : '.tabPanel' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        tabPanel.prototype = {
            init : function () {
                this.initLayout();
            },
            initLayout : function () {
                this.obj.hide();
            },
            play : function () {
                this.opts.isActive = true;
                this.obj.show();
            },
            hide : function () {
                this.opts.isActive = false;
                this.obj.hide();
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
                obj : '.cp-card-list'
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
                    new win.g2.cardList.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
