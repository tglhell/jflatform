(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.cpStepThumbnails = global.g2.cpStepThumbnails || {};
    global.g2.cpStepThumbnails.Component = factory();
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
                itemList : '.cp-step-thumbnails__item-list',
                itemChild : '.cp-step-thumbnails__item',
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.buildHeightMatch();
            },
            setElements : function () {
                this.itemList = this.obj.find(this.opts.itemList);
                this.itemChild = this.itemList.find(this.opts.itemChild);
            },
            buildHeightMatch : function () {
                Util.def(this, {
                    heightmatch : {
                        instance : [],
                        matchElements : ['.el-title'],
                        matchCommonOpts : {},
                        typeOpts : {
                            3 : {
                                column : 3,
                                breakpoints : {
                                    1023 : {
                                        column : 2
                                    }
                                }
                            },
                            2 : {
                                column : 2,
                                breakpoints : {
                                    767 : {
                                        column : 1
                                    }
                                }
                            },
                            1 : {
                                column : 1
                            }
                        },
                        initOpts : $.proxy(function () {
                            if (this.obj.hasClass('type-3column')) {
                                var customOpts = this.heightmatch.typeOpts[3];
                            } else if (this.obj.hasClass('type-2column')) {
                                var customOpts = this.heightmatch.typeOpts[2];
                            } else {
                                var customOpts = this.heightmatch.typeOpts[1];
                            }
                            this.heightmatch.matchCommonOpts = customOpts;
                        }, this),
                        initLayout : $.proxy(function () {
                            var _this = this;
                            for (var i = 0, max = this.heightmatch.matchElements.length; i < max; i++) {
                                (function (index) {
                                    var sTarget = _this.heightmatch.matchElements[index],
                                        sJsClass = 'js-' + sTarget.split('.')[1];
                                    for (var j = 0, jmax = _this.itemChild.length; j < jmax; j++) {
                                        var listTarget = _this.itemChild.eq(j),
                                            usedJsClass = listTarget.find('.' + sJsClass);
                                        if (!usedJsClass.length) {
                                            listTarget.find(sTarget).wrap('<div class="' + sJsClass + '"/>');
                                        }
                                    }
                                })(i);
                            }
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.heightmatch.comOpts == null) return;
                            for (var min = 0, max = this.heightmatch.comOpts.length; min < max; min++) {
                                var matchOpt = this.heightmatch.comOpts[min];
                                matchOpt.destroy();
                            }
                        }, this),
                        build : $.proxy(function () {
                            var _this = this;
                            this.heightmatch.initOpts();
                            this.heightmatch.initLayout();
                            for (var i = 0, max = this.heightmatch.matchElements.length; i < max; i++) {
                                (function (index) {
                                    var sTarget = _this.heightmatch.matchElements[index],
                                        personOpts = {
                                            pushElement : '.js-' + sTarget.split('.')[1],
                                            matchElement : sTarget
                                        };
                                    Util.def(_this.heightmatch.matchCommonOpts, personOpts);
                                    _this.heightmatch.instance.push(new HeightMatch(_this.itemList, _this.heightmatch.matchCommonOpts));
                                })(i);
                            }
                        }, this)
                    }
                });
                this.heightmatch.build();
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
                obj : '.cp-step-thumbnails'
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
                    new win.g2.cpStepThumbnails.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
