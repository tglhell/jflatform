(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpTermsCondition = global.g2.cpTermsCondition || {};
    global.g2.cpTermsCondition.Component = factory();
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
                anchorWrap : '.cont-anchor',
                swiperEl : '.swiper-type'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildAnchor();
                // this.buildTab();
            },
            setElements : function () {
                this.anchorWrap = this.obj.find(this.opts.anchorWrap);
                this.swiperEls = this.obj.find(this.opts.swiperEl);
            },
            buildAnchor : function () {
                new Anchor(this.obj);
                // for (var i = 0, max = this.anchorWrap.length; i < max; i++) {
                //     new Anchor(this.anchorWrap.eq(i));
                // }
            },
            buildTab : function () {
                for (var i = 0, max = this.swiperEls.length; i < max; i++) {
                    new Tab(this.swiperEls.eq(i));
                }
            }
        };
        function Anchor (container, args) {
            var defParams = {
                termsBody : '.cp-terms-conditions__body, #termsContents',
                listArea : '.lst-area',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Anchor.prototype = {
            init : function () {
                // this.setElements();
                this.bindEvents(true);
            },
            setElements : function () {
                this.listArea = this.obj.find(this.opts.listArea);
                this.orderNavStepList = this.listArea.find('ol');
                this.orderNavStepChild = this.orderNavStepList.children();
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
                    this.obj.on('click', '.lst-area ol li a', $.proxy(this.stepClick, this));
                } else {
                    this.obj.off('click');
                }
            },
            stepClick : function (e) {
                e.preventDefault();
                var target = $(e.currentTarget),
                    depth1_idx = target.closest(this.opts.listArea).index(),
                    depth2_idx = target.closest('li').index(),
                    termsBody = target.closest(this.opts.termsBody).find('.cont-type01 .con-lst-area').eq(depth1_idx).find('h4'),
                    termsTarget = termsBody.eq(depth2_idx),
                    headerHeight = ($('.site-navi-bar').length && $('.site-navi-bar').is(':visible')) ? $('.site-navi-bar').outerHeight(true) : 0,
                    spaceValue = 30,
                    targetClone = termsTarget.slice(0);
                targetClone.offset = $.proxy(function () {
                    return {
                        top : termsTarget.offset().top - headerHeight - spaceValue
                    }
                }, this);
                Util.scrollMoveFunc(targetClone);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        function Tab (container, args) {
            var defParams = {
                tabBtn : '.cp-terms-conditions__tabs-item a',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselInstance : null,
                swiperInstance : null,
                carouselOpts : {
                    // autoHeight : false,
                    slidesPerView: 'auto',
                    slidesPerGroup: 1
                },
                classAttr : {
                    selected : 'is-selected',
                    active : 'is-active'
                },
                ariaAttr : {
                    selected : 'aria-selected',
                    hidden : 'aria-hidden'
                },
                props : {},
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
                this.initDatas();
                this.buildCarousel();
                this.bindEvents(true);
                this.loadComponent();
            },
            setElements : function () {
                this.tabBtns = this.obj.find(this.opts.tabBtn);
                this.carouselContainer = this.obj.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.slides = this.carouselWrapper.find(this.opts.carouselItem);
            },
            initDatas : function () {
                for (var linkMin = 0, linkMax = this.tabBtns.length; linkMin < linkMax; linkMin++) {
                    var tabBtn = this.tabBtns.eq(linkMin),
                        tabPanel = $(tabBtn.attr('href'));
                    if (tabBtn.length) {
                        this.opts.props[linkMin] = {
                            'LI' : tabBtn.closest(this.opts.carouselItem),
                            'TAB' : tabBtn,
                            'PANEL' : (tabPanel.length) ? tabPanel : null,
                            'isActive' : false
                        };
                    }
                }
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
            slideTo : function (index, speed) {
                if (this.opts.carouselInstance == null) return;
                this.opts.swiperInstance.slideTo(index, speed);
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
                    this.tabBtns.on(this.changeEvents('click'), $.proxy(this.cmTabBtnsClick, this));
                } else {
                    this.tabBtns.off(this.changeEvents('click'));
                }
            },
            cmTabBtnsClick : function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    _index = this.tabBtns.index(_target);
                this.viewTab(_index);
            },
            viewTab : function (index) {
                var classAttr = this.opts.classAttr,
                    ariaAttr = this.opts.ariaAttr,
                    props = this.opts.props,
                    prop = props[index],
                    allClose = $.proxy(function (not_index) {
                        for (var key in props) {
                            var p = props[key];
                            if (p['isActive'] && key != not_index) {
                                p['isActive'] = false;
                                p['LI'].removeClass(classAttr.selected);
                                p['TAB'].attr(ariaAttr.selected, 'false');
                                p['PANEL'].removeClass(classAttr.active).attr(ariaAttr.hidden, 'true');
                            }
                        }
                    }, this);
                if (prop['isActive']) return;
                allClose(index);
                prop['isActive'] = true;
                prop['LI'].addClass(classAttr.selected);
                prop['TAB'].attr(ariaAttr.selected, 'true');
                prop['PANEL'].addClass(classAttr.active).attr(ariaAttr.hidden, 'false');
                this.slideTo(index);
            },
            loadComponent : function () {
                this.viewTab(0);
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
                obj : '.cp-terms-conditions'
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
                    new win.g2.cpTermsCondition.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
