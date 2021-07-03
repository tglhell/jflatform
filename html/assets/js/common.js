jQuery.event.add(window, 'load', function () {
	const tabTar = $('.js-tab');
	const prxImg = $('.prx-item > img');
	const prxItem = $('.parallax-cont .prx-item > *');
	const prxItem2 = $('.parallax-cont.prx-val2 .prx-item');
	const prxItem3 = $('.parallax-cont.prx-val3 .prx-item');
	const irCont = $('.ir-count');
	const inpItem = $('.inp-item');
	let lastY = 0;

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
			if (!$(this).parent().hasClass('prx-type2')) {
				prxHgt ($(this));
			}
		});
	});

	$(window).scroll(function () {
		const chkBtnPos = $('.scr-fix-btn');
		let scrPos = $(this).scrollTop();
		if ($('.parallax-cont').length >= 1) {
			prxItem.css({'transform':'translateY(' + scrPos / prxVal + 'px)'});
			prxItem2.css({'transform':'translateY(' + scrPos / prxVal + 'px)'});
			prxItem3.css({'transform':'translateY(-' + scrPos / prxVal + 'px)'});
		}
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

	inpItem.on('keyup', function () {
		let inpItemVal = $(this).val();
		if (inpItemVal == 0) {
			$(this).parent().removeClass('active');
		} else {
			$(this).parent().addClass('active');
		}
	});

	$('.inp-close').on('click', function (e) {
		let returnTar = $(e.target).prev();
		$(this).closest('.inp-area').removeClass('active').find(inpItem).val(null);
		returnTar.focus();
	});

	$('.pop-open').on('click', (function () {
		let returnTar;
		return function (e) {
			const bodyWid = $('body').width();
			const hgtSize = $(window).height();
			const popIdx = $(this).attr('data-pop-idx');
			const popCont = $('.layer-popup-cont');
			popWrap = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']');
			returnTar = $(e.target).closest('button');
			$('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').fadeIn(fadeVal).css('display', 'block');
			popCont.attr('tabindex', '0').fadeIn(fadeVal);
			if (!$('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').hasClass('full')) {
				$('body').css({'overflow':'hidden', 'width':bodyWid});
			}
			setObj(function () {
				popWrap.find(popCont).focus().append('<a href="#" class="tar-loop"></a>');
				$('.tar-loop').focusin(function () {
					popCont.focus();
				});
			}, 0);
			setObj(function () {
				popIdxHgt = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']').find(popCont).outerHeight(true);
				popAutoHgt();
				if (hgtSize < popIdxHgt) {
					popCont.parent().css('height', 'auto');
					popWrap.stop().animate({scrollTop:0}, scrVal);
				}
			}, fadeVal);


			$('.btn-close, .layer-popup-wrap').on('click', function (e) {
				const _this = $(this).closest('.layer-popup-wrap');
				const tarItem = $('.layer-popup-cont > div, .layer-title, .layer-cont *:not(.btn-close *)');
				if (!$(e.target).is(tarItem)) {
					if ($(this).scrollTop() !== 0) {
						if (hgtSize < popIdxHgt) {
							popWrap.stop().animate({scrollTop:0}, scrVal, function () {
								popClose (_this);
							});
						}
					} else {
						popClose (_this);
					}
				}
			});

			function popClose (target) {
				target.fadeOut(fadeVal);
				target.find(popCont).removeAttr('tabindex').fadeOut(fadeVal).parent().removeAttr('style');
				target.find('.tar-loop').remove();
				setObj(function () {
					returnTar.focus();
				}, 0);
				setObj(function () {
					if (!target.hasClass('inner-pop')) {
						$('body').css({'overflow':'auto', 'width':'auto'});
					}
					if ($('.swiper-container').length >= 1) {
						$('.swiper-wrapper').css('transform', 'translate3d(0, 0, 0)');
					}
					popCont.parent().css('height', '100%');
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

	$('.layer-cont').on('touchstart', function(e) {
		lastY = e.touches[0].clientY;
	});

	$('.layer-cont').on('touchmove', function(e) {
		let top = e.touches[0].clientY;
		let scrollTop = $(e.currentTarget).scrollTop();
		let direction = (lastY - top) < 0 ? 'up' : 'down';
		
		if (scrollTop <= 0 && direction == 'up') {
			e.preventDefault();
		} else if (scrollTop >= (e.currentTarget.scrollHeight - $(window).outerHeight()) && direction == 'down') {
			e.preventDefault();
		}
		lastY = top;
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
		
		if ($('.layer-popup-wrap').length >= 1) {
			popAutoHgt();
		}

		containerAutoHgt();
		resChk();
	});

	function resChk () {
		if ($(window).width() > tbl) {
			//pc
			$('html').removeClass('mo').addClass('pc');
			$('.mo-toggle').off()
		} else {
			//mo
			$('html').removeClass('pc').addClass('mo');
			moToggle();
		}
	}
	resChk();
	
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

	function containerAutoHgt () {
		let hmjHeaderHgt= $('.hmj-header').outerHeight(true);
		let hmjFooterHgt= $('.hmj-footer').outerHeight(true);
		let containerHgtSum = $(window).height() - (hmjHeaderHgt + hmjFooterHgt);
		$('.hmj-container').css('min-height', containerHgtSum);
		if ($(window).width() <= tbl) {
			if ($('.hmj-wrap').hasClass('type2')) {
				$('.hmj-container').css('min-height', containerHgtSum + hmjFooterHgt);
			}
		}
	}
	containerAutoHgt();

	function popAutoHgt () {
		let popHeaderHgt = parseInt(popWrap.find('.layer-title').outerHeight(true));
		let popBottomHgt = parseInt(popWrap.find('.bottom-fixed').outerHeight(true)) || 0;
		if (popWrap.hasClass('mo-full') && $(window).width() <= tbl) {
			popWrap.find('.layer-cont').css('height', $(window).height() - (popHeaderHgt + popBottomHgt));
		} else {
			if (popBottomHgt == 0) {
				popWrap.find('.layer-cont').css('height', '100%');
			} else {
				popWrap.find('.layer-cont').css('height', $('.layer-popup-body').height() - (popHeaderHgt + popBottomHgt));
			}
		}
		// console.log(popHeaderHgt)
		// console.log(popBottomHgt)
		// console.log($('.layer-popup-body').height() - (popHeaderHgt + popBottomHgt) + 80)
	}

	//toggle common
	function toggle(){
		$('.toggle').off()
		$('.toggle .cont').slideUp(0);
		$('.toggle').on('click', '.tit-btn' ,function(){
			var toggleItem = $(this).parent('.item');
			if(toggleItem.hasClass('active')) {
				toggleItem.removeClass('active');
				toggleItem.find('.cont').slideUp(300);
			} else {
				toggleItem.addClass('active');
				toggleItem.find('.cont').slideDown(300);
			}
		});
	};
	toggle();

	//moToggle 
	function moToggle(){
		$('.mo-toggle').off()
		// $('.mo-toggle .cont').slideUp(0);
		$('.mo-toggle').on('click', '.tit-btn' ,function(){
			var toggleItem = $(this).parent('.item');
			if(toggleItem.hasClass('active')) {
				toggleItem.removeClass('active');
				toggleItem.find('.cont').slideUp(300);
			} else {
				toggleItem.addClass('active');
				toggleItem.find('.cont').slideDown(300);
			}
		});
	};

	// accordion common
	function accordion(){
		$('.accordion').off()
		$('.accordion').on('click', '.tit-btn', function() {
			var accordionItem = $(this).parent('.item');
			accordionItem.toggleClass('active').siblings('.item').removeClass('active');
			$('.accordion .item').find('.cont').slideUp(0);
			if(accordionItem.hasClass('active')) {
				accordionItem.find('.cont').slideDown(300);
			} else {
				accordionItem.find('.cont').slideUp(300);
			}
		})
	};
	accordion();

	function customSelect() {
		$('div.slt-box').on('click', '.selected-value', function(e) {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).next('.select-items').hide();
			} else {
				$(this).addClass('active');
				$(this).next('.select-items').show();
			};

			//select option text 
			$('.select-items').on('click', 'li', function() {
				var selectItem = $(this).text();
				$(this).addClass('selected').siblings('li').removeClass('selected');
				$(this).parent().hide();								
				$(e.target).text(selectItem);
				$(e.target).removeClass('active');
			})
		});

		//status desabled 
		if($('div.slt-box.disabled')) {
			$('div.slt-box.disabled').off();
		};

		//outside click
		$('.wrap').click(function(e) {
			if(!$('div.slt-box').has(e.target).length) {
				$('.selected-value').removeClass('active');
				$('.select-items').hide();
			}
		})
	};
	customSelect();
});

function selectDropdown(data){
	$('.select-dropdown .tit-btn').each(function(index, item){
		var name = $(item).attr('data-name');
		if(name == data){
			$('.select-dropdown .item').removeClass('active');
			$(item).parent('.item').addClass('active');
			// var itemTop = $(item).offset().top;
			// $('html,body').animate({scrollTop:itemTop}, 500);
		}
	});
};

// $('.layer-popup-wrap.fix-center').ready(function() {
// 	var i = [
// 		wrap = $('.layer-popup-cont'),
// 		headerH = wrap.find('.layer-title').outerHeight(true),
// 		topH = wrap.find('.top-area').outerHeight(true),
// 		bottomH = wrap.find('.bottom-area').outerHeight(true)
// 	]
// 	var scrollH = wrap.height() - (headerH + topH + bottomH + 40);
// 	wrap.find('.scroll-area').css('height', scrollH);
// })