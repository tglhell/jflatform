(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.gnb = global.g2.gnb || {};
    global.g2.gnb.ContentsHeight = factory();
}(this, function () { 'use strict';

    var ContentsHeight = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function ContentsHeight (container, args) {
            if (!(this instanceof ContentsHeight)) {
                return new ContentsHeight(container, args);
            }
            var defParams = {
                wrap : null,
                props : [],
                spaceHeight : null,
                customEvent : '.ContentsHeight' + (new Date()).getTime() + Math.random(),
                isDestroy : true,
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        ContentsHeight.prototype = {
            init : function () {
                this.opts.wrap.data('ContentsHeight', this);
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
                if (this.opts.isDestroy) return;
                var winHeight = Util.winSize().h,
                    spaceHeight = this.opts.spaceHeight == null ? 0 : this.opts.spaceHeight.outerHeight(true),
                    totalHeight = winHeight - spaceHeight;
                var cssProp = {};
                for (var pMin = 0, pMax = this.opts.props.length; pMin < pMax; pMin++) {
                    var prop = this.opts.props[pMin];
                    cssProp[prop] = totalHeight;
                }
                this.opts.wrap.css(cssProp);
            },
            destroyLayout : function () {
                var cssProp = {};
                for (var pMin = 0, pMax = this.opts.props.length; pMin < pMax; pMin++) {
                    var prop = this.opts.props[pMin];
                    cssProp[prop] = '';
                }
                this.opts.wrap.css(cssProp);
            },
            play : function () {
                if (!this.opts.isDestroy) return;
                this.opts.isDestroy = false;
                this.resizeFunc();
                this.bindEvents(true);
            },
            destroy : function () {
                if (this.opts.isDestroy) return;
                this.opts.isDestroy = true;
                this.destroyLayout();
                this.bindEvents(false);
            },
            update : function () {
                this.setLayout();
            }
        };

        return ContentsHeight;
    })();
    return ContentsHeight;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.gnb = global.g2.gnb || {};
    global.g2.gnb.Nav = factory();
}(this, function () { 'use strict';

    var Nav = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE;
        function Nav (container, args) {
            if (!(this instanceof Nav)) {
                return new Nav(container, args);
            }
            var defParams = {
                naviBarDimmed : null,
                naviBarMain : '.site-navi-bar__main',
                utilNavigation : '.util-navigaiton',
                utilSearch : '.util-search',
                utilSitemap : '.util-sitemap',
                subNavigation : '.sub-navigation',
                shopTools : '.shopping-tools',
                customEvent : '.Nav' + (new Date()).getTime() + Math.random(),
                isSelect : false,
                viewType : null,
                resizeStart : null,
                globalText : {},
                on : {
                    select : null,
                    unselect : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Nav.prototype = {
            init : function () {
                this.setElements();
                this.buildPcNav();
                this.buildMoNav();
                this.buildSearch();
                this.buildSitemap();
                this.buildSubNavigation();
                this.buildShopTool();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.naviBarMain = this.obj.find(this.opts.naviBarMain);
                this.utilNavigation = this.naviBarMain.find(this.opts.utilNavigation);
                this.utilSearch = this.utilNavigation.find(this.opts.utilSearch);
                this.utilSitemap = this.utilNavigation.find(this.opts.utilSitemap);
                this.subNavigation = this.obj.find(this.opts.subNavigation);
                this.shopTools = this.obj.find(this.opts.shopTools);
            },
            buildPcNav : function () {
                Util.def(this, {
                    pc : {
                        instance : null,
                        isActive : false,
                        closeAll : $.proxy(function (type) {
                            if (this.pc.instance == null) return;
                            this.pc.instance.closeAll(type);
                        }, this)
                    }
                });
                if (this.pc.instance == null) {
                    this.pc.instance = new pcNav(this.obj, {
                        naviBarDimmed : this.opts.naviBarDimmed,
                        on : {
                            select : $.proxy(function () {
                                this.pc.isActive = true;
                                this.selectCallback('select');
                            }, this),
                            unselect : $.proxy(function () {
                                this.pc.isActive = false;
                                this.selectCallback('unselect');
                            }, this)
                        }
                    });
                }
            },
            buildMoNav : function () {
                Util.def(this, {
                    mobile : {
                        instance : null,
                        isActive : false,
                        closeAll : $.proxy(function (type) {
                            if (this.mobile.instance == null) return;
                            this.mobile.instance.closeAll(type);
                        }, this)
                    }
                });
                if (this.mobile.instance == null) {
                    this.mobile.instance = new moNav(this.obj, {
                        globalText : this.opts.globalText,
                        naviBarDimmed : this.opts.naviBarDimmed,
                        on : {
                            select : $.proxy(function () {
                                this.outCallback('select');
                            }, this),
                            unselect : $.proxy(function () {
                                this.outCallback('unselect');
                            }, this)
                        }
                    });
                }
            },
            buildSearch : function () {
                Util.def(this, {
                    search : {
                        instance : null
                    }
                });
                if (this.search.instance == null && this.utilSearch.length) {
                    this.search.instance = new utilSearch(this.obj);
                }
            },
            buildSitemap : function () {
                Util.def(this, {
                    sitemap : {
                        instance : null,
                        isActive : false,
                        closeAll : $.proxy(function (type) {
                            if (this.sitemap.instance == null) return;
                            this.sitemap.instance.closeAll(type);
                        }, this)
                    }
                });
                if (this.sitemap.instance == null && this.utilSitemap.length) {
                    this.sitemap.instance = new utilSitemap(this.obj, {
                        globalText : this.opts.globalText,
                        on : {
                            select : $.proxy(function () {
                                this.sitemap.isActive = true;
                                this.selectCallback('select');
                            }, this),
                            unselect : $.proxy(function (str) {
                                this.sitemap.isActive = false;
                                this.selectCallback('unselect');
                            }, this)
                        }
                    });
                }
            },
            buildSubNavigation : function () {
                Util.def(this, {
                    subnav : {
                        instance : null
                    }
                });
                if (this.subnav.instance == null && this.subNavigation.length) {
                    this.subnav.instance = new subNavigation(this.obj);
                }
            },
            buildShopTool : function () {
                Util.def(this, {
                    shoptool : {
                        instance : null
                    }
                });
                if (this.shoptool.instance == null && this.shopTools.length) {
                    this.shoptool.instance = new shopTools(this.obj, {
                        globalText : this.opts.globalText
                    });
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
                if (this.winWidth <= RESPONSIVE.TABLET3.WIDTH) {
                    if (this.opts.viewType !== RESPONSIVE.TABLET3.NAME) {
                        this.opts.viewType = RESPONSIVE.TABLET3.NAME;
                        if (this.pc.isActive) {
                            this.pc.closeAll(true);
                        }
                        if (this.sitemap.isActive) {
                            this.sitemap.closeAll(true);
                        }
                    }
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                        this.mobile.closeAll(true);
                    }
                }
            },
            selectCallback : function (str) {
                if (str === 'select') {
                    if (this.opts.isSelect) return;
                    this.opts.isSelect = true;
                    this.outCallback(str);
                } else if (str === 'unselect') {
                    if (!this.opts.isSelect) return;
                    if (this.pc.isActive || this.sitemap.isActive) return;
                    this.opts.isSelect = false;
                    this.outCallback(str);
                }
            },
            ariaAccessbility : function (type, layerTarget) {
                var layerWrap = layerTarget,
                    layerParents = layerWrap.parents(),
                    pluginOpenPropDatas = win.HiveLayer.controller;
                if (type) {
                    layerWrap.removeAttr('aria-hidden').siblings().attr('aria-hidden', 'true');
                    for (var i = 0, max = layerParents.length; i < max; i++) {
                        var _target = layerParents.eq(i);
                        _target.siblings().attr('aria-hidden', 'true');
                    }
                } else {
                    layerWrap.siblings().removeAttr('aria-hidden');
                    for (var i = 0, max = layerParents.length; i < max; i++) {
                        var _target = layerParents.eq(i);
                        _target.siblings().removeAttr('aria-hidden');
                    }
                    if (pluginOpenPropDatas.length) {
                        var pluginPopupWrap = pluginOpenPropDatas[pluginOpenPropDatas.length - 1]['POPUPWRAP'];
                        this.ariaAccessbility(true, pluginPopupWrap);
                    }
                }
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // pc
        function pcNav (container, args) {
            var defParams = {
                naviBarDimmed : null,
                naviBarMain : '.site-navi-bar__main',
                mainDepth1Wrap : '.depth1-wrap',
                navDuration : 400,
                depth1Link : '.depth1-link:not(.n-link)',
                mainDepth2Wrap : '.depth2-wrap',
                isNavActive : false,
                props : {},
                closeHardType : false,
                classAttr : {
                    active : 'is-active',
                    typeModel : 'type-model',
                    typeModelAlign : 'three-aligns'
                },
                ariaAttr : {
                    selected : 'aria-selected'
                },
                heightMatchOpts : {
                    'type-model' : {
                        matchElements : ['.depth2-h-layout'],
                        matchCommonOpts : {
                            column : 4,
                            useDestroyHeight : false
                        }
                    }
                },
                isAnimated : false,
                customEvent : '.pcNav' + (new Date()).getTime() + Math.random(),
                on : {
                    select : null,
                    unselect : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        pcNav.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildModelType();
                this.buildContentsHeight();
                this.bindEvents(true);
            },
            setElements : function () {
                this.naviBarMain = this.obj.find(this.opts.naviBarMain);
                this.mainDepth1Wrap = this.naviBarMain.find(this.opts.mainDepth1Wrap);
                this.depth1Link = this.mainDepth1Wrap.find(this.opts.depth1Link);
            },
            initOpts : function () {
                var _this = this;
                for (var linkMin = 0, linkMax = this.depth1Link.length; linkMin < linkMax; linkMin++) {
                    var depth1LinkItem = this.depth1Link.eq(linkMin),
                        depth1LinkPanel = depth1LinkItem.next();
                    if (depth1LinkPanel.length) {
                        this.opts.props[linkMin] = {
                            'LI' : depth1LinkItem.closest('li'),
                            'TAB' : depth1LinkItem,
                            'PANEL' : depth1LinkPanel,
                            'isActive' : false,
                            'HeightMatch' : (function () {
                                // typeModel
                                var heightMatchOpts = _this.opts.heightMatchOpts,
                                    classTypeModel = _this.opts.classAttr.typeModel;
                                if (depth1LinkPanel.hasClass(classTypeModel)) {
                                    var depth2Wrap = depth1LinkPanel.find(_this.opts.mainDepth2Wrap),
                                        depth2WrapChild = depth2Wrap.children(),
                                        depth2WrapChildLength = depth2WrapChild.length;
                                    if (depth2WrapChildLength >= 5 && depth2WrapChildLength <= 6) {
                                        depth2Wrap.addClass(_this.opts.classAttr.typeModelAlign);
                                        heightMatchOpts[classTypeModel].matchCommonOpts.column = 3;
                                    }
                                    heightMatchOpts[classTypeModel].matchWrap = depth2Wrap;
                                    heightMatchOpts[classTypeModel].matchChild = depth2WrapChild;
                                    var heightMatchObjs = _this.buildHeightMatch(heightMatchOpts[classTypeModel]);
                                    _this.destroyHeightMatch(heightMatchObjs);
                                    return heightMatchObjs;
                                }
                                return null;
                            })()
                        }
                    }
                }
            },
            buildModelType : function () {
                Util.def(this, {
                    typemodel : {
                        instance : null,
                        initLayout : $.proxy(function () {
                            this.obj.find('.depth2-wrap .depth2 .depth2-model').removeClass('is-hover');
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.typemodel.instance == null) return;
                            this.typemodel.instance.destroy();
                            this.typemodel.instance = null;
                        }, this),
                        build : $.proxy(function () {
                            if (this.typemodel.instance != null) return;
                            this.typemodel.instance = new pcTypeModel(this.obj);
                        }, this)
                    }
                });
                this.typemodel.initLayout();
            },
            buildContentsHeight : function () {
                var heightProps = [];

                // mainLink
                for (var linkMin = 0, linkMax = this.depth1Link.length; linkMin < linkMax; linkMin++) {
                    var depth1LinkItem = this.depth1Link.eq(linkMin),
                        depth1LinkPanel = depth1LinkItem.next();
                    if (depth1LinkPanel.length) {
                        heightProps.push({
                            'wrap' : depth1LinkPanel,
                            'props' : ['max-height'],
                            'spaceHeight' : this.naviBarMain
                        });
                    }
                }

                // ContentsHeight Call
                for (var hMin = 0, hMax = heightProps.length; hMin < hMax; hMin++) {
                    var heightProp = heightProps[hMin];
                    new win.g2.gnb.ContentsHeight(this.obj, heightProp);
                }
            },
            initHeightMatch : function (matchOpts) {
                var _this = this;
                for (var i = 0, max = matchOpts.matchElements.length; i < max; i++) {
                    (function (index) {
                        var sTarget = matchOpts.matchElements[index],
                            sJsClass = 'js-' + sTarget.split('.')[1];
                        for (var j = 0, jmax = matchOpts.matchChild.length; j < jmax; j++) {
                            var listTarget = matchOpts.matchChild.eq(j),
                                usedJsClass = listTarget.find('.' + sJsClass);
                            if (!usedJsClass.length) {
                                listTarget.find(sTarget).wrap('<div class="' + sJsClass + '"/>');
                            }
                        }
                    })(i);
                }
            },
            buildHeightMatch : function (matchOpts) {
                this.initHeightMatch(matchOpts);
                var _this = this,
                    matchObjs = [];
                for (var i = 0, max = matchOpts.matchElements.length; i < max; i++) {
                    (function (index) {
                        var sTarget = matchOpts.matchElements[index],
                            personOpts = {
                                pushElement : '.js-' + sTarget.split('.')[1],
                                matchElement : sTarget
                            };
                        Util.def(matchOpts.matchCommonOpts, personOpts);
                        matchObjs.push(new HeightMatch(matchOpts.matchWrap, matchOpts.matchCommonOpts));
                    })(i);
                }
                return matchObjs;
            },
            reInitHeightMatch : function (matchOpts) {
                if (matchOpts == null) return;
                for (var min = 0, max = matchOpts.length; min < max; min++) {
                    var matchOpt = matchOpts[min];
                    matchOpt.reInit();
                }
            },
            destroyHeightMatch : function (matchOpts) {
                if (matchOpts == null) return;
                for (var min = 0, max = matchOpts.length; min < max; min++) {
                    var matchOpt = matchOpts[min];
                    matchOpt.destroy();
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
                    this.depth1Link.on(this.changeEvents('click'), $.proxy(this.depth1Click, this));
                } else {
                    this.depth1Link.off(this.changeEvents('click'));
                }
            },
            depth1Click : function (e) {
                var _this = this,
                    _target = $(e.currentTarget),
                    _targetIndex = this.depth1Link.index(_target),
                    classAttr = this.opts.classAttr,
                    ariaAttr = this.opts.ariaAttr,
                    props = this.opts.props,
                    duration = this.opts.closeHardType ? 0 : this.opts.navDuration,
                    activeZindex = $.proxy(function (type, target) {
                        if (type) {
                            var zIndex = target.css('zIndex') == isUndefined ? 0 : parseInt(target.css('zIndex'));
                            target.css('zIndex', zIndex + 10);
                        } else {
                            target.css('zIndex', '');
                        }
                    }, this),
                    allClose = $.proxy(function (index) {
                        var props = this.opts.props;
                        for (var pKey in props) {
                            (function (key) {
                                var prop = props[key];
                                if ((key != index) && prop['isActive']) {
                                    prop['isActive'] = false;
                                    var contentHeight = prop['PANEL'].data('ContentsHeight');
                                    activeZindex(false, prop['PANEL']);
                                    _this.naviBarMain.off('clickoutside touchendoutside keyupoutside');
                                    prop['LI'].removeClass(classAttr.active);
                                    prop['TAB'].attr(ariaAttr.selected, 'false');
                                    prop['PANEL'].hide();
                                    _this.destroyHeightMatch(prop['HeightMatch']);
                                    contentHeight.destroy();
                                    if (prop['PANEL'].hasClass(_this.opts.classAttr.typeModel)) {
                                        _this.typemodel.destroy();
                                    }
                                }
                            })(pKey);
                        }
                    }, this);
                if (props.hasOwnProperty(_targetIndex)) {
                    e.preventDefault();
                    if (this.opts.isAnimated) return;
                    this.opts.isAnimated = true;
                    var prop = props[_targetIndex];
                    if (!prop['isActive']) {
                        this.outCallback('select');
                        allClose(_targetIndex);
                        prop['isActive'] = true;
                        this.opts.naviBarDimmed.css('display', '');
                        var contentHeight = prop['PANEL'].data('ContentsHeight');
                        activeZindex(true, prop['PANEL']);
                        contentHeight.play();
                        prop['LI'].addClass(classAttr.active);
                        prop['TAB'].attr(ariaAttr.selected, 'true');
                        prop['PANEL'].css({
                            'opacity' : 0,
                            'display' : 'block'
                        });
                        this.reInitHeightMatch(prop['HeightMatch']);
                        prop['PANEL'].css({
                            'opacity' : '',
                            'display' : 'none'
                        });
                        if (this.opts.isNavActive) {
                            prop['PANEL'].show();
                            this.opts.isAnimated = false;
                        } else {
                            prop['PANEL'].slideDown(duration, $.proxy(function () {
                                this.opts.isAnimated = false;
                            }, this));
                        }
                        if (prop['PANEL'].hasClass(this.opts.classAttr.typeModel)) {
                            this.typemodel.build();
                        }
                        win.setTimeout($.proxy(function () {
                            this.naviBarMain.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                                prop['TAB'].triggerHandler(this.changeEvents('click'));
                            }, this));
                        }, this), 30);
                        this.opts.isNavActive = true;
                    } else {
                        (function () {
                            prop['isActive'] = false;
                            _this.opts.naviBarDimmed.hide();
                            var contentHeight = prop['PANEL'].data('ContentsHeight');
                            activeZindex(false, prop['PANEL']);
                            _this.naviBarMain.off('clickoutside touchendoutside keyupoutside');
                            prop['LI'].removeClass(classAttr.active);
                            prop['TAB'].attr(ariaAttr.selected, 'false');
                            prop['PANEL'].slideUp(duration, $.proxy(function () {
                                win.setTimeout($.proxy(function () {
                                    _this.opts.isAnimated = false;
                                    _this.opts.isNavActive = false;
                                    _this.destroyHeightMatch(prop['HeightMatch']);
                                    contentHeight.destroy();
                                    if (prop['PANEL'].hasClass(_this.opts.classAttr.typeModel)) {
                                        _this.typemodel.destroy();
                                    }
                                    _this.outCallback('unselect');
                                }, _this), 30);
                            }, _this));
                        })();
                    }
                }
            },
            closeAll : function (hardType) {
                this.opts.isAnimated = false;
                this.opts.closeHardType = (hardType == isUndefined) ? false : hardType;
                if (this.opts.isNavActive) {
                    var props = this.opts.props;
                    for (var pKey in props) {
                        if (props[pKey]['isActive']) {
                            props[pKey]['TAB'].triggerHandler(this.changeEvents('click'));
                        }
                    }
                }
                this.opts.closeHardType = false;
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        function pcTypeModel (container, args) {
            var defParams = {
                obj : container,
                layerModel : '.depth2-layer.type-model',
                layerTabItem : '.depth2-wrap .depth2 .depth2-model',
                classAttr : {
                    hover : 'is-hover'
                },
                customEvent : '.pcTypeModel' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        pcTypeModel.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.bindEvents(true);
            },
            setElements : function () {
                this.layerModel = this.obj.find(this.opts.layerModel);
                this.layerTabItem = this.layerModel.find(this.opts.layerTabItem);
            },
            initLayout : function () {
                this.layerTabItem.removeClass(this.opts.classAttr.hover);
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
                    this.layerTabItem.on(this.changeEvents('mouseenter mouseleave focusin'), $.proxy(this.onHoverFunc, this));
                } else {
                    this.layerTabItem.off(this.changeEvents('mouseenter'));
                }
            },
            onHoverFunc : function (e) {
                e.stopPropagation();
                var _target = $(e.currentTarget);
                var hoverClass = this.opts.classAttr.hover;
                if (e.type === 'mouseenter' || e.type === 'focusin') {
                    if (_target.hasClass(hoverClass)) return;
                    _target.addClass(hoverClass);
                    win.setTimeout($.proxy(function () {
                        _target.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            _target.trigger('mouseleave');
                        }, this));
                    }, this), 30);
                } else if (e.type === 'mouseleave') {
                    _target.off('clickoutside touchendoutside keyupoutside');
                    if (!_target.hasClass(hoverClass)) return;
                    _target.removeClass(hoverClass);
                }
            },
            destroy : function () {
                this.layerTabItem.off('clickoutside touchendoutside keyupoutside');
                this.layerTabItem.removeClass(this.opts.classAttr.hover);
                this.bindEvents(false);
            }
        };

        // mobile
        function moNav (container, args) {
            var defParams = {
                naviBarDimmed : null,
                naviBarMain : '.site-navi-bar__main',
                navDuration : 200,
                isNavActive : false,
                moNav : '.mo-navigation',
                moNavOpener : '.mo-navigation-opener',
                blindText : '.blind',
                allDepthLayer : '.mo-all-depth-layer',
                depthListWrap : '.depth-list-wrap',
                depthTit : '.navigation-link',
                depthOpener : '.depth-opener',
                depthList : '.depth-list',
                moDepthLayer : '.mo-depth-layer',
                moDepth2Layer : '.mo-depth2-layer',
                moDepth3Layer : '.mo-depth3-layer',
                moNavTitle : '.mo-navigation-title',
                moNavLocation : '.menu-navigation',
                props : {},
                dataAttr : {
                    depthIndex : 'data-depth-index'
                },
                classAttr : {
                    navOpened : 'is-navi-opened',
                    navAnimated : 'is-navi-animated',
                    opened : 'is-opened',
                    animated : 'is-animated'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                openProps : {},
                sliceType : 'all',
                isAnimated : false,
                closeHardType : false,
                customEvent : '.moNav' + (new Date()).getTime() + Math.random(),
                isSelect : false,
                on : {
                    select : null,
                    unselect : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        moNav.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.initDatas();
                this.buildContentsHeight();
                this.bindEvents(true);
            },
            setElements : function () {
                this.naviBarMain = this.obj.find(this.opts.naviBarMain);
                this.moNav = this.obj.find(this.opts.moNav);
                this.moNavOpener = this.moNav.find(this.opts.moNavOpener);
                this.blindText = this.moNavOpener.find(this.opts.blindText);
                this.allDepthLayer = this.moNav.find(this.opts.allDepthLayer);
                this.depthListWrap = this.allDepthLayer.find(this.opts.depthListWrap).eq(0);
                this.moDepth2Layer = this.moNav.find(this.opts.moDepth2Layer);
                this.moDepth3Layer = this.moNav.find(this.opts.moDepth3Layer);
                this.moDepthLayer = this.moNav.find(this.opts.moDepthLayer);
                this.moNavTitle = this.moDepthLayer.find(this.opts.moNavTitle);
                this.moNavTitleBtn = this.moNavTitle.find('> button');
            },
            initOpts : function () {
                var objDuration = this.obj.css('transitionDuration'),
                    navDuration = objDuration !== isUndefined ? (parseFloat(objDuration) * 1000) : this.opts.navDuration;
                this.opts.navDuration = navDuration;
            },
            initDatas : function () {
                var data = this.buildDatas({}, this.depthListWrap);
                this.opts.props = data;
                this.depthOpener = this.depthListWrap.find(this.opts.depthOpener + '[' + this.opts.dataAttr.depthIndex + ']');
            },
            buildDatas : function (propData, target, index) {
                var childs = target.find('>li');
                for (var min = 0, max = childs.length; min < max; min++) {
                    var child = childs.eq(min),
                        depthOpener = child.find('>' + this.opts.depthOpener),
                        depthTit = depthOpener.find('>' + this.opts.depthTit),
                        depthList = child.find('>' + this.opts.depthList),
                        depthListWrap = depthList.find('>' + this.opts.depthListWrap),
                        depthIndex = (index == isUndefined) ? min : index + '_' + min;
                    if (depthList.length) {
                        depthOpener.attr(this.opts.dataAttr.depthIndex, depthIndex);
                        depthListWrap.attr(this.opts.dataAttr.depthIndex, depthIndex);
                        var prop = {
                            'LI' : child,
                            'TITLE' : $.trim(depthTit.text()),
                            'TAB' : depthOpener,
                            'PANELWRAP' : depthList,
                            'PANEL' : depthListWrap,
                            'isActive' : false,
                            'index' : depthIndex
                        };
                        propData[min] = prop;
                        this.buildDatas(propData[min], depthListWrap, min);
                    }
                }
                return propData;
            },
            buildContentsHeight : function () {
                var heightProps = [];

                // layer
                heightProps.push({
                    'wrap' : this.allDepthLayer,
                    'props' : ['height'],
                    'spaceHeight' : this.naviBarMain
                });
                heightProps.push({
                    'wrap' : this.moDepth2Layer,
                    'props' : ['height'],
                    'spaceHeight' : this.naviBarMain
                });
                heightProps.push({
                    'wrap' : this.moDepth3Layer,
                    'props' : ['height'],
                    'spaceHeight' : this.naviBarMain
                });

                // ContentsHeight Call
                for (var hMin = 0, hMax = heightProps.length; hMin < hMax; hMin++) {
                    var heightProp = heightProps[hMin];
                    new win.g2.gnb.ContentsHeight(this.obj, heightProp);
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
                    this.moNavOpener.on(this.changeEvents('click'), $.proxy(this.moNavOpen, this));
                    this.depthOpener.on(this.changeEvents('click'), $.proxy(this.depthOpen, this));
                    this.moNavTitleBtn.on(this.changeEvents('click'), $.proxy(this.moNavTitleBtnClick, this));
                } else {
                    this.moNavOpener.off(this.changeEvents('click'));
                    this.depthOpener.off(this.changeEvents('click'));
                    this.moNavTitleBtn.off(this.changeEvents('click'));
                }
            },
            controlDestroy : function () {
                var props = this.opts.props,
                    openProps = this.opts.openProps,
                    openLength = Util.objectLength(openProps),
                    classNavOpened = this.opts.classAttr.navOpened;
                this.opts.sliceType = 'all';
                if (openLength) {
                    for (var opKey in openProps) {
                        var openProp = openProps[opKey];
                        if (opKey != openLength - 1) {
                            this.depthShow(false, true, openProp.depthIndex);
                        } else {
                            var duration = this.opts.closeHardType ? 0 : openProp.prop['DURATION'];
                            this.depthShow(false, false, openProp.depthIndex);
                            win.setTimeout($.proxy(function () {
                                this.obj.removeClass(classNavOpened);
                                this.selectCallback('unselect');
                                this.opts.openProps = {};
                            }, this), duration);
                        }
                    }
                } else {
                    var duration = this.opts.closeHardType ? 0 : this.opts.navDuration;
                    win.setTimeout($.proxy(function () {
                        this.obj.removeClass(classNavOpened);
                        this.selectCallback('unselect');
                    }, this), duration);
                }
                this.opts.closeHardType = false;
            },
            moNavOpen : function (e) {
                e.preventDefault();
                if (this.opts.isAnimated) return;
                this.opts.isAnimated = true;
                this.opts.isNavActive = !this.opts.isNavActive;
                if (this.opts.isNavActive) {
                    this.moNavShow(true, false);
                } else {
                    this.moNavShow(false, false);
                }
            },
            moNavShow : function (type, hardType) {
                var classNavOpened = this.opts.classAttr.navOpened,
                    classNavAnimated = this.opts.classAttr.navAnimated,
                    ariaAttr = this.opts.ariaAttr,
                    contentHeight = this.allDepthLayer.data('ContentsHeight');
                var duration = this.opts.closeHardType ? 0 : this.opts.navDuration;
                if (type) {
                    var animateFunc = $.proxy(function () {
                        this.obj.addClass(classNavAnimated);
                    }, this);
                    var animateCompleteFunc = $.proxy(function () {
                        this.opts.isAnimated = false;
                    }, this);
                    this.blindText.text(this.opts.globalText.Collapse);
                    this.selectCallback('select');
                    contentHeight.play();
                    this.moNavOpener.attr(ariaAttr.expanded, 'true');
                    this.obj.addClass(classNavOpened);
                    if (hardType) {
                        animateFunc();
                        animateCompleteFunc();
                    } else {
                        win.setTimeout($.proxy(function () {
                            animateFunc();
                        }, this), 30);
                        win.setTimeout($.proxy(function () {
                            animateCompleteFunc();
                        }, this), duration);
                    }
                } else {
                    var animateFunc = $.proxy(function () {
                        contentHeight.destroy();
                    }, this);
                    var animateCompleteFunc = $.proxy(function () {
                        this.opts.isAnimated = false;
                    }, this);
                    this.blindText.text(this.opts.globalText.Expand);
                    this.moNavOpener.attr(ariaAttr.expanded, 'false');
                    this.obj.removeClass(classNavAnimated);
                    this.controlDestroy();
                    if (hardType) {
                        animateFunc();
                        animateCompleteFunc();
                    } else {
                        win.setTimeout($.proxy(function () {
                            animateFunc();
                            animateCompleteFunc();
                        }, this), duration);
                    }
                }
            },
            depthOpen : function (e) {
                e.preventDefault();
                if (this.opts.isAnimated) return;
                this.opts.isAnimated = true;
                var _target = $(e.currentTarget),
                    depthIndex = _target.attr(this.opts.dataAttr.depthIndex);
                this.depthShow(true, false, depthIndex);
            },
            moNavTitleBtnClick : function (e) {
                e.preventDefault();
                if (this.opts.isAnimated) return;
                this.opts.isAnimated = true;
                var _target = $(e.currentTarget),
                    moDepthLayer = _target.closest(this.opts.moDepthLayer),
                    depthListWrap = moDepthLayer.find(this.opts.depthListWrap),
                    depthIndex = depthListWrap.attr(this.opts.dataAttr.depthIndex);
                this.opts.sliceType = 'person';
                this.depthShow(false, false, depthIndex);
            },
            depthShow : function (type, hardType, depthIndex) {
                var aDepths = depthIndex.split('_'),
                    currentProp = this.opts.props,
                    classOpened = this.opts.classAttr.opened,
                    classAnimated = this.opts.classAttr.animated,
                    ariaAttr = this.opts.ariaAttr,
                    currentDepthLayer = null,
                    openLength = Util.objectLength(this.opts.openProps);
                for (var aMin = 0, aMax = aDepths.length; aMin < aMax; aMin++) {
                    var aDepth = aDepths[aMin];
                    currentProp = currentProp[aDepth];
                }
                if (aDepths.length === 1) {
                    currentDepthLayer = this.moDepth2Layer;
                } else if (aDepths.length === 2) {
                    currentDepthLayer = this.moDepth3Layer;
                }
                var contentHeight = currentDepthLayer.data('ContentsHeight');
                var objDuration = currentDepthLayer.css('transitionDuration'),
                    duration = objDuration !== isUndefined ? (parseFloat(objDuration) * 1000) : this.opts.navDuration;
                currentProp['DURATION'] = duration;
                var duration = this.opts.closeHardType ? 0 : currentProp['DURATION'];
                if (type) {
                    this.opts.openProps[openLength] = {
                        prop : currentProp,
                        depthIndex : depthIndex
                    };
                    currentProp['isActive'] = true;
                    currentProp['TAB'].attr(ariaAttr.expanded, 'true');
                    var moNavTitle = currentDepthLayer.find(this.opts.moNavTitle),
                        moNavLocation = moNavTitle.find(this.opts.moNavLocation),
                        depthList = currentDepthLayer.find(this.opts.depthList);
                    moNavLocation.text(currentProp['TITLE']);
                    depthList.append(currentProp['PANEL']);
                    var animateFunc = $.proxy(function () {
                        contentHeight.play();
                        currentDepthLayer.addClass(classAnimated);
                    }, this);
                    var animateCompleteFunc = $.proxy(function () {
                        this.opts.isAnimated = false;
                    }, this);
                    currentDepthLayer.addClass(classOpened);
                    if (hardType) {
                        animateFunc();
                        animateCompleteFunc();
                    } else {
                        win.setTimeout($.proxy(function () {
                            animateFunc();
                        }, this), 30);
                        win.setTimeout($.proxy(function () {
                            animateCompleteFunc();
                        }, this), duration);
                    }
                } else {
                    if (this.opts.sliceType !== 'all') {
                        delete this.opts.openProps[openLength - 1];
                    }
                    currentProp['isActive'] = false;
                    currentProp['TAB'].attr(ariaAttr.expanded, 'false');
                    var animateFunc = $.proxy(function () {
                        contentHeight.destroy();
                        currentDepthLayer.removeClass(classOpened);
                        currentProp['PANELWRAP'].append(currentProp['PANEL']);
                    }, this);
                    var animateCompleteFunc = $.proxy(function () {
                        this.opts.isAnimated = false;
                    }, this);
                    currentDepthLayer.removeClass(classAnimated);
                    if (hardType) {
                        animateFunc();
                        animateCompleteFunc();
                    } else {
                        win.setTimeout($.proxy(function () {
                            animateFunc();
                            animateCompleteFunc();
                        }, this), duration);
                    }
                }
            },
            selectCallback : function (str) {
                if (str === 'select') {
                    if (this.opts.isSelect) return;
                    this.opts.isSelect = true;
                    this.outCallback(str);
                } else if (str === 'unselect') {
                    if (!this.opts.isSelect) return;
                    // if (this.opts.isNavActive || this.opts.isSitemapLayerActive) return;
                    this.opts.isSelect = false;
                    this.outCallback(str);
                }
            },
            closeAll : function (hardType) {
                if (this.opts.isSelect) {
                    this.opts.closeHardType = (hardType == isUndefined) ? false : hardType;
                    this.opts.isAnimated = false;
                    this.opts.isNavActive = false;
                    this.moNavShow(false, false);
                }
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // search
        function utilSearch (container, args) {
            var defParams = {
                utilSearch : '.util-search',
                utilSearchLayerOpener : '.search-layer-opener',
                isSearchLayerActive : false,
                classAttr : {
                    utilSearchActive : 'is-expand'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                customEvent : '.utilSearch' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        utilSearch.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
            },
            setElements : function () {
                this.utilSearch = this.obj.find(this.opts.utilSearch);
                this.utilSearchLayerOpener = this.utilSearch.find(this.opts.utilSearchLayerOpener);
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
                    this.utilSearchLayerOpener.on(this.changeEvents('click'), $.proxy(this.searchLayerOpen, this));
                } else {
                    this.utilSearchLayerOpener.off(this.changeEvents('click'));
                }
            },
            searchLayerOpen : function (e) {
                e.preventDefault();
                var classUtilSearchActive = this.opts.classAttr.utilSearchActive,
                    ariaAttr = this.opts.ariaAttr;
                this.opts.isSearchLayerActive = !this.opts.isSearchLayerActive;
                if (this.opts.isSearchLayerActive) {
                    this.utilSearchLayerOpener.attr(ariaAttr.expanded, 'true');
                    this.utilSearch.addClass(classUtilSearchActive);
                    this.utilSearch.find('input').eq(0).focus();
                    win.setTimeout($.proxy(function () {
                        this.utilSearch.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.utilSearchLayerOpener.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.utilSearchLayerOpener.attr(ariaAttr.expanded, 'false');
                    this.utilSearch.removeClass(classUtilSearchActive);
                    this.utilSearch.off('clickoutside touchendoutside keyupoutside');
                }
            }
        };

        // sitemap
        function utilSitemap (container, args) {
            var defParams = {
                utilSitemap : '.util-sitemap',
                utilSitemapOpener : '.btn-toggle',
                utilSitemapLayer : '.sitemap-layer',
                blindText : '.blind',
                isSitemapLayerActive : false,
                classAttr : {
                    utilSitemapActive : 'is-opened'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                globalText : {},
                customEvent : '.utilSitemap' + (new Date()).getTime() + Math.random(),
                on : {
                    select : null,
                    unselect : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        utilSitemap.prototype = {
            init : function () {
                this.setElements();
                this.buildContentsHeight();
                this.bindEvents(true);
            },
            setElements : function () {
                this.utilSitemap = this.obj.find(this.opts.utilSitemap);
                this.utilSitemapOpener = this.utilSitemap.find(this.opts.utilSitemapOpener);
                this.blindText = this.utilSitemapOpener.find(this.opts.blindText);
                this.utilSitemapLayer = this.utilSitemap.find(this.opts.utilSitemapLayer);
            },
            buildContentsHeight : function () {
                var heightProps = [];

                // sitemap
                heightProps.push({
                    'wrap' : this.utilSitemapLayer,
                    'props' : ['max-height', 'height']
                });

                // ContentsHeight Call
                for (var hMin = 0, hMax = heightProps.length; hMin < hMax; hMin++) {
                    var heightProp = heightProps[hMin];
                    new win.g2.gnb.ContentsHeight(this.obj, heightProp);
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
                    this.utilSitemapOpener.on(this.changeEvents('click'), $.proxy(this.sitemapOpen, this));
                } else {
                    this.utilSitemapOpener.off(this.changeEvents('click'));
                }
            },
            sitemapOpen : function (e) {
                e.preventDefault();
                var classUtilSitemapActive = this.opts.classAttr.utilSitemapActive,
                    ariaAttr = this.opts.ariaAttr,
                    contentHeight = this.utilSitemapLayer.data('ContentsHeight');
                this.opts.isSitemapLayerActive = !this.opts.isSitemapLayerActive;
                if (this.opts.isSitemapLayerActive) {
                    this.utilSitemapOpener.attr(ariaAttr.expanded, 'true');
                    this.blindText.text(this.opts.globalText.Collapse);
                    this.outCallback('select');
                    contentHeight.play();
                    this.utilSitemap.addClass(classUtilSitemapActive);
                } else {
                    this.utilSitemapOpener.attr(ariaAttr.expanded, 'false');
                    this.blindText.text(this.opts.globalText.Expand);
                    this.outCallback('unselect');
                    contentHeight.destroy();
                    this.utilSitemap.removeClass(classUtilSitemapActive);
                }
            },
            closeAll : function () {
                this.utilSitemapOpener.triggerHandler(this.changeEvents('click'));
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        // subNavigation
        function subNavigation (container, args) {
            var defParams = {
                naviBarSub : '.site-navi-bar__sub',
                subNavigation : '.sub-navigation',
                subNavigationOpener : '.select-opener',
                isSubNavActive : false,
                classAttr : {
                    subNavigationActive : 'is-opened'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                customEvent : '.subNavigation' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        subNavigation.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
            },
            setElements : function () {
                this.naviBarSub = this.obj.find(this.opts.naviBarSub);
                this.subNavigation = this.naviBarSub.find(this.opts.subNavigation);
                this.subNavigationOpener = this.subNavigation.find(this.opts.subNavigationOpener);
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
                    this.subNavigationOpener.on(this.changeEvents('click'), $.proxy(this.subNavOpen, this));
                } else {
                    this.subNavigationOpener.off(this.changeEvents('click'));
                }
            },
            subNavOpen : function (e) {
                e.preventDefault();
                var classSubNavigationActive = this.opts.classAttr.subNavigationActive,
                    ariaAttr = this.opts.ariaAttr;
                this.opts.isSubNavActive = !this.opts.isSubNavActive;
                if (this.opts.isSubNavActive) {
                    this.subNavigationOpener.attr(ariaAttr.expanded, 'true');
                    this.subNavigation.addClass(classSubNavigationActive);
                    win.setTimeout($.proxy(function () {
                        this.subNavigation.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.subNavigationOpener.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.subNavigationOpener.attr(ariaAttr.expanded, 'false');
                    this.subNavigation.removeClass(classSubNavigationActive);
                    this.subNavigation.off('clickoutside touchendoutside keyupoutside');
                }
            }
        };

        // shop tools
        function shopTools (container, args) {
            var defParams = {
                shopTools : '.shopping-tools',
                shopToolsOpener : '.tools-opener',
                blindText : '.ico-arrow .blind',
                isShopToolsActive : false,
                classAttr : {
                    shopToolsActive : 'is-expand'
                },
                ariaAttr : {
                    expanded : 'aria-expanded'
                },
                globalText : {},
                customEvent : '.shopTools' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        shopTools.prototype = {
            init : function () {
                this.setElements();
                this.bindEvents(true);
            },
            setElements : function () {
                this.shopTools = this.obj.find(this.opts.shopTools);
                this.shopToolsOpener = this.shopTools.find(this.opts.shopToolsOpener);
                this.blindText = this.shopToolsOpener.find(this.opts.blindText);
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
                    this.shopToolsOpener.on(this.changeEvents('click'), $.proxy(this.shopToolOpen, this));
                } else {
                    this.shopToolsOpener.off(this.changeEvents('click'));
                }
            },
            shopToolOpen : function (e) {
                e.preventDefault();
                var classShopToolsActive = this.opts.classAttr.shopToolsActive,
                    ariaAttr = this.opts.ariaAttr;
                this.opts.isShopToolsActive = !this.opts.isShopToolsActive;
                if (this.opts.isShopToolsActive) {
                    this.shopToolsOpener.attr(ariaAttr.expanded, 'true');
                    this.shopTools.addClass(classShopToolsActive);
                    this.blindText.text(this.opts.globalText.Collapse);
                    win.setTimeout($.proxy(function () {
                        this.shopTools.on('clickoutside touchendoutside keyupoutside', $.proxy(function () {
                            this.shopToolsOpener.triggerHandler(this.changeEvents('click'));
                        }, this));
                    }, this), 30);
                } else {
                    this.shopToolsOpener.attr(ariaAttr.expanded, 'false');
                    this.shopTools.removeClass(classShopToolsActive);
                    this.blindText.text(this.opts.globalText.Expand);
                    this.shopTools.off('clickoutside touchendoutside keyupoutside');
                }
            }
        };

        return Nav;
    })();
    return Nav;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.gnb = global.g2.gnb || {};
    global.g2.gnb.Scroller = factory();
}(this, function () { 'use strict';

    var Scroller = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util;
        function Scroller (container, args) {
            if (!(this instanceof Scroller)) {
                return new Scroller(container, args);
            }
            var defParams = {
                upEl : '.site-navi-bar__main',
                props : {},
                duration : 250,
                prevWinTop : null,
                isPause : false,
                isUpdate : false,
                customEvent : '.Scroller' + (new Date()).getTime() + Math.random(),
                viewType : null,
                scrollStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Scroller.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.setOpts();
                this.bindEvents(true);
            },
            setElements : function () {
                this.upEl = this.obj.find(this.opts.upEl);
            },
            initOpts : function () {
                this.opts.prevWinTop = $(win).scrollTop();
                TweenLite.set(this.obj, {y : 0});
            },
            setOpts : function () {
                this.opts.props['H'] = this.upEl.outerHeight(true);
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
                    this.obj.on(this.changeEvents('scrollDown'), $.proxy(this.scrollDown, this));
                    this.obj.on(this.changeEvents('scrollUp'), $.proxy(this.scrollUp, this));
                    $(win).on(this.changeEvents('scroll'), $.proxy(this.scrollFunc, this));
                } else {
                    this.obj.off(this.changeEvents('scrollDown'));
                    this.obj.off(this.changeEvents('scrollUp'));
                    $(win).off(this.changeEvents('scroll'));
                }
            },
            scrollFunc : function () {
                this.winTop = $(win).scrollTop();
                if (this.opts.scrollStart == null) {
                    this.opts.scrollStart = this.winTop;
                    this.scrollAnimateFunc();
                }
                win.clearTimeout(this.scrollEndTime);
                this.scrollEndTime = win.setTimeout($.proxy(this.scrollEndFunc, this), 150);
            },
            scrollEndFunc : function () {
                this.opts.scrollStart = null;
                Util.cancelAFrame.call(win, this.scrollRequestFrame);
            },
            scrollAnimateFunc : function () {
                this.setLayout();
                this.scrollRequestFrame = Util.requestAFrame.call(win, $.proxy(this.scrollAnimateFunc, this));
            },
            setPosition : function () {
                if (this.opts.viewType !== 'down') return;
                var props = this.opts.props;
                TweenLite.set(this.obj, {y : -props['H']});
            },
            setLayout : function () {
                if (this.opts.isUpdate) return;
                var winTop = $(win).scrollTop();
                if (winTop < 0) return;
                if (winTop > this.opts.prevWinTop) {
                    this.scrollDown();
                } else if (winTop < this.opts.prevWinTop) {
                    this.scrollUp();
                }
                this.opts.prevWinTop = winTop;
            },
            scrollDown : function () {
                var props = this.opts.props;
                if (this.opts.viewType !== 'down') {
                    this.opts.viewType = 'down';
                    var tweenOpts = {
                        y : -props['H']
                    };
                    this.obj.attr('data-animate-top', -props['H']);
                    TweenLite.to(this.obj, (this.opts.duration / 1000), tweenOpts);
                    this.obj.addClass(this.opts.stickyClass);
                }
            },
            scrollUp : function () {
                var props = this.opts.props;
                if (this.opts.viewType !== 'up') {
                    this.opts.viewType = 'up';
                    var tweenOpts = {
                        y : 0
                    };
                    this.obj.attr('data-animate-top', 0);
                    TweenLite.to(this.obj, (this.opts.duration / 1000), tweenOpts);
                    this.obj.removeClass(this.opts.stickyClass);
                }
            },
            play : function () {
                if (!this.opts.isPause) return;
                this.opts.prevWinTop = $(win).scrollTop();
                this.opts.isPause = false;
                this.bindEvents(true);
            },
            pause : function () {
                if (this.opts.isPause) return;
                this.opts.isPause = true;
                this.bindEvents(false);
            },
            update : function () {
                this.opts.isUpdate = true;
                this.setOpts();
                this.setPosition();
                win.clearTimeout(this.updateTime);
                this.updateTime = win.setTimeout($.proxy(function () {
                    this.opts.isUpdate = false;
                }, this), 150);
            }
        };

        return Scroller;
    })();
    return Scroller;

}));

(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.gnb = global.g2.gnb || {};
    global.g2.gnb.Component = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.G2.util,
            RESPONSIVE = win.G2.RESPONSIVE,
            INSTANCE = [];
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                obj : container,
                naviBarDimmed : '.site-navi-bar__dimmed',
                naviBarMain : '.site-navi-bar__main',
                naviBarSub : '.site-navi-bar__sub',
                stickyObj : null,
                stickyOpts : {
                    fixedClass : 'is-fixed',
                    anchor : {}
                },
                isScrollControl : false,
                isScrollLock : false,
                scrollObj : null,
                navObj : null,
                globalText : {},
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                resizeStart : null
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            INSTANCE.push(this);
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildSticky();
                this.buildScroller();
                this.buildNav();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.naviBarDimmed = this.obj.find(this.opts.naviBarDimmed);
                this.naviBarSub = this.obj.find(this.opts.naviBarSub);
            },
            initOpts : function () {
                if (this.naviBarSub.length) {
                    this.opts.isScrollControl = true;
                }
                // globalText
                var globalText = this.obj.data('global-text');
                if (globalText !== isUndefined) {
                    for (var gKey in globalText) {
                        var gText = $.trim(globalText[gKey]);
                        this.opts.globalText[gKey] = gText.length ? gText : gKey;
                    }
                }
            },
            buildSticky : function () {
                if (this.opts.stickyObj == null) {
                    this.opts.stickyObj = new win['HiveSticky'](this.obj, this.opts.stickyOpts);
                    win.G2.page.stickyInstance.push(this.opts.stickyObj);
                    this.objJsWrap = this.opts.stickyObj.jsStickyWrap;
                    this.objJsWrap.append(this.naviBarDimmed);
                }
            },
            buildScroller : function () {
                Util.def(this, {
                    scroller : {
                        play : $.proxy(function () {
                            if (this.opts.scrollObj == null) return;
                            this.opts.scrollObj.play();
                        }, this),
                        pause : $.proxy(function () {
                            if (this.opts.scrollObj == null) return;
                            this.opts.scrollObj.pause();
                        }, this),
                        update : $.proxy(function () {
                            if (this.opts.scrollObj == null) return;
                            this.opts.scrollObj.update();
                        }, this)
                    }
                });
                if (this.opts.isScrollControl) {
                    this.opts.scrollObj = new win.g2.gnb.Scroller(this.obj, {
                        upEl : this.opts.naviBarMain
                    });
                }
            },
            buildNav : function () {
                if (this.opts.navObj == null) {
                    this.opts.navObj = new win.g2.gnb.Nav(this.obj, {
                        globalText : this.opts.globalText,
                        naviBarDimmed : this.naviBarDimmed,
                        naviBarMain : this.opts.naviBarMain,
                        on : {
                            select : $.proxy(function () {
                                var currentScrollLock = null;
                                for (var insMin = 0, insMax = INSTANCE.length; insMin < insMax; insMin++) {
                                    var ins = INSTANCE[insMin],
                                        isScrollLock = ins.opts.isScrollLock;
                                    if (isScrollLock) {
                                        currentScrollLock = true;
                                    }
                                }
                                if (currentScrollLock == null) {
                                    Util.scrollLock(true);
                                }
                                this.opts.isScrollLock = true;
                                this.scroller.pause();
                            }, this),
                            unselect : $.proxy(function () {
                                this.opts.isScrollLock = false;
                                var currentScrollLock = null;
                                for (var insMin = 0, insMax = INSTANCE.length; insMin < insMax; insMin++) {
                                    var ins = INSTANCE[insMin],
                                        isScrollLock = ins.opts.isScrollLock;
                                    if (isScrollLock) {
                                        currentScrollLock = true;
                                    }
                                }
                                if (currentScrollLock == null) {
                                    Util.scrollLock(false);
                                }
                                this.scroller.play();
                            }, this)
                        }
                    });
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
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.scroller.update();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.scroller.update();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
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
                obj : '.site-navi-bar'
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
                    new win.g2.gnb.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
