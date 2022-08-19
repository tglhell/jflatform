(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cmLoadingBar = global.g2.cmLoadingBar || {};
    global.g2.cmLoadingBar.Component = factory();
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
                dimmed : '.cm-loadingbar__dimmed',
                wrapper : '.cm-loadingbar__wrapper',
                startEl : '.cm-loadingbar__start',
                completeEl : '.cm-loadingbar__complete',
                completeIcon : '.cm-loadingbar__complete-icon',
                iconWrap : '.cm-loadingbar__icon-wrap',
                icon : '.icon',
                timeline : {
                    show : [],
                    icon : []
                },
                isActive : false,
                loadIgnore : false,
                classAttr : {
                    active : 'is-active'
                },
                durationAttr : {
                    obj : 150,
                    dimmed : 250,
                    wrapper : 250,
                    icon : 200
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
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.dimmed = this.obj.find(this.opts.dimmed);
                this.wrapper = this.obj.find(this.opts.wrapper);
                this.startEl = this.wrapper.find(this.opts.startEl);
                this.completeEl = this.wrapper.find(this.opts.completeEl);
                this.completeIcon = this.completeEl.find(this.opts.completeIcon);
                this.iconWrap = this.wrapper.find(this.opts.iconWrap);
                this.icon = this.iconWrap.find(this.opts.icon);
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
                this.obj.on(this.changeEvents('loadingShow'), $.proxy(this.loadingShow, this));
                this.obj.on(this.changeEvents('loadingComplete'), $.proxy(this.loadingComplete, this));
                this.obj.on(this.changeEvents('loadingHide'), $.proxy(this.loadingHide, this));
            },
            loadingShow : function () {
                if (this.opts.isActive) return;
                this.opts.isActive = true;
                this.kill();
                this.reset();
                var durationAttr = this.opts.durationAttr;
                this.obj.addClass(this.opts.classAttr.active);
                var timeline = new TimelineMax();
                timeline.to(this.dimmed.get(0), durationAttr.dimmed / 1000, {
                    opacity : 1
                })
                .fromTo(this.wrapper.get(0), durationAttr.wrapper / 1000, {
                    scale : .75
                }, {
                    ease : Expo.easeOut,
                    opacity : 1,
                    scale : 1,
                    onComplete : $.proxy(function () {
                        this.wrapper.css('transform', '');
                        if (!this.opts.loadIgnore) {
                            var icontimeline = new TimelineMax();
                            var icon1 = this.icon.eq(0);
                            var icon2 = this.icon.eq(1);
                            var icon3 = this.icon.eq(2);
                            icontimeline.to(icon1, durationAttr.icon / 1000, {
                                opacity : 1,
                                onReverseComplete : $.proxy(function () {
                                    win.clearTimeout(this.iconreverseTime);
                                    this.iconreverseTime = win.setTimeout($.proxy(function () {
                                        if (icontimeline != null) {
                                            icontimeline.play();
                                        }
                                    }, this), durationAttr.icon);
                                }, this)
                            })
                            .to(icon2, durationAttr.icon / 1000, {
                                opacity : 1
                            })
                            .to(icon3, durationAttr.icon / 1000, {
                                opacity : 1,
                                onComplete : $.proxy(function () {
                                    icontimeline.reverse();
                                }, this)
                            });
                            this.opts.timeline.icon.push(icontimeline);
                        }
                    }, this)
                });
                this.opts.timeline.show.push(timeline);
            },
            loadingComplete : function (e, data) {
                if (!this.opts.isActive) return;
                if (this.opts.loadIgnore) return;
                this.opts.loadIgnore = true;
                this.timelineIconKill();
                var durationAttr = this.opts.durationAttr;
                var afterHide = (data && data.hasOwnProperty('afterHide')) ? data.afterHide : true;
                TweenLite.set(this.completeIcon, {opacity:0, scale:.75});
                var timeline = new TimelineMax();
                timeline.to(this.startEl.get(0), durationAttr.obj / 1000, {
                    opacity : 0,
                    display : 'none',
                    onComplete : $.proxy(function () {
                        this.completeEl.show();
                    }, this)
                })
                .to(this.completeIcon.get(0), durationAttr.wrapper / 1000, {
                    ease : Back.easeOut.config(3),
                    opacity : 1,
                    scale : 1,
                    onComplete : $.proxy(function () {
                        if (afterHide) {
                            win.setTimeout($.proxy(function () {
                                this.obj.trigger('loadingHide', data);
                            }, this), 750);
                        }
                    }, this)
                });
                this.opts.timeline.show.push(timeline);
            },
            loadingHide : function (e, data) {
                if (!this.opts.isActive) return;
                this.opts.isActive = false;
                this.opts.loadIgnore = true;
                this.kill();
                var durationAttr = this.opts.durationAttr;
                var cb = (data && data.complete) || function () {};
                var timeline = TweenLite.to(this.obj, durationAttr.obj / 1000, {
                    opacity : 0,
                    onComplete : $.proxy(function () {
                        this.obj.removeClass(this.opts.classAttr.active);
                        this.reset();
                        cb();
                    }, this)
                });
                this.opts.timeline.show.push(timeline);
            },
            reset : function () {
                this.opts.loadIgnore = false;
                this.startEl.css({
                    'opacity' : '',
                    'display' : ''
                });
                this.completeEl.hide();
                this.obj.css('opacity', '');
                this.dimmed.css('opacity', 0);
                this.wrapper.css('opacity', 0);
                this.icon.css('opacity', 0);
            },
            timelineShowKill : function () {
                for (var i = 0, max = this.opts.timeline.show.length; i < max; i++) {
                    this.opts.timeline.show[i].kill();
                }
                this.opts.timeline.show = [];
            },
            timelineIconKill : function () {
                win.clearTimeout(this.iconreverseTime);
                for (var i = 0, max = this.opts.timeline.icon.length; i < max; i++) {
                    this.opts.timeline.icon[i].kill();
                    this.opts.timeline.icon[i] = null;
                }
                this.opts.timeline.icon = [];
            },
            kill : function () {
                this.timelineShowKill();
                this.timelineIconKill();
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
                obj : '.cm-loadingbar',
                isAemEditMode : Util.isAemEditMode()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                if (!this.opts.isAemEditMode) {
                    this.callComponent();
                }
            },
            callComponent : function () {
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    new win.g2.cmLoadingBar.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
