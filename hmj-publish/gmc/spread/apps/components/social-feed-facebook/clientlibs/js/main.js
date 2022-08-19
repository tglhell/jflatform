(function (global, factory) {
    global = global;
    global.g2 = global.g2 || {};
    global.g2.socialFacebook = global.g2.socialFacebook || {};
    global.g2.socialFacebook.Component = factory();
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
                socialContent : '.social-feed__content',
                socialItem : '.social-feed__item',
                socialCta : '.social-feed__cta',
                viewLength : 0,
                customEvent : '.Component' + (new Date()).getTime() + Math.random()
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.bindCallbackEvents();
            },
            setElements : function () {
                this.socialContent = this.obj.find(this.opts.socialContent);
                this.socialItem = this.obj.find(this.opts.socialItem);
                this.socialCta = this.obj.find(this.opts.socialCta);
                this.socialBtn = this.socialCta.find('button');
            },
            initOpts : function () {
                this.opts.viewLength = this.socialItem.length;
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
                this.obj.on(this.changeEvents('socialRefreshBefore'), $.proxy(this.socialRefreshBefore, this));
                this.obj.on(this.changeEvents('socialRefreshAfter'), $.proxy(this.socialRefreshAfter, this));
            },
            socialRefreshBefore : function (e, data) {
                if (data.useFocus) {
                    this.socialCta.css('height', this.socialCta.outerHeight(true));
                    this.socialBtn.css('display', 'none');
                }
            },
            socialRefreshAfter : function (e, data) {
                this.socialItem = this.obj.find(this.opts.socialItem);
                var viewLength = this.socialItem.length;
                if (data.useFocus) {
                    Util.findFocus(this.socialItem.eq(this.opts.viewLength));
                    this.socialCta.css('height', '');
                    this.socialBtn.css('display', '');
                }
                this.reCommonBuild();
                this.opts.viewLength = viewLength;
            },
            reCommonBuild : function () {
                // button 갱신
                var jsBoCmBtns = this.obj.find('.cm-btn');
                for (var min = 0, max = jsBoCmBtns.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmBtn = jsBoCmBtns.eq(index);
                        if (jsBoCmBtn.attr('data-load') != 'true') {
                            jsBoCmBtn.attr('data-load', 'true');
                            new win.G2.Controller.CommonCta.Component(jsBoCmBtn);
                        }
                    })(min);
                }
                var jsBoCmBtnMores = this.obj.find('.cm-btn-more');
                for (var min = 0, max = jsBoCmBtnMores.length; min < max; min++) {
                    (function (index) {
                        var jsBoCmBtnMore = jsBoCmBtnMores.eq(index);
                        if (jsBoCmBtnMore.attr('data-load') != 'true') {
                            jsBoCmBtnMore.attr('data-load', 'true');
                            new win.G2.Controller.moreCta.Component(jsBoCmBtnMore);
                        }
                    })(min);
                }

                // svg 갱신
                var jsSvgIcons = this.obj.find('.js-svg-icon');
                for (var min = 0, max = jsSvgIcons.length; min < max; min++) {
                    (function (index) {
                        var jsSvgIcon = jsSvgIcons.eq(index);
                        if (jsSvgIcon.attr('data-load') != 'true') {
                            jsSvgIcon.attr('data-load', 'true');
                            new win.G2.Controller.inlineSvg.Component(jsSvgIcon);
                        }
                    })(min);
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
                obj : '.social-type-facebook'
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
                    new win.g2.socialFacebook.Component(this.obj.eq(i));
                }
            }
        };
        return new Component();
    })();
    return Component;

}));
