(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpKeyVisualCarousel = global.g2.cpKeyVisualCarousel || {};
    global.g2.cpKeyVisualCarousel.Component = factory();
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
                props : {},
                visualWrap : '.main-visual__wrap',
                carouselContainer : '.swiper-container',
                carouselWrapper : '.swiper-wrapper',
                carouselItem : '.swiper-slide',
                carouselPage : '.swiper-pagination',
                carouselPageBullet : '.swiper-pagination-bullet',
                carouselController : '.swiper-control',
                carouselTimer : '.swiper-timer',
                carouselPrev : '.swiper-button-prev button',
                carouselNext : '.swiper-button-next button',
                pictureVideo : '.js-picture-video',
                isAnimate : false,
                globalText : {},
                ariaAttr : {
                    label : 'aria-label'
                },
                classAttr : {
                    loaded : 'is-loaded'
                },
                isLoaded : false,
                isInArea : false,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                viewType : null,
                scrollStart : null,
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
                this.initLayout();
                this.buildPictureVideo();
                this.buildItemPanel();
                this.buildControl();
                this.buildTimer();
                this.buildTab();
                this.resizeFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.visualWrap = this.obj.find(this.opts.visualWrap);
                this.carouselContainer = this.visualWrap.find(this.opts.carouselContainer);
                this.carouselWrapper = this.carouselContainer.find(this.opts.carouselWrapper);
                this.carouselItem = this.carouselWrapper.find(this.opts.carouselItem);
                this.carouselPage = this.visualWrap.find(this.opts.carouselPage);
                this.carouselPrev = this.visualWrap.find(this.opts.carouselPrev);
                this.carouselNext = this.visualWrap.find(this.opts.carouselNext);
                this.carouselController = this.visualWrap.find(this.opts.carouselController);
                this.carouselTimer = this.visualWrap.find(this.opts.carouselTimer);
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
            initLayout : function () {
                var _this = this,
                    bulletItems = [];
                for (var itemMin = 0, itemMax = this.carouselItem.length; itemMin < itemMax; itemMin++) {
                    (function (index) {
                        var carouselItem = _this.carouselItem.eq(index);
                        bulletItems.push('<button class="' + _this.opts.carouselPageBullet.split('.')[1] + '" data-bullet-index="' + index + '"><span class="ico-bullet"><span class="blind">slide' + (index + 1) + '</span></span></button>');
                    })(itemMin);
                }
                this.carouselPage.addClass(this.opts.carouselPageBullet.split('.')[1] + 's');
                this.carouselPage.append(bulletItems.join(''));
                this.carouselPageBullet = this.carouselPage.find(this.opts.carouselPageBullet);
                this.carouselPrev.attr(this.opts.ariaAttr.label, 'Previous slide');
                this.carouselNext.attr(this.opts.ariaAttr.label, 'Next slide');
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
                    $(win).on(this.changeEvents('scroll'), $.proxy(this.scrollFunc, this));
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    $(win).off(this.changeEvents('scroll'));
                    $(win).off(this.changeEvents('resize orientationchange'));
                }
            },
            setOpts : function () {
                var offset = this.obj.offset(),
                    height = this.obj.outerHeight(true);
                this.opts.props['offset'] = offset.top;
                this.opts.props['minOffset'] = Math.ceil(offset.top - Util.winSize().h, 10);
                this.opts.props['maxOffset'] = Math.ceil(offset.top + height, 10);
            },
            scrollTimerControl : function () {
                var props = this.opts.props,
                    winTop = $(win).scrollTop();
                if (props.minOffset <= winTop && winTop < props.maxOffset) {
                    if (!this.opts.isInArea) {
                        this.opts.isInArea = true;
                        this.controller.isPlay = false;
                        this.timer.play(this.timer.activeIndex);
                    }
                } else {
                    if (this.opts.isInArea) {
                        this.opts.isInArea = false;
                        this.controller.isPlay = true;
                        this.timer.pause(this.timer.activeIndex);
                    }
                }
            },
            isInActiveControl : function () {
                if (!this.opts.isInArea) {
                    this.controller.isPlay = true;
                    this.timer.pause(this.timer.activeIndex);
                }
            },
            scrollFunc : function () {
                this.winTop = $(win).scrollTop();
                if (this.opts.scrollStart == null) {
                    this.opts.scrollStart = this.winTop;
                    this.scrollAnimateFunc();
                }
                win.clearTimeout(this.scrollEndTimeout);
                this.scrollEndTimeout = win.setTimeout($.proxy(this.scrollEndFunc, this), 60);
            },
            scrollEndFunc : function () {
                this.opts.scrollStart = null;
                Util.cancelAFrame.call(win, this.scrollRequestFrame);
            },
            scrollAnimateFunc : function () {
                this.setOpts();
                this.scrollTimerControl();
                this.scrollRequestFrame = Util.requestAFrame.call(win, $.proxy(this.scrollAnimateFunc, this));
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
                this.setOpts();
                this.scrollFunc();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            loadHeight : function () {
                if (this.opts.isLoaded) return;
                this.obj.addClass(this.opts.classAttr.loaded);
                this.opts.isLoaded = true;
            },
            buildPictureVideo : function () {
                Util.def(this, {
                    picturevideo : {
                        instance : [],
                        activeIndex : null,
                        show : $.proxy(function (index) {
                            if (this.picturevideo.instance[index] == isUndefined) return;
                            this.picturevideo.instance[index].play();
                        }, this),
                        pause : $.proxy(function (index) {
                            if (this.picturevideo.instance[index] == isUndefined) return;
                            this.picturevideo.instance[index].pause();
                        }, this),
                        play : $.proxy(function (index) {
                            var carouselItem = this.carouselItem.eq(index),
                                pictureVideo = carouselItem.find(this.opts.pictureVideo);
                            if (this.picturevideo.activeIndex != null) {
                                this.picturevideo.pause(this.picturevideo.activeIndex);
                            }
                            if (pictureVideo.length) {
                                if (this.picturevideo.instance[index] == isUndefined) {
                                    this.picturevideo.instance[index] = new PictureVideo(pictureVideo);
                                } else {
                                    this.picturevideo.show(index);
                                }
                            }
                            this.picturevideo.activeIndex = index;
                        }, this)
                    }
                });
            },
            buildItemPanel : function () {
                Util.def(this, {
                    itempanel : {
                        instance : [],
                        isLoaded : false,
                        activeIndex : null,
                        autoHeight : $.proxy(function (index, type) {
                            if (this.itempanel.instance[index] == isUndefined) return;
                            if (type === 'set') {
                                var target = this.itempanel.instance[index].obj.find('.slide-inner');
                                TweenLite.set(this.carouselWrapper, {
                                    height : target.outerHeight()
                                });
                            } else {
                                var duration = (250 / 1000);
                                var target = this.itempanel.instance[index].obj.find('.slide-inner');
                                if (!this.itempanel.isLoaded) {
                                    duration = 0;
                                    this.itempanel.isLoaded = true;
                                }
                                TweenLite.to(this.carouselWrapper, duration, {
                                    height : target.outerHeight(),
                                    onComplete : $.proxy(function () {
                                        this.carouselWrapper.css('height', '');
                                    }, this)
                                });
                            }
                        }, this),
                        show : $.proxy(function (index) {
                            if (this.itempanel.instance[index] == isUndefined) return;
                            this.itempanel.instance[index].show();
                        }, this),
                        hide : $.proxy(function (index) {
                            if (this.itempanel.instance[index] == isUndefined) return;
                            this.itempanel.instance[index].hide();
                        }, this),
                        play : $.proxy(function (index) {
                            if (this.itempanel.instance[index] == isUndefined) return;
                            if (this.itempanel.activeIndex != null) {
                                this.itempanel.autoHeight(this.itempanel.activeIndex, 'set');
                                this.itempanel.hide(this.itempanel.activeIndex);
                            }
                            this.itempanel.show(index);
                            this.itempanel.autoHeight(index, 'view');
                        }, this),
                        build : $.proxy(function () {
                            var build = $.proxy(function (obj, index) {
                                var instance = new ItemPanel(obj, {
                                    on : {
                                        complete : $.proxy(function () {
                                            this.loadHeight();
                                            this.picturevideo.play(index);
                                            this.itempanel.activeIndex = index;
                                            this.opts.isAnimate = false;
                                        }, this)
                                    }
                                });
                                this.itempanel.instance.push(instance);
                            }, this);
                            for (var i = 0, max = this.carouselItem.length; i < max; i++) {
                                build(this.carouselItem.eq(i), i);
                            }
                        }, this)
                    }
                });
                this.itempanel.build();
            },
            buildControl : function () {
                Util.def(this, {
                    controller : {
                        instance : null,
                        isPlay : false,
                        controlClass : $.proxy(function (type) {
                            if (this.controller.instance == null) return;
                            this.controller.instance.controlClass(type);
                        }, this),
                        build : $.proxy(function () {
                            if (this.carouselController.length && (this.carouselPageBullet.length > 1)) {
                                this.controller.instance = new Controller(this.obj, {
                                    carouselController : this.opts.carouselController,
                                    isPlay : this.controller.isPlay,
                                    globalText : this.opts.globalText,
                                    on : {
                                        play : $.proxy(function () {
                                            this.controller.isPlay = true;
                                            this.timer.pause(this.timer.activeIndex);
                                        }, this),
                                        pause : $.proxy(function () {
                                            this.controller.isPlay = false;
                                            this.timer.play(this.timer.activeIndex);
                                        }, this)
                                    }
                                });
                            }
                            if (this.carouselPageBullet.length <= 1) {
                                this.carouselPage.hide();
                                this.carouselPrev.hide();
                                this.carouselNext.hide();
                            }
                        }, this)
                    }
                });
                this.controller.build();
            },
            buildTimer : function () {
                Util.def(this, {
                    timer : {
                        instance : [],
                        activeIndex : null,
                        play : $.proxy(function (num) {
                            if (this.timer.instance[num] == isUndefined) return;
                            if (this.controller.isPlay) return;
                            this.controller.controlClass(false);
                            this.timer.instance[num].play();
                        }, this),
                        pause : $.proxy(function (num) {
                            if (this.timer.instance[num] == isUndefined) return;
                            this.controller.controlClass(true);
                            this.timer.instance[num].pause();
                        }, this),
                        reset : $.proxy(function (num) {
                            if (this.timer.instance[num] == isUndefined) return;
                            this.timer.instance[num].progress(0);
                        }, this),
                        build : $.proxy(function (num, autoplay) {
                            if (this.timer.instance[num] == isUndefined) {
                                if (this.carouselTimer.length && (this.carouselPageBullet.length > 1)) {
                                    this.timer.instance[num] = new Timer(this.carouselPageBullet.eq(num), {
                                        autoPlay : autoplay,
                                        on : {
                                            complete : $.proxy(function () {
                                                this.timer.reset(num);
                                                var next = num + 1;
                                                if (next >= this.carouselPageBullet.length) {
                                                    next = 0;
                                                }
                                                this.timer.activeIndex = next;
                                                this.tab.change(next);
                                            }, this)
                                        }
                                    });
                                    this.timer.build(num);
                                } else {
                                    this.carouselController.hide();
                                }
                            } else {
                                this.timer.activeIndex = num;
                                this.timer.play(num);
                                this.isInActiveControl();
                            }
                        }, this)
                    }
                });
            },
            buildTab : function () {
                Util.def(this, {
                    tab : {
                        instance : [],
                        activeIndex : null,
                        change : $.proxy(function (index) {
                            if (this.opts.isAnimate) return;
                            this.opts.isAnimate = true;
                            this.tab.play(index);
                            this.itempanel.play(index);
                            this.timer.reset(this.tab.activeIndex);
                            this.timer.build(index, 5);
                            this.tab.activeIndex = index;
                        }, this),
                        show : $.proxy(function (index) {
                            if (this.tab.instance[index] == isUndefined) return;
                            this.tab.instance[index].show();
                        }, this),
                        hide : $.proxy(function (index) {
                            if (this.tab.instance[index] == isUndefined) return;
                            this.tab.instance[index].hide();
                        }, this),
                        play : $.proxy(function (index) {
                            if (this.tab.instance[index] == isUndefined) return;
                            if (this.tab.activeIndex != null) {
                                this.tab.hide(this.tab.activeIndex);
                            }
                            this.tab.show(index);
                        }, this),
                        prevClick : $.proxy(function (e) {
                            e.preventDefault();
                            this.tab.prev();
                        }, this),
                        prev : $.proxy(function () {
                            if (this.opts.isAnimate) return;
                            var targetIndex = this.tab.activeIndex;
                            targetIndex--;
                            if (targetIndex < 0) {
                                targetIndex = this.tab.instance.length - 1;
                            }
                            this.tab.play(targetIndex);
                            this.tab.change(targetIndex);
                        }, this),
                        nextClick : $.proxy(function (e) {
                            e.preventDefault();
                            this.tab.next();
                        }, this),
                        next : $.proxy(function (e) {
                            if (this.opts.isAnimate) return;
                            var targetIndex = this.tab.activeIndex;
                            targetIndex++;
                            if (targetIndex >= this.tab.instance.length) {
                                targetIndex = 0;
                            }
                            this.tab.play(targetIndex);
                            this.tab.change(targetIndex);
                        }, this),
                        bindEvents : $.proxy(function (type) {
                            if (type) {
                                this.carouselPrev.on(this.changeEvents('click'), $.proxy(this.tab.prevClick, this));
                                this.carouselNext.on(this.changeEvents('click'), $.proxy(this.tab.nextClick, this));
                            } else {
                                this.carouselPrev.off(this.changeEvents('click'));
                                this.carouselNext.off(this.changeEvents('click'));
                            }
                        }, this),
                        build : $.proxy(function () {
                            var build = $.proxy(function (obj, index) {
                                var instance = new Tab(obj, {
                                    on : {
                                        select : $.proxy(function () {
                                            if (this.tab.activeIndex == index) return;
                                            this.tab.change(index);
                                        }, this)
                                    }
                                });
                                this.tab.instance.push(instance);
                            }, this);
                            for (var i = 0, max = this.carouselPageBullet.length; i < max; i++) {
                                build(this.carouselPageBullet.eq(i), i);
                            }
                            this.tab.bindEvents(true);
                        }, this)
                    }
                });
                this.tab.build();
                this.tab.change(0);
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
                        buildCmvideo : $.proxy(function () {
                            if (this.picturevideo.instance == null) return;
                            var index = this.picturevideo.instance.targets.filter('.is-active').index();
                            this.cmvideo.build(index);
                        }, this),
                        pause : $.proxy(function () {
                            if (this.picturevideo.instance == null) return;
                            this.cmvideo.pauseAll();
                            this.picturevideo.instance.pause();
                        }, this),
                        play : $.proxy(function () {
                            if (this.picturevideo.instance == null) return;
                            this.picturevideo.instance.play();
                            this.picturevideo.buildCmvideo();
                        }, this),
                        build : $.proxy(function () {
                            if (this.picturevideo.instance == null && this.obj.length) {
                                this.picturevideo.instance = this.obj.data('PictureVideo');
                                var buildCmvideo = $.proxy(function () {
                                }, this);
                                this.picturevideo.instance.opts.on.complete = $.proxy(function () {
                                    this.picturevideo.buildCmvideo();
                                }, this);
                                this.picturevideo.buildCmvideo();
                            }
                        }, this)
                    }
                });
                this.picturevideo.build();
            },
            pause : function () {
                this.picturevideo.pause();
            },
            play : function () {
                this.picturevideo.play();
            }
        };
        function ItemPanel (container, args) {
            var defParams = {
                speed : 250,
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        ItemPanel.prototype = {
            init : function () {
                this.initLayout();
            },
            initLayout : function () {
                this.obj.hide();
            },
            show : function () {
                var duration = (this.opts.speed / 1000);
                TweenLite.fromTo(this.obj, duration, {
                    opacity : 0,
                    zIndex : 10,
                    display : ''
                }, {
                    opacity : 1,
                    onComplete : $.proxy(function () {
                        this.obj.css('position', 'relative');
                        this.outCallback('complete');
                    }, this)
                });
            },
            hide : function () {
                var duration = (this.opts.speed / 1000);
                TweenLite.fromTo(this.obj, duration, {
                    opacity : 1,
                    zIndex : '',
                    position: 'absolute'
                }, {
                    opacity : 0,
                    display : 'none'
                });
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        function Tab (container, args) {
            var defParams = {
                classAttr : {
                    active : 'swiper-pagination-bullet-active'
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    select : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Tab.prototype = {
            init : function () {
                this.bindEvents(true);
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
                this.obj.on(this.changeEvents('click'), $.proxy(this.objClickFunc, this));
            },
            objClickFunc : function (e) {
                e.preventDefault();
                this.outCallback('select');
            },
            show : function () {
                this.obj.addClass(this.opts.classAttr.active);
            },
            hide : function () {
                this.obj.removeClass(this.opts.classAttr.active);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        function Controller (container, args) {
            if (!(this instanceof Controller)) {
                return new Controller(container, args);
            }
            var defParams = {
                carouselController : null,
                controlBtn : '.btn-controls',
                isPlay : true,
                classAttr : {
                    play : 'is-play',
                    pause : 'is-pause'
                },
                customEvent : '.Controller' + (new Date()).getTime() + Math.random(),
                globalText : {},
                on : {
                    play : null,
                    pause : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Controller.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.bindEvents(true);
            },
            setElements : function () {
                this.carouselController = this.obj.find(this.opts.carouselController);
                this.controlBtn = this.carouselController.find(this.opts.controlBtn);
            },
            initLayout : function () {
                this.controlClass(this.opts.isPlay);
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
                    this.controlBtn.on(this.changeEvents('click'), $.proxy(this.controlClickFunc, this));
                } else {
                    this.controlBtn.off(this.changeEvents('click'));
                }
            },
            controlClickFunc : function (e) {
                e.preventDefault();
                this.opts.isPlay = !this.opts.isPlay;
                if (this.opts.isPlay) {
                    this.outCallback('play');
                } else {
                    this.outCallback('pause');
                }
                this.controlClass(this.opts.isPlay);
            },
            controlClass : function (type) {
                var globalText = this.opts.globalText,
                    classAttr = this.opts.classAttr;
                if (type) {
                    if (this.controlBtn.hasClass(classAttr.play)) return;
                    this.controlBtn.addClass(classAttr.play).removeClass(classAttr.pause);
                    this.controlBtn.find('.blind').text(globalText['Play']);
                } else {
                    if (this.controlBtn.hasClass(classAttr.pause)) return;
                    this.controlBtn.addClass(classAttr.pause).removeClass(classAttr.play);
                    this.controlBtn.find('.blind').text(globalText['Pause']);
                }
                this.opts.isPlay = type;
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        function Timer (container, args) {
            if (!(this instanceof Timer)) {
                return new Timer(container, args);
            }
            var defParams = {
                autoPlay : 6,
                progress : null,
                remainFill : null,
                data : {
                    num : 0
                },
                tweenObj : null,
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Timer.prototype = {
            init : function () {
                this.initOpts();
            },
            initOpts : function () {
                this.opts.autoPlay = this.opts.autoPlay * 1000;
                this.opts.remainFill = this.opts.autoPlay;
            },
            play : function () {
                var step = TweenLite.to(this.opts.data, (this.opts.remainFill / 1000), {
                    num : 100,
                    onUpdate : $.proxy(function () {
                        this.opts.progress = this.opts.data.num;
                    }, this),
                    onComplete : $.proxy(function () {
                        this.outCallback('complete');
                    }, this)
                });
                this.opts.tweenObj = step;
            },
            pause : function () {
                this.stop(this.opts.progress);
            },
            stop : function (num) {
                var ramainDuration = 100 - num,
                    ramainDurationPercent = ramainDuration / 100;
                if (this.opts.tweenObj !== null) {
                    this.opts.tweenObj.kill();
                }
                this.opts.data.num = num;
                this.opts.remainFill = this.opts.autoPlay * ramainDurationPercent;
                this.opts.progress = num;
            },
            progress : function (num) {
                if (num == isUndefined) {
                    num = 0;
                }
                if (num < 0) {
                    num = 0;
                } else if (num >= 1) {
                    num = 1;
                }
                this.stop(num * 100);
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
                obj : '.main-visual'
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
                    new win.g2.cpKeyVisualCarousel.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
