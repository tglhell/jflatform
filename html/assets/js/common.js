$(function (){
	var tabTar = $('.js-tab');
	var prxImg = $('.parallax-img img');

	tabTar.each(function () {
		tabAutoHgt ($(this));
	});

	$('body').on('click', '.js-tab li', function (e) {
		var tabRoot = $(this).closest('.js-tab');
		var tabIdx = $(this).index();
		var tabBoxItem = $('.js-tab-cont > div');

		e.preventDefault();
		$(this).addClass('active').siblings().removeClass('active');
		tabRoot.find(tabBoxItem).removeClass('active').eq(tabIdx).addClass('active');

		var tabBoxItemHgt = tabRoot.find('.js-tab-cont .active').height() + tabPdtVal;
		tabRoot.find(tabBoxItem).parent().css({'height':tabBoxItemHgt});
	});

	$('.ir-count').each(function(){
		var irLeng = $(this).find('.ir-animate').length;
		for (var i = 0; i <= irLeng; i++) {
			$(this).find('.ir-animate').eq(i).css('transition-delay', '.' + (i + 1) + 's');
		}
	});
	
	prxImg.ready(function(){
		prxImg.each(function(){
			prxHgt ($(this));
		});
	});

	$(window).scroll(function(){
		var scrPos = $(this).scrollTop();
		prxImg.css({'transform':'translateY(' + scrPos / prxVal + 'px)'});
	});

	$('body').on('click', '.pop-open', (function () {
		var returnTar;
		return function (e) {
			var bodyWid = $('body').width();
			var wSize = $(window).width();
			var hSize = $(window).height();
			var popIdx = $(this).attr('data-pop-idx');
			var popWrap = $('.layer-popup-wrap');
			var popCont = $('.layer-popup-cont');
			returnTar = $(e.target).closest('button');
			$('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').fadeIn(fadeVal).css('display', 'block');
			popCont.attr('tabindex', '0').fadeIn(fadeVal);
			if (wSize > tbl) {
				$('body').css({'overflow':'hidden', 'width':bodyWid});
			}
			setObj(function () {
				popCont.focus().append('<a href="#" class="tar-loop"></a>');
				$('.tar-loop').focusin(function () {
					popCont.focus();
				});
			}, 0);
			setObj(function(){
				popIdxHgt = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').find(popCont).height();
				if (hSize < popIdxHgt) {
					popCont.parent().css('height', 'auto');
					popWrap.stop().animate({scrollTop:0}, scrVal);
				}
			}, fadeVal);

			$('body').on('click', '.btn-close-popup, .layer-popup-wrap', function (e) {
				var tarItem = $('.layer-popup-cont > div, .layer-title, .layer-cont *');
				if (!$(e.target).is(tarItem)) {
					if ($(this).scrollTop() !== 0) {
						if (hSize < popIdxHgt) {
							popWrap.stop().animate({scrollTop:0}, scrVal, function(){
								popClose ();
							});
						}
					} else {
						popClose ();
					}
				}
			});

			function popClose () {
				popWrap.fadeOut(fadeVal);
				popCont.removeAttr('tabindex').fadeOut(fadeVal).parent().removeAttr('style');
				$('.tar-loop').remove();
				setObj(function () {
					returnTar.focus();
				}, 0);
				setObj(function () {
					if (wSize > tbl) {
						$('body').css({'overflow':'auto', 'width':'auto'});
					}
				}, fadeVal);
			}
		}
	})());

	$(window).on('resize', function () {
		tabTar.each(function () {
			tabAutoHgt ($(this));
		});

		prxImg.ready(function(){
			prxImg.each(function(){
				prxHgt ($(this));
			});
		});
	});

	function prxHgt (target) {
		var prxHgt = parseInt(target.height() / 2);
		target.css('margin-top', -prxHgt);
	}

	function tabAutoHgt (target) {
		var tabCntHgt = target.find('.js-tab-cont .active').height();
		tabPdtVal = parseInt(target.find('.js-tab-cont').css('padding-top')) * 2;
		target.find('.js-tab-cont').css('height', tabCntHgt + tabPdtVal);
	}
});