(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.verticalTabs = global.g2.verticalTabs || {};
    global.g2.verticalTabs.Component = factory();
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
                tabsInner : '.cp-vertical-tabs__inner',
                accordionObj : '.cm-accordion',
                accordionList : '.cm-accordion-list',
                accordionItem : '.cm-accordion-item',
                accordionBtn : '.cm-accordion-btn',
                accordionPanel : '.cm-accordion-panel',
                accordionPanelInner : '.cm-accordion-panel-inner',
                listImg : '.cp-vertical-tabs__list-img',
                tabsMediaList : '.cp-vertical-tabs__media-list',
                tabsMediaItem : '.cp-vertical-tabs__media-item',
                durationAttr : {
                    accordionItem : 400,
                    mediaItem : 400
                },
                classAttr : {
                    active : 'is-active',
                    visible : 'is-visible'
                },
                props : {},
                currentIndex : null,
                isAnimated : false,
                isInit : false,
                globalText : {},
                hasPCLayout : true,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                viewType : null,
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
                this.initDatas();
                this.buildVideo();
                this.initLayout();
                this.autoHeight();
                this.buildActiveBar();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.tabsInner = this.obj.find(this.opts.tabsInner);
                this.accordionObj = this.obj.find(this.opts.accordionObj);
                this.accordionList = this.accordionObj.find(this.opts.accordionList);
                this.accordionItems = this.accordionList.children();
                this.accordionBtns = this.accordionItems.find(this.opts.accordionBtn);
                this.tabsMediaList = this.obj.find(this.opts.tabsMediaList);
                this.tabsMediaItems = this.tabsMediaList.find(this.opts.tabsMediaItem);
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
            initDatas : function () {
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
                for (var linkMin = 0, linkMax = this.accordionBtns.length; linkMin < linkMax; linkMin++) {
                    var accordionBtn = this.accordionBtns.eq(linkMin),
                        accordionPanel = accordionBtn.next(this.opts.accordionPanel);
                    if (accordionBtn.length) {
                        this.opts.props[linkMin] = {
                            'LI' : accordionBtn.closest(this.opts.accordionItem),
                            'TAB' : accordionBtn,
                            'BLINDTXT' : accordionBtn.find('.blind'),
                            'PANEL' : accordionPanel,
                            'PANELINNER' : accordionPanel.find(this.opts.accordionPanelInner),
                            'PANELMO' : accordionPanel.find(this.opts.listImg),
                            'MEDIA' : this.tabsMediaItems.eq(linkMin),
                            'MEDIACONTENTS' : this.tabsMediaItems.eq(linkMin).children(),
                            'VIDEO' : this.tabsMediaItems.eq(linkMin).find('.video-container'),
                            'isActive' : false
                        };
                    }
                    if (linkMin == 0) {
                        this.opts.durationAttr.accordionItem = parseCssObj('height', accordionPanel);
                        this.opts.durationAttr.mediaItem = parseCssObj('opacity', this.tabsMediaItems.eq(linkMin));
                    }
                }
            },
            buildVideo : function () {
                Util.def(this, {
                    cmvideo : {
                        instance : [],
                        play : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == isUndefined) return;
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
                        }, this),
                        build : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == isUndefined) {
                                var panelItem = this.opts.props[index],
                                    panelMedia = panelItem['VIDEO'];
                                if (panelMedia.length) {
                                    this.cmvideo.instance[index] = new HiveVideo(panelMedia);
                                    new HiveVideoScroll(panelMedia);
                                }
                            } else {
                                this.cmvideo.play(index);
                            }
                        }, this)
                    }
                });
            },
            initLayout : function () {
                var classAttr = this.opts.classAttr,
                    activeItem = this.accordionItems.filter('.' + this.opts.classAttr.active),
                    activeIndex = activeItem.length ? this.accordionItems.index(activeItem) : 0;
                this.accordionBtns.find('.blind').text(this.opts.globalText.Expand);
                this.accordionItems.removeClass(classAttr.active);
                this.tabsMediaItems.removeClass(classAttr.active).hide();
                this.opts.currentIndex = activeIndex;
                this.cmvideo.build(activeIndex);
            },
            autoHeight : function () {
                Util.def(this, {
                    autoheight : {
                        instance : null,
                        kill : $.proxy(function () {
                            this.obj.css('height', '');
                            if (this.autoheight.instance == null) return;
                            this.autoheight.instance.kill();
                            this.autoheight.instance = null;
                        }, this),
                        play : $.proxy(function () {
                            if (this.opts.viewType == RESPONSIVE.TABLET3.NAME) return;
                            var step1 = TweenLite.to(this.obj, (250 / 1000), {
                                height : this.tabsInner.outerHeight(true),
                                onComplete : $.proxy(function () {
                                    this.obj.css({
                                        // overflow : '',
                                        height : ''
                                    });
                                }, this)
                            });
                            this.autoheight.instance = step1;
                        }, this),
                        init : $.proxy(function () {
                            if (this.opts.viewType == RESPONSIVE.TABLET3.NAME) return;
                            TweenLite.set(this.obj, {
                                // overflow : 'hidden',
                                height : this.tabsInner.outerHeight(true)
                            })
                        }, this)
                    }
                });
            },
            slideTo : function (index, speed) {
                var _this = this,
                    props = this.opts.props,
                    prop = props[index],
                    durationAttr = this.opts.durationAttr,
                    accordionDuration = speed == isUndefined ? durationAttr.accordionItem : speed,
                    classAttr = this.opts.classAttr,
                    animateBugTime = 30;
                if (this.opts.isAnimated) return;
                this.opts.isAnimated = true;
                var allClose = $.proxy(function (index) {
                    for (var pKey in props) {
                        (function (key) {
                            var prop = props[key];
                            if ((key != index) && prop['isActive']) {
                                prop['isActive'] = false;
                                prop['LI'].removeClass(classAttr.active).removeClass(classAttr.visible);
                                prop['MEDIA'].removeClass(classAttr.active).hide();
                                prop['PANEL'].css('height', prop['PANELINNER'].outerHeight(true));
                                prop['BLINDTXT'].text(_this.opts.globalText.Expand);
                                win.setTimeout($.proxy(function () {
                                    prop['PANEL'].css('height', 0);
                                    _this.cmvideo.pause(key);
                                    win.setTimeout($.proxy(function () {
                                        prop['PANEL'].css({
                                            'height' : '',
                                            'display' : 'none'
                                        });
                                    }, _this), accordionDuration);
                                }, _this), animateBugTime);
                            }
                        })(pKey);
                    }
                }, this);
                if (!prop['isActive']) {
                    this.autoheight.init();
                    allClose(index);
                    this.activebar.reset();
                    prop['isActive'] = true;
                    prop['LI'].addClass(classAttr.active);
                    prop['MEDIA'].show();
                    prop['PANEL'].css('display', '');
                    if (this.opts.isInit) {
                        Util.findFocus(prop['PANEL']);
                    }
                    win.setTimeout($.proxy(function () {
                        prop['MEDIA'].addClass(classAttr.active);
                        this.cmvideo.build(index);
                        prop['PANEL'].css({
                            'height' : prop['PANELINNER'].outerHeight(true)
                        });
                        prop['BLINDTXT'].text(this.opts.globalText.Collapse);
                        win.setTimeout($.proxy(function () {
                            prop['PANEL'].css('height', 'auto');
                            prop['LI'].addClass(classAttr.visible);
                            this.autoheight.play();
                            this.activebar.play(index);
                            this.opts.isAnimated = false;
                        }, this), accordionDuration + animateBugTime);
                    }, this), 30);
                } else {
                    prop['isActive'] = false;
                    prop['LI'].removeClass(classAttr.active).removeClass(classAttr.visible);
                    prop['MEDIA'].removeClass(classAttr.active).hide();
                    prop['PANEL'].css('height', prop['PANELINNER'].outerHeight(true));
                    prop['BLINDTXT'].text(this.opts.globalText.Expand);
                    win.setTimeout($.proxy(function () {
                        prop['PANEL'].css('height', 0);
                        this.cmvideo.pause(index);
                        win.setTimeout($.proxy(function () {
                            prop['PANEL'].css({
                                'height' : '',
                                'display' : 'none'
                            });
                            this.opts.isAnimated = false;
                        }, this), accordionDuration);
                    }, this), animateBugTime);
                }
                this.opts.currentIndex = index;
                this.opts.isInit = true;
            },
            changeResizeSlideTo : function (index) {
                var props = this.opts.props,
                    prop = props[index];
                if (!prop['isActive']) {
                    this.slideTo(index, 0);
                }
            },
            controlResizeSlideTo : function (index) {
                var props = this.opts.props,
                    prop = props[index],
                    condition = this.opts.viewType == RESPONSIVE.TABLET3.NAME;
                if (condition) {
                    this.slideTo(index);
                } else {
                    if (!prop['isActive']) {
                        this.slideTo(index);
                    }
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
                    this.accordionBtns.on(this.changeEvents('click'), $.proxy(this.accordionBtnClick, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                    this.accordionBtns.off(this.changeEvents('click'));
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
                        this.autoheight.kill();
                        this.resizeLayout();
                        this.changeResizeSlideTo(this.opts.currentIndex);
                    }
                } else {
                    if (this.opts.viewType !== 'OTHER') {
                        this.opts.viewType = 'OTHER';
                        this.resizeLayout();
                        this.changeResizeSlideTo(this.opts.currentIndex);
                    }
                    this.activebar.update();
                }
            },
            resizeLayout : function () {
                this.cmvideo.pause(this.opts.currentIndex);
                if (this.opts.viewType === 'OTHER') {
                    if (!this.opts.hasPCLayout) {
                        this.opts.hasPCLayout = true;
                        for (var key in this.opts.props) {
                            var prop = this.opts.props[key];
                            prop['MEDIA'].append(prop['MEDIACONTENTS']);
                        }
                    }
                } else {
                    if (this.opts.hasPCLayout) {
                        this.opts.hasPCLayout = false;
                        for (var key in this.opts.props) {
                            var prop = this.opts.props[key];
                            prop['PANELMO'].append(prop['MEDIACONTENTS']);
                        }
                    }
                }
            },
            accordionBtnClick : function (e) {
                e.preventDefault();
                var _target = $(e.currentTarget),
                    _index = this.accordionBtns.index(_target);
                this.controlResizeSlideTo(_index);
            },
            buildActiveBar : function () {
                Util.def(this, {
                    activebar : {
                        instance : null,
                        play : $.proxy(function (num, speed) {
                            if (this.activebar.instance == null) return;
                            this.activebar.instance.play(num);
                        }, this),
                        reset : $.proxy(function (speed) {
                            if (this.activebar.instance == null) return;
                            this.activebar.instance.reset();
                        }, this),
                        update : $.proxy(function () {
                            if (this.activebar.instance == null) return;
                            this.activebar.instance.update();
                        }, this)
                    }
                });
                if (this.accordionItems.length) {
                    this.activebar.instance = new ActiveBar(this.obj, {
                        props : this.opts.props
                    });
                }
            },
            outCallback : function (ing) {
                var callbackObj = this.opts[ing];
                if (callbackObj == null) return;
                callbackObj();
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function ActiveBar (container, args) {
            if (!(this instanceof ActiveBar)) {
                return new ActiveBar(container, args);
            }
            var defParams = {
                barLine : '.cp-vertical-tabs__list-line',
                barLineActive : '.el-line-active',
                props : {},
                speed : 300,
                activeIndex : null,
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        ActiveBar.prototype = {
            init : function () {
                this.setElements();
            },
            setElements : function () {
                this.barLine = this.obj.find(this.opts.barLine);
                this.barLineActive = this.barLine.find(this.opts.barLineActive);
            },
            play : function (num, speed) {
                var props = this.opts.props,
                    prop = props[num],
                    propOffsetTop = prop['LI'].offset().top,
                    propHeight = prop['LI'].outerHeight(),
                    barLineOffsetTop = this.barLine.offset().top,
                    tweenOpts = {
                        top : propOffsetTop - barLineOffsetTop,
                        height : propHeight
                    },
                    speed = (speed == isUndefined) ? this.opts.speed : speed;
                TweenLite.to(this.barLineActive, speed / 1000, tweenOpts);
                this.opts.activeIndex = num;
            },
            reset : function (speed) {
                var tweenOpts = {
                        top : 0,
                        height : '100%'
                    },
                    speed = (speed == isUndefined) ? this.opts.speed : speed;
                TweenLite.to(this.barLineActive, speed / 1000, tweenOpts);
            },
            update : function () {
                if (this.opts.activeIndex == null) return;
                var props = this.opts.props,
                    prop = props[this.opts.activeIndex],
                    propOffsetTop = prop['LI'].offset().top,
                    propHeight = prop['LI'].outerHeight(),
                    barLineOffsetTop = this.barLine.offset().top,
                    tweenOpts = {
                        top : propOffsetTop - barLineOffsetTop,
                        height : propHeight
                    };
                TweenLite.set(this.barLineActive, tweenOpts);
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
    global = global;
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
                obj : '.cp-vertical-tabs'
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
                    new win.g2.verticalTabs.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
