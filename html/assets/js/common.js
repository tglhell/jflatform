$(function () {
	const tabTar = $('.js-tab');
	const prxImg = $('.prx-item > img');
	const prxItem = $('.parallax-cont .prx-item > *');
	const prxItem2 = $('.parallax-cont.prx-val02 .prx-item');
	const prxItem3 = $('.parallax-cont.prx-val03 .prx-item');
	const irCont = $('.ir-count');

	tabTar.each(function () {
		tabAutoHgt ($(this));
	});

	$('.js-tab li').on('click', function (e) {
		const tabRoot = $(this).closest('.js-tab');
		const tabBoxItem = $('.js-tab-cont > div');
		let tabIdx = $(this).index();

		e.preventDefault();
		$(this).addClass('active').siblings().removeClass('active');
		tabRoot.find(tabBoxItem).removeClass('active').eq(tabIdx).addClass('active');

		let tabBoxItemHgt = tabRoot.find('.js-tab-cont .active').height() + tabPdtVal;
		tabRoot.find(tabBoxItem).parent().css({'height':tabBoxItemHgt});
	});

	irCont.each(function () {
		let irLeng = $(this).find('.ir-item').length;
		for (let i = 0; i <= irLeng; i++) {
			$(this).find('.ir-item').eq(i).css('transition-delay', '.' + i + 's');
			if (i > irCnt) {
				$(this).find('.ir-item').eq(i).css('transition-delay', sAd + '.' + i - (irCnt + sAd) + 's');
			}
		}
	});

	prxImg.ready(function () {
		prxItem.each(function () {
			if (!$(this).parent().hasClass('prx-type02')) {
				prxHgt ($(this));
			}
		});
	});

	$(window).scroll(function () {
		const chkBtnPos = $('.scr-fix-btn');
		let scrPos = $(this).scrollTop();
		prxItem.css({'transform':'translateY(' + scrPos / prxVal + 'px)'});
		prxItem2.css({'transform':'translateY(' + scrPos / prxVal2 + 'px)'});
		prxItem3.css({'transform':'translateY(-' + scrPos / prxVal + 'px)'});
		if (chkBtnPos.length >= 1) {
			let scrBtnPos = chkBtnPos.offset().top - $(window).height() + scrFixPos;
			if (!chkBool) {
				if (scrPos > scrBtnPos) {
					chkBtnPos.trigger('click');
					chkBool = true;
				}
			} else {
				if (scrPos == 0) {
					chkBool = false;
				}
			}
		}
	});

	$('.pop-open').on('click', (function () {
		let returnTar;
		return function (e) {
			const bodyWid = $('body').width();
			const hgtSize = $(window).height();
			const popIdx = $(this).attr('data-pop-idx');
			const popWrap = $('.layer-popup-wrap');
			const popCont = $('.layer-popup-cont');
			returnTar = $(e.target).closest('button');
			$('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').fadeIn(fadeVal).css('display', 'block');
			popCont.attr('tabindex', '0').fadeIn(fadeVal);
			$('body').css({'overflow':'hidden', 'width':bodyWid});
			setObj(function () {
				popCont.focus().append('<a href="#" class="tar-loop"></a>');
				$('.tar-loop').focusin(function () {
					popCont.focus();
				});
			}, 0);
			setObj(function () {
				popIdxHgt = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').find(popCont).height();
				if (hgtSize < popIdxHgt) {
					popCont.parent().css('height', 'auto');
					popWrap.stop().animate({scrollTop:0}, scrVal);
				}
			}, fadeVal);

			$('.btn-close-popup, .layer-popup-wrap').on('click', function (e) {
				const tarItem = $('.layer-popup-cont > div, .layer-title, .layer-cont *');
				if (!$(e.target).is(tarItem)) {
					if ($(this).scrollTop() !== 0) {
						if (hgtSize < popIdxHgt) {
							popWrap.stop().animate({scrollTop:0}, scrVal, function () {
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
					$('body').css({'overflow':'auto', 'width':'auto'});
					if ($('.swiper-container').length >= 1) {
						$('.swiper-wrapper').css('transform', 'translate3d(0, 0, 0)');
					}
				}, fadeVal);
			}
		}
	})());

	//checkbox all select 
	$(".check-group").on("click", ".all input", function () {
		$(this).parents(".check-group").find('input').prop("checked", $(this).is(":checked"));
	});

	//checkbox part select 
	$(".check-group").on("click", ".normal input", function() {
		var is_checked = true;

		$(".check-group .normal input").each(function(){
			is_checked = is_checked && $(this).is(":checked");
		});

		$(".all input").prop("checked", is_checked);
	});

	$(window).on('resize', function () {
		tabTar.each(function () {
			tabAutoHgt ($(this));
		});

		prxItem.ready(function () {
			prxItem.each(function () {
				prxHgt ($(this));
			});
		});
	});
	
	function checkAgent () {
		let UserAgent = navigator.platform;
		let agentBrowser = navigator.userAgent.toLowerCase();
		if (UserAgent.match(/i(Phone|Pod)/i) != null) {
			$('html').addClass('ios');
		} else {
			$('html').addClass('android');
		}
		if ((navigator.appName == 'Netscape' && agentBrowser.indexOf('trident') != -1) || (agentBrowser.indexOf("msie") != -1)) {
			$('html').addClass('ie11');
		}
	}
	checkAgent ();

	function prxHgt (target) {
		let prxHgt = parseInt(target.height() / 4);
		target.css('margin-top', -prxHgt);
	}

	function tabAutoHgt (target) {
		let tabCntHgt = target.find('.js-tab-cont .active').height();
		tabPdtVal = parseInt(target.find('.js-tab-cont').css('padding-top')) * 2;
		target.find('.js-tab-cont').css('height', tabCntHgt + tabPdtVal);
	}
});