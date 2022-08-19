(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.testDriveCoursePopup = global.g2.testDriveCoursePopup || {};
    global.g2.testDriveCoursePopup.Component = factory();
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
                contents : '.cm-layer__content',
                tabList : '.test-course-popup__tab-list',
                tabListItem : '.test-course-popup__tab-item',
                tabListLink : '>a',
                tabContent : '.test-course-popup__tab-content',
                currentIndex : 0,
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
                this.buildData();
                this.bindEvents();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.contents = this.obj.find(this.opts.contents);
                this.tabList = this.obj.find(this.opts.tabList);
                this.tabListItem = this.tabList.find(this.opts.tabListItem);
                this.tabListLink = this.tabListItem.find(this.opts.tabListLink);
                this.tabContent = this.obj.find(this.opts.tabContent);
            },
            buildData : function () {
                Util.def(this, {
                    items : {
                        instance : [],
                        allHide : $.proxy(function () {
                            for (var i = 0, max = this.items.instance.length; i < max; i++) {
                                var instance = this.items.instance[i];
                                if (instance.opts.isActive) {
                                    instance.kill();
                                }
                            }
                        }, this),
                        play : $.proxy(function (num) {
                            this.items.allHide();
                            this.items.instance[num].play();
                        }, this),
                        build : $.proxy(function () {
                            for (var i = 0, max = this.tabListLink.length; i < max; i++) {
                                var tabLink = this.tabListLink.eq(i),
                                    tabContentID = tabLink.attr('href');
                                this.items.instance.push(new Item(this.tabContent.filter(tabContentID)));
                            }
                        }, this)
                    }
                });
                this.items.build();
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
                this.tabListLink.on(this.changeEvents('click'), $.proxy(this.tabListClick, this));
            },
            bindCallbackEvents : function () {
                this.obj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.obj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
            },
            openBeforeFunc : function () {
                var classAttr = this.opts.classAttr;
                this.tabListItem.eq(this.opts.currentIndex).addClass(classAttr.active).siblings().removeClass(classAttr.active);
                this.items.play(this.opts.currentIndex);
            },
            closeAfterFunc : function () {
                this.items.allHide();
            },
            tabListClick : function (e) {
                e.preventDefault();
                var target = $(e.currentTarget),
                    index = this.tabListLink.index(target),
                    classAttr = this.opts.classAttr;
                target.closest(this.opts.tabListItem).addClass(classAttr.active).siblings().removeClass(classAttr.active);
                this.items.play(index);
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Item (container, args) {
            var defParams = {
                isActive : false,
                videoContainer : '.video-container',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            if (!this.obj.length) return;
            this.init();
        };
        Item.prototype = {
            init : function () {
                this.setElements();
                this.initLayout();
                this.buildCmVideo();
            },
            setElements : function () {
                this.videoContainer = this.obj.find(this.opts.videoContainer);
            },
            initLayout : function () {
                this.obj.hide();
            },
            buildCmVideo : function () {
                Util.def(this, {
                    cmvideo : {
                        instance : [],
                        play : $.proxy(function () {
                            for (var i = 0, max = this.cmvideo.instance.length; i < max; i++) {
                                this.cmvideo.instance[i].play();
                            }
                        }, this),
                        pause : $.proxy(function () {
                            for (var i = 0, max = this.cmvideo.instance.length; i < max; i++) {
                                this.cmvideo.instance[i].pause();
                            }
                        }, this),
                        build : $.proxy(function () {
                            var _this = this;
                            if (!this.cmvideo.instance.length) {
                                for (var i = 0, max = this.videoContainer.length; i < max; i++) {
                                    (function (index) {
                                        var videoContainer = _this.videoContainer.eq(index);
                                        _this.cmvideo.instance[index] = new HiveVideo(videoContainer);
                                        _this.cmvideo.instance[index].play();
                                    })(i);
                                }
                            } else {
                                this.cmvideo.play();
                            }
                        }, this)
                    }
                });
            },
            play : function () {
                this.opts.isActive = true;
                this.obj.css('display', '');
                this.cmvideo.build();
            },
            kill : function () {
                this.opts.isActive = false;
                this.obj.hide();
                this.cmvideo.pause();
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
                obj : '.test-course-popup'
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
                    new win.g2.testDriveCoursePopup.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
