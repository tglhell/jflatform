(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpEngineGraph = global.g2.cpEngineGraph || {};
    global.g2.cpEngineGraph.Component = factory();
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
                jsTab : '.js-tab',
                contentMain : '.cp-engine-graph__content-main',
                graph : '.cp-engine-graph__main-graph-inner',
                graphFigure : '.cp-engine-graph__main-graph-figure',
                graphCountNum : '.cp-engine-graph__count-num-lg',
                cmBtnSwiper : '.cp-swiper-tab-area',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.buildHiveTab();
                this.buildTab();
                this.buildTimeline();
                this.buildCount();
                this.loadComponent();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.jsTab = this.obj.find(this.opts.jsTab);
                this.contentMain = this.obj.find(this.opts.contentMain);
                this.carouselWrap = this.obj.find(this.opts.carouselWrap);
                this.cmBtnSwiper = this.obj.find(this.opts.cmBtnSwiper);
            },
            initLayout : function () {
                this.contentMain.css('opacity', 0);
            },
            buildTab : function () {
                new Tab(this.cmBtnSwiper);
            },
            buildHiveTab : function () {
                Util.def(this, {
                    hivetab : {
                        instance : null
                    }
                });
                if (this.jsTab.length) {
                    this.hivetab.instance = this.jsTab.data('HiveTab');
                }
            },
            buildTimeline : function () {
                Util.def(this, {
                    timeline : {
                        instance : [],
                        kill : $.proxy(function () {
                            for (var min = 0, max = this.timeline.instance.length; min < max; min++) {
                                this.timeline.instance[min].kill();
                            }
                            this.timeline.instance = [];
                        }, this)
                    }
                });
            },
            buildCount : function () {
                Util.def(this, {
                    count : {
                        instance : [],
                        play : $.proxy(function () {
                            for (var i = 0, max = this.count.instance.length; i < max; i++) {
                                this.count.instance[i].play();
                            }
                        }, this),
                        kill : $.proxy(function () {
                            for (var i = 0, max = this.count.instance.length; i < max; i++) {
                                this.count.instance[i].kill();
                            }
                            this.count.instance = [];
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
            bindCallbackEvents : function () {
                this.jsTab.on(this.changeEvents('hiveTabStart'), $.proxy(this.tabStart, this));
            },
            buildInstanceCount : function (graphCountNums) {
                this.count.kill();
                for (var gMin = 0, gMax = graphCountNums.length; gMin < gMax; gMin++) {
                    var graphCountNum = graphCountNums.eq(gMin);
                    this.count.instance.push(new Count(graphCountNum));
                }
            },
            tabStart : function () {
                var instance = this.hivetab.instance;
                var cmTabContent = instance.cmTabContent.eq(0);
                var cmTabItem = cmTabContent.find(instance.opts.cmTabItem);
                var index = instance.opts.currentIndex;
                var currentItem = cmTabItem.eq(index);
                var graph = currentItem.find(this.opts.graph);
                var graphFigure = currentItem.find(this.opts.graphFigure);
                var graphCountNums = graphFigure.find(this.opts.graphCountNum);
                this.buildInstanceCount(graphCountNums);
                this.count.play();
                var step1 = TweenLite.fromTo(graph, (550 / 1000), {
                    opacity : 0,
                    width : 0
                }, {
                    opacity : 1,
                    width : 100 + '%',
                    delay : 0.1,
                    ease : Power4.easeInOut,
                    onComplete : $.proxy(function () {
                    }, this)
                });
            },
            loadComponent : function () {
                this.contentMain.css('opacity', '');
                this.tabStart();
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Count (container, args) {
            var defParams = {
                numWrap : '>span',
                totalNum : 0,
                point : 0,
                timeline : []
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Count.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
            },
            setElements : function () {
                this.numWrap = this.obj.find(this.opts.numWrap);
                this.totalNum = $.trim(this.numWrap.text());
                var sTotalNum = this.totalNum.replace(',', ''),
                    aTotalNum = sTotalNum.split('.');
                this.opts.point = aTotalNum[1] == isUndefined ? this.opts.point : aTotalNum[1].length;
                this.opts.totalNum = parseFloat(sTotalNum);
            },
            initLayout : function () {
                this.numWrap.css('opacity', 0);
            },
            play : function () {
                function numberFormat(inputNumber) {
                   return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                var demo = {score:0}
                var step1 = TweenLite.to(demo, (2000 / 1000), {
                    score : this.opts.totalNum,
                    ease : Expo.easeOut,
                    onUpdate : $.proxy(function () {
                        var score = demo.score.toFixed(this.opts.point);
                        this.numWrap.css('opacity', '');
                        this.numWrap.text(numberFormat(score));
                    }, this)
                });
                this.opts.timeline.push(step1);
            },
            kill : function () {
                for (var i = 0, max = this.opts.timeline.length; i < max; i++) {
                    this.opts.timeline[i].progress(1).kill();
                }
                this.numWrap.text(this.totalNum);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
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
                obj : '.cp-engine-graph'
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
                    new win.g2.cpEngineGraph.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
