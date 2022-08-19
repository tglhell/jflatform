(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpVideoInteraction = global.g2.cpVideoInteraction || {};
    global.g2.cpVideoInteraction.Component = factory();
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
                directionTweenOpts : {
                    tweenOpts : {
                        "SET" : {
                            "opacity" : 1
                        },
                        "SEQUENCE" : {
                            ".js-animate" : {
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
                },
                panelWrap : '.cp-video-interaction__video',
                panelVideo : '.video-container',
                ctaWrap : '.cp-video-interaction__cta',
                ctaPrev : '.video-button-prev',
                ctaNext : '.video-button-next',
                currentIndex : 0,
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildTween();
                this.buildCmVideo();
                this.buildPlayer();
                this.bindEvents();
                this.loadComponent();
            },
            setElements : function () {
                this.panelWrap = this.obj.find(this.opts.panelWrap);
                this.panelVideo = this.panelWrap.find(this.opts.panelVideo);
                this.ctaWrap = this.obj.find(this.opts.ctaWrap);
                this.ctaPrev = this.ctaWrap.find(this.opts.ctaPrev);
                this.ctaNext = this.ctaWrap.find(this.opts.ctaNext);
            },
            buildTween : function () {
                new DirectionTween(this.obj, this.opts.directionTweenOpts);
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
                for (var min = 0, max = this.panelVideo.length; min < max; min++) {
                    var panelVideo = this.panelVideo.eq(min);
                    if (panelVideo.length) {
                        this.cmvideo.instance.push(panelVideo.data('HiveVideo'));
                    } else {
                        this.cmvideo.instance.push(null);
                    }
                }
            },
            buildPlayer : function () {
                Util.def(this, {
                    player : {
                        init : false,
                        instances : [],
                        currentIndex : null,
                        isAllHide : $.proxy(function () {
                            var flag = true;
                            for (var min = 0, max = this.player.instances.length; min < max; min++) {
                                var instance = this.player.instances[min];
                                if (instance.isActive) {
                                    flag = false;
                                }
                            }
                            return flag;
                        }, this),
                        hideAll : $.proxy(function (not_index) {
                            for (var min = 0, max = this.player.instances.length; min < max; min++) {
                                var instance = this.player.instances[min];
                                if ((min != not_index) && instance.component.opts.isActive) {
                                    this.player.hide(min);
                                }
                            }
                        }, this),
                        hide : $.proxy(function (index) {
                            var activeInstance = this.player.instances[index];
                            if (activeInstance) {
                                var viewFunc = $.proxy(function () {
                                    activeInstance.isActive = false;
                                    this.player.allHideToPlay();
                                }, this);
                                activeInstance.component.hide(viewFunc);
                            }
                        }, this),
                        allHideToPlay : $.proxy(function () {
                            var isAllHide = this.player.isAllHide();
                            if (isAllHide) {
                                var activeInstance = this.player.instances[this.player.currentIndex];
                                if (!activeInstance.component.opts.isActive) {
                                    activeInstance.isActive = true;
                                    activeInstance.component.play();
                                }
                            }
                        }, this),
                        play : $.proxy(function (index) {
                            var activeInstance = this.player.instances[index];
                            if (activeInstance) {
                                this.player.currentIndex = index;
                                if (!this.player.init) {
                                    this.player.init = true;
                                    activeInstance.isActive = true;
                                    activeInstance.component.play();
                                } else {
                                    this.player.hideAll(index);
                                }
                            }
                        }, this)
                    }
                });

                for (var min = 0, max = this.panelVideo.length; min < max; min++) {
                    var panelVideo = this.panelVideo.eq(min);
                    var player = new Player(panelVideo, {
                        on : {
                            PlayComplete : $.proxy(function () {
                                this.cmvideo.play(this.player.currentIndex);
                            }, this),
                            HideComplete : $.proxy(function () {
                                this.cmvideo.pauseAll(this.player.currentIndex);
                            }, this)
                        }
                    });
                    var data = {
                        component : player,
                        isActive : false
                    }
                    this.player.instances.push(data);
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
                this.ctaPrev.on(this.changeEvents('click'), 'button', $.proxy(this.ctaPrevClick, this));
                this.ctaNext.on(this.changeEvents('click'), 'button', $.proxy(this.ctaNextClick, this));
            },
            ctaPrevClick : function (e) {
                e.preventDefault();
                this.syncBtn(0);
                this.player.play(0);
                this.ctaNext.find('button').focus();
            },
            ctaNextClick : function (e) {
                e.preventDefault();
                this.syncBtn(1);
                this.player.play(1);
                this.ctaPrev.find('button').focus();
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
            syncBtn : function (index) {
                if (index == 0) {
                    this.ctaPrev.hide();
                    this.ctaNext.css('display', '');
                } else {
                    this.ctaPrev.css('display', '');
                    this.ctaNext.hide();
                }
            },
            loadComponent : function () {
                this.syncBtn(this.opts.currentIndex);
                this.player.play(this.opts.currentIndex);
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Player (container, args) {
            var defParams = {
                isActive : false,
                tweenAttr : {
                    duration : 0,
                    delay : 0,
                    step1 : {
                        opacity : 1
                    },
                    step2 : {
                        opacity : 1
                    },
                    step3 : {
                        opacity : 1
                    }
                },
                classAttr : {
                    active : 'is-active'
                },
                ariaAttr : {
                    hidden : 'aria-hidden'
                },
                dataAttr : {
                    useScrollmagic : 'data-use-scrollmagic'
                },
                on : {
                    PlayComplete : null,
                    HideComplete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Player.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
            },
            setElements : function () {
            },
            initLayout : function () {
                this.obj.hide();
            },
            play : function () {
                this.opts.isActive = true;
                var tweenAttr = this.opts.tweenAttr;
                var step2 = Util.def({
                    delay : tweenAttr.delay,
                    onComplete : $.proxy(function () {
                        this.outCallback('PlayComplete');
                    }, this)
                }, tweenAttr.step2);
                this.obj.css('display', '');
                this.obj.attr(this.opts.dataAttr.useScrollmagic, 'true');
                TweenLite.fromTo(this.obj, tweenAttr.duration, tweenAttr.step1, step2);
            },
            hide : function (callback) {
                var cb = callback || function () {};
                this.opts.isActive = false;
                var tweenAttr = this.opts.tweenAttr;
                var step3 = Util.def({
                    delay : tweenAttr.delay,
                    onComplete : $.proxy(function () {
                        this.outCallback('HideComplete');
                    }, this)
                }, tweenAttr.step3);
                TweenLite.to(this.obj, tweenAttr.duration, step3);
                win.clearTimeout(this.opts.showTime);
                this.opts.showTime = win.setTimeout($.proxy(function () {
                    this.obj.hide();
                    this.obj.attr(this.opts.dataAttr.useScrollmagic, 'false');
                    cb();
                }, this), tweenAttr.duration * 1000);
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
                obj : '.cp-video-interaction'
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
                    new win.g2.cpVideoInteraction.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
