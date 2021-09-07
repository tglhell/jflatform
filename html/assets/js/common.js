jQuery.event.add(window, 'load', function () {
	const tabTar = $('.js-tab');
	const prxImg = $('.prx-item > img');
	const prxItem = $('.parallax-cont .prx-item > *');
	const prxItem2 = $('.parallax-cont.prx-val2 .prx-item');
	const prxItem3 = $('.parallax-cont.prx-val3 .prx-item');
	const gnbMenuBox = $('.gnb-menu-box');
	const irCont = $('.ir-count');
	const inpItem = $('.inp-item');
	const headerOuter = $('.hmj-header');

	$('.btn-depth-switch, .btn-depth-prev').on('click', function (e) {
		if ($(this).hasClass('btn-depth-switch')) {
			$(this).addClass('active', function () {
				let menuDepthHgt = $(this).next().outerHeight();
				$(this).next().css('height', menuDepthHgt);
			});
		} else {
			$(this).closest('li').find('.btn-depth-switch').removeClass('active');
		}
	});

	$('.btn-menu').on('click', function () {
		const bodyWid = $('body').width();
		scrYPos = $(window).scrollTop();
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$('body').css({'overflow':'hidden', 'width':bodyWid, 'position':'fixed', 'top':-scrYPos});
			gnbInnerHgt();
			gnbMenuBox.parent().fadeIn(secVal[3], function () {
				gnbMenuBox.css('right', '0');
			});
			setObj(function () {
				gnbMenuBox.parent().addClass('active').find('.btn-menu-close').stop().animate({'right':'20px'}, secVal[3]);
			}, secVal[3]);
		}

		gnbMenuBox.parent().on('click', function (e) {
			const tarItem = $('.hmj-wrap:not(.hmj-header), .gnb-menu-outer *:not(.btn-menu-close)');
			if (!$(e.target).is(tarItem)) {
				gnbMenuBox.css('right', '-250px');
				gnbMenuBox.parent().find('.btn-menu-close').stop().animate({'right':'-100px'}, secVal[2]);
				setObj(function () {
					gnbMenuBox.parent().removeClass('active').fadeOut(secVal[2]);
					$('.btn-depth-switch').removeClass('active');
					$('body').removeAttr('style');
					$(window).scrollTop(scrYPos);
				}, secVal[3]);
				$('.btn-menu').removeClass('active');
			}
		});
	});

	$('.btn-side-menu').on('click', function () {
		$(this).toggleClass('active');
		$('.side-menu-wrap').toggleClass('active');

		$('.side-menu-wrap.active').on('click', '.btn-menu-close', function () {
			$('.btn-side-menu').removeClass('active');
			$('.side-menu-wrap').removeClass('active');
		});
	});

	$('.js-tab .tab-box-list > li, .js-tab .tab-box-list2 > li').on('click', function (e) {
		const tabRoot = $(this).closest('.js-tab');
		const tabBoxItem = $('.js-tab-cont > div');
		let tabIdx = $(this).index();

		e.preventDefault();
		$(this).addClass('active').siblings().removeClass('active');
		tabRoot.find(tabBoxItem).removeClass('active').eq(tabIdx).addClass('active');

		tabScrCenter($(this));
	});

	irCont.each(function () {
		let irLeng = $(this).find('> .ir-item').length;
		for (let i = 0; i <= irLeng; i++) {
			$(this).find('> .ir-item').eq(i).css('transition-delay', '.' + i + 's');
			if (i > irNum[8]) {
				$(this).find('> .ir-item').eq(i).css('transition-delay', i / twoDig[0] + 's');
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

	$(window).on('scroll resize orientationchange', function (e) {
		const chkBtnPos = $('.scr-fix-btn');
		const headerFixHgt = headerOuter.find('.header-cont').outerHeight(true) + irNum[0];
		let topVal = parseInt($('body').css('top')) * -1;
		scrPos = $(this).scrollTop();
		if (e.type == 'scroll') {
			if ($('.parallax-cont').length >= irNum[0]) {
				prxItem.css({'transform':'translateY(' + scrPos / irNum[3] + 'px)'});
				prxItem2.css({'transform':'translateY(' + scrPos / irNum[3] + 'px)'});
				prxItem3.css({'transform':'translateY(-' + scrPos / irNum[3] + 'px)'});
			}
			if (chkBtnPos.length >= irNum[0]) {
				let scrBtnPos = chkBtnPos.offset().top - $(window).height() + secVal[1];
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
			if (!$('.gnb-menu-outer').hasClass('active')) {
				if (scrPos > 0 || topVal > 0) {
					$('.btn-top-box').fadeIn(secVal[2]);
				} else {
					$('.btn-top-box').fadeOut(secVal[2]);
				}
				if ($('.sub-cont').length !== 0) {
					if (scrPos > lastScrTopPos) {
						headerOuter.addClass('header-fixed');
						headerOuter.css('top', -headerFixHgt);
						if (scrPos < headerFixHgt) {
							headerOuter.attr('style', 'top: 0 !important;');
						}
					} else {
						headerOuter.removeClass('header-fixed');
						headerOuter.css('top', 0);
					}
				} else {
					if (scrPos > lastScrTopPos) {
						headerOuter.addClass('scr-chk');
					} else {
						headerOuter.removeClass('scr-chk');
					}
				}
			}
			lastScrTopPos = scrPos;
			rnbContFix();
		} else if (e.type == 'orientationchange') {
			if (window.orientation == 0) {
				//portrait
			} else {
				//landscape
			}
		} else {
			prxItem.ready(function () {
				prxItem.each(function () {
					prxHgt($(this));
				});
			});
			if (chkSwitch) {
				popAutoHgt();
			}
			if ($(window).width() < tbl) {
				setObj(function () {
					$('.js-tab.x-scroll').each(function () {
						$(this).find('.active a').trigger('click');
					});
				}, secVal[4])
			}
			if ($('.tbl-box.row-fix').length !== 0) {
				tblFixRow();
			}
			if ($('.tbl-box.col-fix').length !== 0) {
				tblFixCol();
			}
			if (gnbMenuBox.parent().hasClass('active')) {
				gnbInnerHgt();
			}
			containerAutoHgt();
			resChk();
			// contAutoPadding();
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

	$('.tooltip-box').on('mouseenter mouseleave click', '.btn-tooltip', function (e) {
		if (!$(this).hasClass('type-hover')) {
			if (e.type == 'click') {
				if (!$(this).hasClass('active') && !$(this).hasClass('type-hover') && !$('.btn-tooltip.active').length == 1) {
					$('.tooltip-cont').removeAttr('style');
				}
				tooltip($(this));
			}
		} else {
			if (!$(this).parent().is(':animated')) {
				if ($(window).width() > tbl) {
					if (e.type == 'mouseenter') {
						tooltip($(this));
					} else if (e.type == 'mouseleave') {
						$(this).parent().animate({ 'overflow': 'visible' }, secVal[1]);
						$('.btn-tooltip').removeClass('active');
						setObj(function () {
							tooltipCont.removeAttr('style');
						}, secVal[1]);
					}
				} else {
					if (e.type == 'click') {
						if (!$(this).hasClass('active')) {
							$('.tooltip-cont').removeAttr('style');
						}
						tooltip($(this));
					}
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
			const popCont = $('.layer-popup-cont');
			e.preventDefault();
			popWrap = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']');
			returnTar = $(e.target).closest('.pop-open');
			chkSwitch = true;
			popWrap.fadeIn(secVal[4], function () {
				popAutoHgt();
			});
			popCont.attr('tabindex', '0').fadeIn(secVal[4]);
			if (!popWrap.hasClass('full')) {
				$('body').css({'overflow':'hidden', 'width':bodyWid});
			}
			setObj(function () {
				popWrap.find(popCont).focus().append('<a href="#" class="tar-loop"></a>');
				$('.tar-loop').focusin(function () {
					popCont.focus();
				});
			}, 0);
			setObj(function () {
				popIdxHgt = popWrap.find(popCont).outerHeight(true);
				if (hgtSize < popIdxHgt && popBottomHgt == 0) {
					popCont.parent().css('height', 'auto');
					popWrap.stop().animate({scrollTop:0}, secVal[2]);
				}
			}, secVal[5]);

			$('.layer-popup-wrap').on('click', function (e) {
				const _this = $(this).closest('.layer-popup-wrap');
				const tarItem = $('.layer-popup-cont > div, .layer-title,'
				 + '.layer-cont *:not(.btn-close *), .bottom-fixed *');
				if (!$(e.target).is(tarItem)) {
					if ($(this).scrollTop() !== 0) {
						if (hgtSize < popIdxHgt) {
							popWrap.stop().animate({scrollTop:0}, secVal[2], function () {
								popClose (_this);
							});
						}
					} else {
						popClose (_this);
					}
				}
			});

			function popClose (target) {
				target.fadeOut(secVal[4]);
				target.find(popCont).removeAttr('tabindex').fadeOut(secVal[4]).parent().removeAttr('style');
				target.find('.tar-loop').remove();
				chkSwitch = false;
				setObj(function () {
					returnTar.focus();
				}, 0);
				setObj(function () {
					if (!target.hasClass('inner-pop')) {
						$('body').css({'overflow':'auto', 'width':'auto'});
					}
					if ($('.swiper-container').length >= irNum[0]) {
						$('.swiper-wrapper').css('transform', 'translate3d(0, 0, 0)');
					}
					popCont.parent().css('height', '100%');
				}, secVal[4]);
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

	$('.layer-cont').on('touchstart', function (e) {
		lastY = e.touches[0].clientY;
	});

	$('.layer-cont').on('touchmove', function (e) {
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

	$('.btn-top-box').on('click', '.btn-top', function (e) {
		e.preventDefault();
		$('html, body').animate({scrollTop:'0'}, '0');
		$(this).blur();
		chkBool = true;
	});

	function subContChk () {
		if (headerOuter.find('.sub-cont').length !== 0) {
			headerOuter.removeClass('none-sub');
		} else {
			headerOuter.addClass('none-sub');
		}
	}
	subContChk();

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

	function contAutoPadding () {
		let headerHgt = $('.hmj-header').outerHeight(true);

		$('.cont-outer').css('padding-top', headerHgt);
	}
	// contAutoPadding();

	function prxHgt (target) {
		let prxHgt = parseInt(target.height() / irNum[3]);
		target.css('margin-top', -prxHgt);
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
		popBottomHgt = parseInt(popWrap.find('.bottom-fixed').outerHeight(true)) || 0;
		//하단 고정일경우 .mo-full은 필수
		if($(window).height() < popWrap.find('.layer-popup-cont').height() + 80 && popBottomHgt !== 0) { // PC에서 내용이 window보다 크고 하단고정일때
			popWrap.addClass('fix-center');
		}
		if (popBottomHgt !== 0) { // 하단고정일때
			popWrap.find('.layer-cont').css('height', popWrap.find('.layer-popup-cont').height() - (popHeaderHgt + popBottomHgt));
			popWrap.find('.layer-cont').css('padding-bottom', '0');
		} else {
			popWrap.find('.layer-cont').css('height', popWrap.find('.layer-popup-cont').height() - popHeaderHgt); //모든 팝업 기본 높이계산
		}
	}

	function tabScrCenter (target) {
		const tabScrBox = target.closest('.js-tab.x-scroll').find('.tab-box-outer');
		const tabScrBoxItem = tabScrBox.find('li');
		let tabScrBoxHarf = tabScrBox.width() / irNum[1];
		let tabScrPos;
		let tabListWidth = 0;
		let tabTarLeft = 0;
		let tabPdValue = parseInt(tabScrBoxItem.parent().css('padding-left'));
		tabScrBoxItem.each(function () {
			tabListWidth += $(this).outerWidth();
		});
		for (let i = 0; i < target.index(); i++) tabTarLeft += tabScrBoxItem.eq(i).outerWidth();
		let tabTarPos = (tabTarLeft + target.outerWidth() / irNum[1] + tabPdValue);
		if (tabTarPos <= tabScrBoxHarf) {
			tabScrPos = 0;
		} else if (tabListWidth - tabTarPos <= tabScrBoxHarf) {
			tabScrPos = tabListWidth - tabScrBox.width() + (tabPdValue * irNum[1]);
		} else {
			tabScrPos = tabTarPos - tabScrBoxHarf;
		}
		tabScrBox.stop().animate({scrollLeft:tabScrPos}, secVal[2]);
	}

	function tooltip(target) {
		const btnTooltipWid = target.outerWidth();
		tooltipCont = target.closest('.tooltip-box').find('.tooltip-cont');
		if ($(window).width() > tbl) {
			tooltipPadding = twoDig[0];
		} else {
			tooltipPadding = twoDig[1];
		}
		if ($(window).width() >= secVal[4]) {
			tooltipCont.css('margin-left', -(tooltipCont.outerWidth() / irNum[1] - btnTooltipWid / irNum[1]));
		} else {
			tooltipCont.css('width', $(window).width() - (tooltipPadding * irNum[1]));
		}
		if (!target.hasClass('active')) {
			$('.btn-tooltip').removeClass('active');
			target.addClass('active');
			const tooltipPos = tooltipCont.offset().left;
			const tooltipBoxWid = tooltipPos + tooltipCont.outerWidth();
			const tooltipSum = tooltipBoxWid - $(window).width();
			if (tooltipPos < 0) {
				tooltipCont.css({'left':-tooltipPos + tooltipPadding});
			}
			if (tooltipBoxWid > $(window).width()) {
				tooltipCont.css({'left':-(tooltipSum + tooltipPadding)});
			}
		} else {
			target.removeClass('active');
			setObj(function () {
				tooltipCont.removeAttr('style');
			}, secVal[1]);
		}
		if (!$('html').hasClass('ios')) {
			const tarItem = $('.tooltip-box, .tooltip-box *');
			$(document).on('click', function (e) {
				if (!$(e.target).is(tarItem)) {
					$('.btn-tooltip').removeClass('active');
					setObj(function () {
						tooltipCont.removeAttr('style');
					}, secVal[1]);
				}
			});
		} else {
			$(document).on('touchstart', function (e) {
				const tarItem = $('.tooltip-box, .tooltip-box *');
				if (!$(e.target).is(tarItem)) {
					$('.btn-tooltip').removeClass('active');
				}
			});
		}
	}

	function rnbContFix () {
		if ($('.cont-right').length !== 0) {
			const rnbCont = $('.cont-right');
			const cautionCont = rnbCont.find('.caution');
			const rnbPos = rnbCont.offset().top;
			const centerContHgt = $('.cont-center').outerHeight();
			const rnbContHgt = rnbCont.find('.inside-type').outerHeight();
			let cautionContHgt = rnbCont.find('.caution').outerHeight() || 0;
			let centerPos = $('.cont-center').offset().top + (centerContHgt - (rnbContHgt + cautionContHgt));
			let scrPos = $(this).scrollTop();
			if (scrPos > rnbPos) {
				rnbCont.addClass('scroll-fix');
				cautionCont.css('top', rnbContHgt + twoDig[1]);
				if (scrPos > centerPos) {
					if (cautionCont.length == 0) {
						rnbCont.removeClass('scroll-fix').addClass('scroll-end').find('.inside-type').css('top', centerPos - cautionContHgt);
						cautionCont.css('top', centerPos + rnbContHgt);
					} else {
						rnbCont.removeClass('scroll-fix').addClass('scroll-end').find('.inside-type').css('top', centerPos - twoDig[1]);
						cautionCont.css('top', (centerPos - twoDig[1]) + rnbContHgt);
					}
				} else {
					rnbCont.addClass('scroll-fix').removeClass('scroll-end').find('.inside-type').removeAttr('style');
				}
			} else {
				rnbCont.removeClass('scroll-fix');
				cautionCont.removeAttr('style');
			}
		}
	}
	rnbContFix();

	function tblFixRow () {
		if ($(window).width() <= tbl) {
			$('.tbl-box.row-fix').on('scroll', function () {
				const tblBox = $('.tbl-box.row-fix');
				const fixRow = $('.tbl-box.row-fix tr th:nth-child(1)');
				let fixLeft = tblBox.offset().left;
				if ($(this).scrollLeft() > 0) {
					fixRow.offset({'left':fixLeft});
					fixRow.css({'z-index':'999'});
				} else {
					fixRow.css({'left':'0', 'z-index':'-1'});
				}
			});
		}
	}
	if ($('.tbl-box.row-fix').length !== 0) {
		tblFixRow();
	}

	function tblFixCol () {
		if ($(window).width() <= tbl) {
			$('.tbl-box.col-fix').on('scroll', function () {
				const tblBox = $('.tbl-box.col-fix');
				const fixCol = $('.tbl-box.col-fix thead tr th');
				let fixTop = tblBox.offset().top;
				if ($(this).scrollTop() > 0) {
					fixCol.offset({'top':fixTop});
					fixCol.css({'z-index':'999'});
				} else {
					fixCol.css({'top':'0', 'z-index':'-1'});
				}
			});
		}
	}
	if ($('.tbl-box.col-fix').length !== 0) {
		tblFixCol();
	}

	function gnbInnerHgt () {
		const innerDepthTar = $('.menu-inner-depth .ir-count');
		innerDepthTar.css('height', $(window).height() - 180);
	}

	//moToggle 
	function moToggle(){
		$('.mo-toggle').off()
		$('.mo-toggle .cont').slideUp(0);
		$('.mo-toggle .active .cont').slideDown(0);
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

	// iframe map auto height
	function mapAutoHeight() {
		if($(document).width() > tbl) {
			var bodyH = $(document).height();
			var topH = $('.hmj-header').height()
			$('.intro-map').css('height', bodyH - topH);
		}
	};
	mapAutoHeight();
});

$(function () {
	//toggle common
	function toggle(){
		$('.toggle').on('click', '.tit-btn' ,function(){
			var toggleItem = $(this).parent('.item');
			if(toggleItem.hasClass('active')) {
				toggleItem.removeClass('active');
			} else {
				toggleItem.addClass('active');
				if ($(this).parent().find('svg').hasClass('progress') == true) {
					$('.ie11 .progress').css('transform', 'rotate(-90deg)');
				};
			}
		});
	};
	toggle();
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
			$(this).parent().siblings('.selected-value').text(selectItem);
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

	$('.inp-textarea').on('focusin focusout keyup', 'textarea', function (e) {
		if (e.type == 'focusin') {
			$(this).parent().addClass('focus');
		} else if (e.type == "focusout") {
			$(this).parent().removeClass('focus');
		} else {
			if ($(this).val() == 0) {
				$(this).parent().removeClass('active');
			} else {
				$(this).parent().addClass('active');
			}
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