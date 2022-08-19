(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpLayerVerification = global.g2.cpLayerVerification || {};
    global.g2.cpLayerVerification.Component = factory();
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
                popList : '.verification-popup__list',
                layerInstance : null,
                heightMatchInstance : null,
                heightMatchOpts : {
                    matchElements : ['.info-desc'],
                    matchCommonOpts : {
                        column : 2,
                        breakpoints : {
                            767 : {
                                column : 1
                            }
                        }
                    }
                },
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
                this.bindCallBackEvents();
            },
            setElements : function () {
                this.popList = this.layerObj.find(this.opts.popList);
                this.popChild = this.popList.children();
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
                this.opts.heightMatchInstance = this.buildHeightMatch(this.opts.heightMatchOpts);
            },
            closeAfterFunc : function () {
                this.destroyHeightMatch(this.opts.heightMatchInstance);
            },
            initHeightMatch : function (matchOpts) {
                var _this = this;
                for (var i = 0, max = matchOpts.matchElements.length; i < max; i++) {
                    (function (index) {
                        var sTarget = matchOpts.matchElements[index],
                            sJsClass = 'js-' + sTarget.split('.')[1];
                        for (var j = 0, jmax = _this.popChild.length; j < jmax; j++) {
                            var listTarget = _this.popChild.eq(j),
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
                        matchObjs.push(new HeightMatch(_this.popList, matchOpts.matchCommonOpts));
                    })(i);
                }
                return matchObjs;
            },
            destroyHeightMatch : function (matchOpts) {
                if (matchOpts == null) return;
                for (var min = 0, max = matchOpts.length; min < max; min++) {
                    var matchOpt = matchOpts[min];
                    matchOpt.destroy();
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
                obj : '#verification-layer'
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
                    new win.g2.cpLayerVerification.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
