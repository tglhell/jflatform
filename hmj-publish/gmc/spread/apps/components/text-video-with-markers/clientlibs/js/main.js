(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.pip = global.g2.pip || {};
    global.g2.pip.videoWithMarkers = global.g2.pip.videoWithMarkers || {};
    global.g2.pip.videoWithMarkers.Component = factory();
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
                videoWrap : '.cp-vid-marker__video',
                videoContent : '.cp-vid-marker__video-content',
                videoAreaPC: '.cp-vid-marker__video-pc',
                videoAreaMO: '.cp-vid-marker__video-mo',
                videoContainer : '.video-container',
                videoElem : 'video',
                videoControl : '.cp-vid-marker__video-control',
                controlBtn : '.cm-btn-marker',
                controlLabelWrap : '.cp-vid-marker__video-label',
                controlLabelItem : 'el-control-label',
                contentArea : '.cp-vid-marker__content',
                classAttr : {
                    active : 'is-active',
                    dimmed : 'is-dimmed'
                },
                directionTweenOpts : {
                    smagicOpts : {
                        triggerHook : 1
                    },
                    tweenOpts : {
                        "SEQUENCE" : {
                            ".js-animate-txt" : {
                                "SET" : {
                                    "opacity" : 0,
                                    "y" : 100
                                },
                                "TO" : {
                                    "opacity" : 1,
                                    "y" : 0
                                },
                                "DELAY" : 0.2,
                                "DURATION" : 0.8
                            },
                            ".js-animate-vid" : {
                                "SET" : {
                                    "opacity" : 0,
                                    "y" : 100
                                },
                                "TO" : {
                                    "opacity" : 1,
                                    "y" : 0
                                },
                                "DELAY" : 1.2,
                                "DURATION" : 0.8
                            }
                        },
                        breakpoints : {
                            "1024" : {
                                "SEQUENCE" : {
                                    ".js-animate-vid" : {
                                        "SET" : {
                                            "opacity" : 0,
                                            "y" : 100
                                        },
                                        "TO" : {
                                            "opacity" : 1,
                                            "y" : 0
                                        },
                                        "DELAY" : 0.2,
                                        "DURATION" : 0.8
                                    },
                                    ".js-animate-cont" : {
                                        "SET" : {
                                            "opacity" : 0,
                                            "y" : 100
                                        },
                                        "TO" : {
                                            "opacity" : 1,
                                            "y" : 0
                                        },
                                        "DELAY" : 1,
                                        "DURATION" : 0.8
                                    },
                                    ".js-animate-txt" : {
                                        "SET" : {
                                            "opacity" : 0,
                                            "y" : 100
                                        },
                                        "TO" : {
                                            "opacity" : 1,
                                            "y" : 0
                                        },
                                        "DELAY" : 0.2,
                                        "DURATION" : 0.8
                                    }
                                }
                            }
                        }
                    }
                },
                customEvent: '.Component' + (new Date()).getTime() + Math.random(),
                currentIndex : 0,
                markNameArr : [],
                markTimeArr : [],
                isVideoLoaded : false,
                videoEnded : false,
                totalMarks : 0,
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
                this.initLayout();
                this.buildTween();
                this.bindEvents(true);
            },
            setElements : function () {
                this.videoWrap = this.obj.find(this.opts.videoWrap);
                this.videoContent = this.obj.find(this.opts.videoContent);
                this.videoAreaPC = this.videoWrap.find(this.opts.videoAreaPC).find(this.opts.videoContainer);
                this.videoAreaMO = this.videoWrap.find(this.opts.videoAreaMO).find(this.opts.videoContainer);
                this.videoElemPC = this.videoAreaPC.find(this.opts.videoElem);
                this.videoObjPC = this.videoAreaPC.data('HiveVideo');
                this.videoControl = this.videoWrap.find(this.opts.videoControl);
                this.controlBtn = this.videoWrap.find(this.opts.controlBtn);
                this.controlLabelWrap = this.videoWrap.find(this.opts.controlLabelWrap);
                this.contentArea = this.obj.find(this.opts.contentArea);
            },
            initLayout : function () {
                this.winWidth = Util.winSize().w;
                if (this.videoElemPC.length > 0) {
                    this.contentArea = this.contentArea.css('opacity', 0);
                }
                if (!Util.isSupportTransform || Util.isSupportTransform && (this.winWidth > RESPONSIVE.TABLET3.WIDTH)) {
                    this.videoAreaPC.attr('data-use-scrollmagic', 'true');
                    this.videoAreaMO.attr('data-use-scrollmagic', 'false');
                } else {
                    this.videoAreaPC.attr('data-use-scrollmagic', 'false');
                    this.videoAreaMO.attr('data-use-scrollmagic', 'true');
                }
            },
            buildTween : function () {
                new DirectionTween(this.obj, this.opts.directionTweenOpts);
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
                    $(win).on(this.changeEvents('resize'), $.proxy(this.resizeFunc, this));
                    this.videoElemPC.on(this.changeEvents('canplay'), $.proxy(this.videoInitFunc, this));
                    this.videoElemPC.on(this.changeEvents('ended'), $.proxy(this.videoLoopFunc, this));
                    this.videoElemPC.on(this.changeEvents('timeupdate'), $.proxy(this.checkTimeFunc, this));
                    this.controlBtn.on(this.changeEvents('click'), $.proxy(this.resumePlay, this));
                } else {
                    $(win).off(this.changeEvents('resize'));
                    this.videoElemPC.off(this.changeEvents('canplay timeupdate ended'));
                    this.controlBtn.off(this.changeEvents('click'));
                }
            },
            videoInitFunc : function () {
                if (this.opts.isVideoLoaded == true) return;
                this.opts.isVideoLoaded = true;
                var timeMarkObj = JSON.parse(this.videoControl.attr('data-time-mark')),
                    videoDuration = this.videoObjPC.videoObj[0].duration;
                for (var prop in timeMarkObj) {
                    var timeValue = ($.trim(timeMarkObj[prop]) == '') ? undefined : Number(timeMarkObj[prop]);
                    if (timeValue < 0 || timeValue > videoDuration) {
                        timeValue = undefined;
                    }
                    this.opts.markNameArr.push(prop);
                    this.opts.markTimeArr.push(timeValue);
                    this.opts.totalMarks++;
                } 
                this.setLabelFunc();
                if (this.videoElemPC.length > 0) {
                    this.contentArea.css('opacity', 1);
                }
            },
            setLabelFunc : function () {
                for (var i = 0, max = this.opts.totalMarks; i < max; i++) {
                    var labelElem = '<span class="' + this.opts.controlLabelItem + '">' + this.opts.markNameArr[i] + '</span>';
                    this.controlLabelWrap.append(labelElem);
                }
                this.controlLabelItem = this.controlLabelWrap.children();
                this.controlLabelItem.eq(this.opts.currentIndex).addClass(this.opts.classAttr.active);
            },
            videoLoopFunc : function () {
                this.opts.videoEnded = true;
                this.videoObjPC.play();
            },
            checkTimeFunc : function (e) {
                var currentIdx = this.opts.currentIndex,
                    nextIdx = (currentIdx + 1 === this.opts.totalMarks || this.opts.totalMarks === 1) ? 0 : (currentIdx + 1),
                    currentTime = e.currentTarget.currentTime,
                    nextTime = this.opts.markTimeArr[nextIdx];
                if (nextTime === undefined) {
                    this.videoAreaPC.attr('data-use-scrollmagic', 'false');
                    this.videoContent.removeClass(this.opts.classAttr.dimmed);
                    this.videoControl.removeClass(this.opts.classAttr.active);
                    this.videoObjPC.pause();
                } else if (nextIdx === 0) {
                    if (this.opts.videoEnded == true && currentTime >= nextTime) {
                        this.timeMarkFunc(nextIdx);
                        this.opts.videoEnded = false;
                    }
                } else if (currentTime >= nextTime) {
                   this.timeMarkFunc(nextIdx);
                }
            },
            timeMarkFunc : function (nextIdx) {
                this.videoAreaPC.attr('data-use-scrollmagic', 'false');
                this.videoObjPC.pause();
                this.controlLabelItem.eq(nextIdx).addClass(this.opts.classAttr.active).siblings().removeClass(this.opts.classAttr.active);
                this.videoContent.addClass(this.opts.classAttr.dimmed);
                this.videoControl.addClass(this.opts.classAttr.active);
                this.opts.currentIndex = nextIdx;
            },
            resumePlay : function (e) {
                this.videoAreaPC.attr('data-use-scrollmagic', 'true');
                this.videoContent.removeClass(this.opts.classAttr.dimmed);
                this.videoControl.removeClass(this.opts.classAttr.active);
                this.videoObjPC.play();
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
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            controlTooltip : function () {
                var tooltip = this.obj.find('.cm-tooltip');
                for (var i = 0, max = tooltip.length; i < max; i++) {
                    (function (index) {
                        var tt = tooltip.eq(index),
                            instance = tt.data('ToolTip');
                        if (instance.opts.isActive) {
                            instance.close();
                        }
                    })(i);
                }
            },
            setLayout : function () {
                if (!Util.isSupportTransform || Util.isSupportTransform && (this.winWidth > RESPONSIVE.TABLET3.WIDTH)) {
                    if (this.opts.viewType !== 'pc') {
                        this.opts.viewType = 'pc';
                        this.controlTooltip();
                        this.resizeLayout();
                    }
                } else {
                    if (this.opts.viewType !== 'mo') {
                        this.opts.viewType = 'mo';
                        this.controlTooltip();
                        this.resizeLayout();
                    }
                }
            },
            resizeLayout : function () {
                if (this.opts.viewType === 'pc') {
                    this.videoAreaPC.attr('data-use-scrollmagic', 'true');
                    this.videoAreaMO.attr('data-use-scrollmagic', 'false');
                } else {
                    this.videoAreaPC.attr('data-use-scrollmagic', 'false');
                    this.videoAreaMO.attr('data-use-scrollmagic', 'true');
                }
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
    global = global;
    $(function () {
        factory(global, global.jQuery, global.document);
    });
}(this, function (win, $, doc, isUndefined) { 'use strict';

    var Component = (function () {
        var Util = win.G2.util;
        function Component (args) {
            var defParams = {
                obj : '.cp-vid-marker'
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
                    new win.g2.pip.videoWithMarkers.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
