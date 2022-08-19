(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.faq = global.g2.faq || {};
    global.g2.faq.Component = factory();
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
                tabArea : '.cp-faq__tab',
                tabInner : '.cp-faq__tab-inner',
                tabSelectBtn : '.faq-select-btn',
                tabSelectText : '>span:eq(0)',
                tabList : '.cp-faq__tab-list',
                tabItem : '.cp-faq__tab-item',
                tabPanel : '.cp-faq__panel',
                tabPanelList : '.cp-faq__panel-list',
                tabPanelItem : '.cp-faq__panel-item',
                tabDepthArea : '.cp-faq__dtab-area',
                tabDepthItem : '.cp-faq__dtab-item',
                accordionWrap : '.cp-faq__accordion',
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
                accordionInstance : null,
                accordionOpts : {
                    accordionList : '.cp-faq__accordion-list',
                    accordionItem : '.cp-faq__accordion-item',
                    btn : '.accordion-btn',
                    panel : '.accordion-panel',
                    panelInner : '.accordion-panel-inner',
                },
                globalText : {},
                currentIndex : null,
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
                this.buildAccordion();
                this.buildTabPanel();
                this.resizeFunc();
                this.bindEvents(true);
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.tabArea = this.obj.find(this.opts.tabArea);
                this.tabInner = this.tabArea.find(this.opts.tabInner);
                this.tabSelectBtn = this.tabInner.find(this.opts.tabSelectBtn);
                this.tabSelectText = this.tabSelectBtn.find(this.opts.tabSelectText);
                this.tabList = this.tabInner.find(this.opts.tabList);
                this.tabItem = this.tabList.find(this.opts.tabItem);
                this.tabPanel = this.obj.find(this.opts.tabPanel);
                this.tabDepthArea = this.obj.find(this.opts.tabDepthArea);
                this.accordionWrap = this.obj.find(this.opts.accordionWrap);
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
                var selectItem = this.tabItem.filter('.'+this.opts.classAttr.selected),
                    selectIndex = selectItem.length ? selectItem.index() : 0;
                this.opts.carouselOpts.initialSlide = selectIndex;
                this.opts.currentIndex = selectIndex;
            },
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.faq-tab__text'],
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
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.tabSelectBtn.off(this.changeEvents('click'));
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
            buildAccordion : function () {
                this.accordionWrap.data('global-text', this.opts.globalText);
                if (this.opts.accordionInstance == null) {
                    this.opts.accordionInstance = new HiveAccordion(this.accordionWrap, this.opts.accordionOpts);
                }
            },
            destroyAccordion : function () {
                if (this.opts.accordionInstance == null) return;
                this.opts.accordionInstance.destroy();
                this.opts.accordionInstance = null;
            },
            buildTabPanel : function () {
                // depth panel
                for (var tabMin = 0, tabMax = this.tabDepthArea.length; tabMin < tabMax; tabMin++) {
                    var tabWrap = this.tabDepthArea.eq(tabMin),
                        panelWrap = tabWrap.next(this.opts.tabPanelList),
                        panelItem = panelWrap.find('>' + this.opts.tabPanelItem);
                    new tabPanel(this.obj, {
                        tabWrap : tabWrap,
                        tabItem : this.opts.tabDepthItem,
                        panelWrap : panelWrap,
                        panelItem : panelItem,
                        tabDepthArea : this.opts.tabDepthArea,
                        on : {
                            select : $.proxy(function (instance) {
                                // console.log(instance);
                            }, this)
                        }
                    });
                }
            },
            bindCallbackEvents : function () {
                this.obj.on(this.changeEvents('rerun'), $.proxy(this.rerun, this));
                this.obj.on(this.changeEvents('destroy'), $.proxy(this.destroy, this));
            },
            rerun : function () {
                this.destroy();
                this.setElements();
                this.initOpts();
                this.buildAccordion();
                this.resizeFunc();
                this.bindEvents(true);
            },
            destroy : function () {
                this.opts.sizeAttr.swiper = null;
                this.bindEvents(false);
                this.destroyAccordion();
            },
            reInit : function () {
                // Global Callback
            }
        };

        // tabPanel
        function tabPanel (container, args) {
            var defParams = {
                tabWrap : null,
                tabItem : null,
                panelWrap : null,
                panelItem : null,
                classAttr : {
                    selected : 'is-selected'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                dataAttr : {
                    panelFor : 'data-panel-for',
                    panelId : 'data-panel-id'
                },
                tabDepthArea : null,
                props : {},
                initialIndex : 0,
                hardType : false,
                isAllView : false,
                currentItems : null,
                carouselOpts : {
                    freeMode : true,
                    slidesPerView : 'auto',
                    centerInsufficientSlides : true,
                    speed : 350
                },
                customEvent : '.tabPanel' + (new Date()).getTime() + Math.random(),
                on : {
                    init : null,
                    select : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        tabPanel.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.initLayout();
                this.buildCarousel();
                this.bindEvents(true);
            },
            setElements : function () {
                this.tabWrap = this.opts.tabWrap;
                this.tabItems = this.tabWrap.find(this.opts.tabItem);
                this.tabLinks = this.tabItems.find('[' + this.opts.dataAttr.panelFor + ']');
                this.panelWrap = this.opts.panelWrap;
                this.panelItem = this.opts.panelItem;
            },
            initOpts : function () {
                var activeItem = this.tabItems.filter('.' + this.opts.classAttr.selected),
                    activeItemIndex = this.tabItems.index(activeItem);
                this.opts.initialIndex = activeItem.length ? activeItemIndex : this.opts.initialIndex;

                // buildData
                var dataAttr = this.opts.dataAttr;
                for (var linkMin = 0, linkMax = this.tabLinks.length; linkMin < linkMax; linkMin++) {
                    var tabLink = this.tabLinks.eq(linkMin),
                        tabItem = tabLink.closest(this.opts.tabItem),
                        tabId = tabLink.attr(dataAttr.panelFor),
                        panelItem = tabId === '{all}' ? 'ALL' : this.panelItem.filter('[' + dataAttr.panelId + '="' + tabId + '"]');
                    this.opts.props[linkMin] = {
                        'TABITEM' : tabItem,
                        'TAB' : tabLink,
                        'TABID' : tabId,
                        'PANELITEM' : panelItem,
                        'isActive' : false
                    };
                }
            },
            initLayout : function () {
                this.tabItems.removeClass(this.opts.classAttr.selected);
                this.stepView(this.opts.initialIndex, $.proxy(function () {
                    this.outCallback('init');
                }, this));
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
                    this.tabLinks.on(this.changeEvents('click clickCustom'), $.proxy(this.onClickBtn, this));
                } else {
                    this.tabLinks.off(this.changeEvents('click clickCustom'));
                }
            },
            buildCarousel : function () {
                if (this.opts.carouselInstance == null) {
                    this.opts.carouselInstance = new HiveSwiper(this.tabWrap.parent(), this.opts.carouselOpts);
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
            onClickBtn : function (e) {
                e.preventDefault();
                var _this = this,
                    target = $(e.currentTarget),
                    targetIndex = this.tabLinks.index(target);
                this.stepView(targetIndex, $.proxy(function () {
                    this.outCallback('select');
                }, this));
            },
            stepView : function (index, callback) {
                var props = this.opts.props,
                    prop = props[index],
                    classAttr = this.opts.classAttr,
                    cb = callback || function () {},
                    currentItems = null,
                    allClose = $.proxy(function (index) {
                        for (var pKey in props) {
                            (function (key) {
                                var prop = props[key];
                                if ((key != index) && prop['isActive']) {
                                    prop['isActive'] = false;
                                    prop['TABITEM'].removeClass(classAttr.selected);
                                    if (prop['PANELITEM'] !== 'ALL') {
                                        prop['PANELITEM'].hide();
                                    }
                                }
                            })(pKey);
                        }
                    }, this),
                    allShow = $.proxy(function (index) {
                        for (var pKey in props) {
                            (function (key) {
                                var prop = props[key];
                                if (!prop['isActive']) {
                                    prop['isActive'] = true;
                                    prop['PANELITEM'].show();
                                    if (key == index) {
                                        prop['TABITEM'].addClass(classAttr.selected);
                                    }
                                }
                            })(pKey);
                        }
                    }, this),
                    currentShow = $.proxy(function () {
                        prop['TABITEM'].addClass(classAttr.selected);
                        prop['PANELITEM'].show();
                    }, this);
                if (!prop['isActive']) {
                    prop['isActive'] = true;
                    allClose(index);
                    if (prop['PANELITEM'] === 'ALL') {
                        prop['TABITEM'].addClass(classAttr.selected);
                        this.opts.isAllView = true;
                        allShow(index);
                    } else {
                        currentShow();
                    }
                } else {
                    if (this.opts.isAllView && prop['PANELITEM'] !== 'ALL') {
                        allClose(index);
                        currentShow();
                        this.opts.isAllView = false;
                    }
                }
                cb();
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
                obj : '.cp-faq'
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
                    new win.g2.faq.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
