(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.testDriveStep1 = global.g2.testDriveStep1 || {};
    global.g2.testDriveStep1.Component = factory();
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
                stepSearch : '.cm-find-map__search',
                stepTabList : '.cm-find-map__tab-list',
                stepTabItem : '.cm-find-map__tab-item',
                searchWrap : '.cm-find-map__search-wrap',
                currentIndex : null,
                props : {},
                classAttr : {
                    active : 'is-active'
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
                this.initOpts();
                this.buildData();
                this.buildSearchHeight();
                this.buildContentsHeight();
                this.bindEvents();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.stepSearch = this.obj.find(this.opts.stepSearch);
                this.stepTabList = this.stepSearch.find(this.opts.stepTabList);
                this.stepTabItem = this.stepTabList.find(this.opts.stepTabItem);
                this.searchWrap = this.obj.find(this.opts.searchWrap);
            },
            initOpts : function () {
                var activeItem = this.stepTabItem.filter('.'+this.opts.classAttr.active),
                    currentIndex = activeItem.length ? this.stepTabItem.index(activeItem) : 0;
                this.opts.currentIndex = currentIndex;
            },
            buildData : function () {
                for (var smin = 0, smax = this.stepTabItem.length; smin < smax; smin++) {
                    var stepTabItem = this.stepTabItem.eq(smin),
                        stepTabLink = stepTabItem.find('a'),
                        stepTabPanel = $(stepTabLink.attr('href'));
                    this.opts.props[smin] = {
                        'LI' : stepTabItem,
                        'TAB' : stepTabLink,
                        'PANEL' : stepTabPanel.length ? stepTabPanel : null
                    }
                }
            },
            buildSearchHeight : function () {
                Util.def(this, {
                    searchheight : {
                        instance : [],
                        destroy : $.proxy(function () {
                            for (var i = 0, max = this.searchheight.instance.length; i < max; i++) {
                                this.searchheight.instance[i].destroy();
                            }
                        }, this),
                        update : $.proxy(function (index) {
                            if (this.searchheight.instance[index] == isUndefined) return;
                            this.searchheight.instance[index].update();
                        }, this),
                        build : $.proxy(function () {
                            for (var i = 0, max = this.searchWrap.length; i < max; i++) {
                                var searchWrap = this.searchWrap.eq(i);
                                this.searchheight.instance.push(new SearchHeight(this.obj, {
                                    searchWrap : searchWrap
                                }));
                            }
                        }, this)
                    }
                });
                this.searchheight.build();
            },
            buildContentsHeight : function () {
                Util.def(this, {
                    contentsheight : {
                        instance : null,
                        update : $.proxy(function (index) {
                            if (this.contentsheight.instance == null) return;
                            this.contentsheight.instance.update(index);
                        }, this),
                        build : $.proxy(function () {
                            this.contentsheight.instance = new ContentsHeight(this.obj, {
                                on : {
                                    destroy : $.proxy(function () {
                                        this.searchheight.destroy();
                                    }, this),
                                    resize : $.proxy(function () {
                                        this.searchheight.update(this.opts.currentIndex);
                                    }, this)
                                }
                            });
                            this.contentsheight.update();
                        }, this)
                    }
                });
                this.contentsheight.build();
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
                this.stepTabItem.on(this.changeEvents('click'), 'a', $.proxy(this.tabClick, this));
            },
            bindCallbackEvents : function () {
                this.obj.on(this.changeEvents('rerun'), $.proxy(this.rerun, this));
            },
            rerun : function () {
                // button 갱신
                var jsBoCmBtns = this.obj.find('.cm-btn');
                for (var min = 0, max = jsBoCmBtns.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmBtn = jsBoCmBtns.eq(index);
                        if (jsBoCmBtn.attr('data-load') != 'true') {
                            jsBoCmBtn.attr('data-load', 'true');
                            new win.G2.Controller.CommonCta.Component(jsBoCmBtn);
                        }
                    })(min);
                }

                // svg 갱신
                var jsSvgIcons = this.obj.find('.js-svg-icon');
                for (var min = 0, max = jsSvgIcons.length; min < max; min++) {
                    (function (index) {
                        var jsSvgIcon = jsSvgIcons.eq(index);
                        if (jsSvgIcon.attr('data-load') != 'true') {
                            jsSvgIcon.attr('data-load', 'true');
                            new win.G2.Controller.inlineSvg.Component(jsSvgIcon);
                        }
                    })(min);
                }

                this.contentsheight.update();
            },
            tabClick : function (e) {
                e.preventDefault();
                var _dTarget = $(e.delegateTarget),
                    _targetIndex = this.stepTabItem.index(_dTarget);
                this.activePanel(_targetIndex);
                this.contentsheight.update();
                this.opts.currentIndex = _targetIndex;
            },
            activePanel : function (index) {
                var props = this.opts.props,
                    classAttr = this.opts.classAttr;
                var allClose = $.proxy(function (index) {
                    for (var key in props) {
                        if (key != index) {
                            props[key]['LI'].removeClass(classAttr.active);
                            props[key]['PANEL'].hide();
                        }
                    }
                }, this);
                allClose(index);
                props[index]['LI'].addClass(classAttr.active);
                props[index]['PANEL'].css('display', '');
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
                mapContent : '.cm-find-map__content',
                minHeight : 555,
                customEvent : '.ContentsHeight' + (new Date()).getTime() + Math.random(),
                viewType : null,
                resizeStart : null,
                on : {
                    destroy : null,
                    resize : null
                }
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
                this.mapContent = this.obj.find(this.opts.mapContent);
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
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.viewType !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.viewType = RESPONSIVE.TABLET3.NAME;
                        this.mapContent.css('height', '');
                        this.outCallback('destroy');
                    }
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                    }
                    var winHeight = Util.winSize().h,
                        minHeight = winHeight < this.opts.minHeight ? this.opts.minHeight : winHeight;
                    this.mapContent.css('height', minHeight);
                    this.outCallback('resize');
                }
            },
            update : function () {
                this.resizeFunc();
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj(this);
            }
        };
        function SearchHeight (container, args) {
            if (!(this instanceof SearchHeight)) {
                return new SearchHeight(container, args);
            }
            var defParams = {
                container : container,
                searchWrap : null,
                searchResult : '.cm-find-map__search-result',
                scrollArea : '.cm-find-map__scroll-area',
                fixedArea : '.cm-find-map__fixed-area',
                customEvent : '.SearchHeight' + (new Date()).getTime() + Math.random(),
                viewType : null,
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            this.init();
        }
        SearchHeight.prototype = {
            init : function () {
                this.setElements();
            },
            setElements : function () {
                this.searchWrap = this.obj.find(this.opts.searchWrap);
                this.searchResult = this.searchWrap.find(this.opts.searchResult);
                this.scrollArea = this.searchResult.find(this.opts.scrollArea);
            },
            update : function () {
                var mapObj = this.obj,
                    activeSearchResult = this.searchResult.filter(':visible'),
                    scrollArea = activeSearchResult.find(this.opts.scrollArea),
                    fixedArea = activeSearchResult.find(this.opts.fixedArea),
                    activeCondition = activeSearchResult.length;
                if (activeCondition) {
                    var data = {
                        objHeight : mapObj.outerHeight(),
                        objOffsetTop : mapObj.offset().top,
                        scrollOffsetTop : scrollArea.offset().top,
                        fixedHeight : fixedArea.outerHeight()
                    };
                    var totalHeight = data.objHeight - data.fixedHeight - (data.scrollOffsetTop - data.objOffsetTop);
                    scrollArea.css('height', totalHeight);

                }
            },
            destroy : function () {
                this.scrollArea.css('height', '');
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
                obj : '.cm-find-map'
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
                    new win.g2.testDriveStep1.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
