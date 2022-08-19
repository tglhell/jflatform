// Event KV
(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.pipOverviewHero = global.g2.pipOverviewHero || {};
    global.g2.pipOverviewHero.Component = factory();
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
                pictureVideo : '.js-picture-video',
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
                            },
                        }
                    }
                },
                scrollBtn : '.cp-overview-hero__scroll-btn',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            }; 
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildPictureVideo();
                this.buildTween();
                this.bindEvents();
            },
            setElements : function () {
                this.pictureVideo = this.obj.find(this.opts.pictureVideo);
                this.scrollBtn = this.obj.find(this.opts.scrollBtn);
            },
            buildPictureVideo : function () {
                for (var i = 0, max = this.pictureVideo.length; i < max; i++) {
                    var pictureVideo = this.pictureVideo.eq(i);
                    new PictureVideo(pictureVideo);
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
            bindEvents : function () {
                this.scrollBtn.on(this.changeEvents('click'), 'button, a', $.proxy(this.scrollBtnClick, this));
            },
            scrollBtnClick : function (e) {
                e.preventDefault();
                // this.obj.after('<div style="position:absolute"></div>');
                // var objNext = this.obj.next();
                Util.scrollMoveFunc(this.scrollBtn, $.proxy(function () {
                    // objNext.remove();
                }, this));
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function PictureVideo (container, args) {
            if (!(this instanceof PictureVideo)) {
                return new PictureVideo(container, args);
            }
            var defParams = {
                obj : container,
                videoContainer : '.video-container'
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        PictureVideo.prototype = {
            init : function () {
                this.setElements();
                this.buildPictureVideo();
            },
            setElements : function () {
                this.videoContainer = this.obj.find(this.opts.videoContainer);
            },
            buildPictureVideo : function () {
                Util.def(this, {
                    cmvideo : {
                        instance : [],
                        play : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == isUndefined) return;
                            this.cmvideo.instance[index].play();
                        }, this),
                        pause : $.proxy(function (index) {
                            if (this.cmvideo.instance[index] == isUndefined) return;
                            this.cmvideo.instance[index].pause();
                        }, this),
                        pauseAll : $.proxy(function (index) {
                            for (var i = 0, max = this.cmvideo.instance.length; i < max; i++) {
                                if (i != index) {
                                    this.cmvideo.pause(i);
                                }
                            }
                        }, this),
                        build : $.proxy(function (index) {
                            this.cmvideo.pauseAll(index);
                            if (this.cmvideo.instance[index] == isUndefined) {
                                var videoContainer = this.videoContainer.eq(index);
                                if (videoContainer.length) {
                                    this.cmvideo.instance[index] = new HiveVideo(videoContainer);
                                    new HiveVideoScroll(videoContainer);
                                }
                            } else {
                                this.cmvideo.play(index);
                            }
                        }, this)
                    }
                });

                Util.def(this, {
                    picturevideo : {
                        instance : null,
                        play : $.proxy(function () {

                        }, this),
                        build : $.proxy(function () {
                            if (this.picturevideo.instance == null && this.obj.length) {
                                this.picturevideo.instance = this.obj.data('PictureVideo');
                                var buildCmvideo = $.proxy(function () {
                                    var index = this.picturevideo.instance.targets.filter('.is-active').index();
                                    this.cmvideo.build(index);
                                }, this);
                                this.picturevideo.instance.opts.on.complete = $.proxy(function () {
                                    buildCmvideo();
                                }, this);
                                buildCmvideo();
                            }
                        }, this)
                    }
                });
                this.picturevideo.build();
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
                obj : '.cp-overview-hero'
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
                    new win.g2.pipOverviewHero.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
