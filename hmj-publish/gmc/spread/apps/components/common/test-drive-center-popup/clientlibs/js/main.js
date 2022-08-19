(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpLayerDriveCenter = global.g2.cpLayerDriveCenter || {};
    global.g2.cpLayerDriveCenter.Component = factory();
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
                layerObj : container,
                jsPicture : '.js-picture',
                layerInstance : null,
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.layerObj = $(this.opts.layerObj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildLayer();
                this.buildContents();
                this.bindCallBackEvents();
            },
            setElements : function () {
                this.jsPicture = this.layerObj.find(this.opts.jsPicture);
            },
            buildLayer : function () {
                this.opts.layerInstance = new HiveLayer(this.layerObj);
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindCallBackEvents : function () {
                this.layerObj.on(this.changeEvents('layerOpenBefore'), $.proxy(this.openBeforeFunc, this));
                this.layerObj.on(this.changeEvents('layerCloseAfter'), $.proxy(this.closeAfterFunc, this));
            },
            openBeforeFunc : function () {
                this.layerObj.css({
                    'opacity' : 0,
                    'display' : 'block'
                });
                this.setElements();
                this.buildPictureImg();
                this.content.init();
            },
            closeAfterFunc : function () {
                this.content.destroy();
            },
            buildPictureImg : function () {
                var notLoaded = this.jsPicture.not('[data-load="true"]');
                for (var i = 0, max = notLoaded.length; i < max; i++) {
                    (function (index) {
                        new PictureImg(notLoaded.eq(index));
                    })(i);
                }
            },
            buildContents : function () {
                Util.def(this, {
                    content : {
                        instance : null,
                        init : $.proxy(function () {
                            if (this.content.instance == null) return;
                            this.content.instance.init();
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.content.instance == null) return;
                            this.content.instance.destroy();
                        }, this)
                    }
                });
                this.content.instance = new Content(this.layerObj);
            },
            reInit : function (e) {
                // Global Callback
            }
        };
        function Content (container, args) {
            var defParams = {
                selectWrap : '.testdrive-center-popup__select',
                accordionWrap : '.cm-accordion',
                globalText : {}
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
        };
        Content.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.buildAccordion();
                this.buildTab();
            },
            setElements : function () {
                this.selectWrap = this.obj.find(this.opts.selectWrap);
                this.accordionWrap = this.obj.find(this.opts.accordionWrap);
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
            buildAccordion : function () {
                Util.def(this, {
                    accordion : {
                        instance : [],
                        destroy : $.proxy(function () {
                            if (!this.accordion.instance.length) return;
                            for (var min = 0, max = this.accordion.instance.length; min < max; min++) {
                                this.accordion.instance[min].destroy();
                            }
                        }, this)
                    }
                });
                for (var min = 0, max = this.accordionWrap.length; min < max; min++) {
                    this.accordionWrap.eq(min).data('global-text', this.opts.globalText);
                    this.accordion.instance.push(new HiveAccordion(this.accordionWrap.eq(min)));
                }
            },
            buildTab : function () {
                Util.def(this, {
                    tab : {
                        instance : [],
                        destroy : $.proxy(function () {
                            if (!this.tab.instance.length) return;
                            for (var min = 0, max = this.tab.instance.length; min < max; min++) {
                                this.tab.instance[min].destroy();
                            }
                        }, this)
                    }
                });
                for (var min = 0, max = this.selectWrap.length; min < max; min++) {
                    this.tab.instance.push(new Tab(this.selectWrap.eq(min)));
                }
            },
            destroy : function () {
                this.accordion.destroy();
                this.tab.destroy();
            }
        };
        function Tab (container, args) {
            var defParams = {
                selectList : '.testdrive-center-popup__select-list',
                selectBtn : '.testdrive-center-popup__select-list-inner > a',
                props : {},
                classAttr : {
                    selected : 'is-selected'
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            this.obj = $(container);
            this.init();
        };
        Tab.prototype = {
            init : function () {
                this.setElements();
                this.buildData();
                this.bindEvents(true);
            },
            setElements : function () {
                this.selectList = this.obj.find(this.opts.selectList);
            },
            buildData : function () {
                for (var smin = 0, smax = this.selectList.length; smin < smax; smin++) {
                    var selectList = this.selectList.eq(smin),
                        stepTabLink = selectList.find(this.opts.selectBtn);
                    this.opts.props[smin] = {
                        'LI' : selectList,
                        'TAB' : stepTabLink
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
                    this.selectList.on(this.changeEvents('click'), this.opts.selectBtn, $.proxy(this.tabClick, this));
                } else {
                    this.selectList.off(this.changeEvents('click'), this.opts.selectBtn);
                }
            },
            tabClick : function (e) {
                e.preventDefault();
                var _dTarget = $(e.delegateTarget),
                    _targetIndex = this.selectList.index(_dTarget);
                this.activePanel(_targetIndex);
            },
            activePanel : function (index) {
                var props = this.opts.props,
                    classAttr = this.opts.classAttr;
                var allClose = $.proxy(function (index) {
                    for (var key in props) {
                        if (key != index) {
                            props[key]['LI'].removeClass(classAttr.selected);
                        }
                    }
                }, this);
                allClose(index);
                props[index]['LI'].addClass(classAttr.selected);
            },
            destroy : function () {
                this.bindEvents(false);
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
                obj : '#testdrive-center-layer'
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
                    new win.g2.cpLayerDriveCenter.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
