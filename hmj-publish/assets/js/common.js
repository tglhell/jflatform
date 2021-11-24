jQuery.event.add(window, 'load', function () {
	const tabTar = $('.js-tab');
	const gnbMenuBox = $('.gnb-menu-box');
	const irCont = $('.ir-count');
	const inpItem = $('.inp-item');
	const headerOuter = $('.hmj-header');
	const innerCont = $('.drop-down-outer .inner-cont');
	const innerContLineHgt = $('.drop-down-outer .inner-cont').css('line-height');
	const boxHgt = innerCont.css('height', 'auto').height();
	const sideBox = $('.side-menu-wrap');
	const sideBoxHgt = sideBox.css('width', '217px').height();
	
	// initializing style value
	if (!innerCont.parent().hasClass('active')) {
		innerCont.css('height', innerContLineHgt);
	} else {
		innerCont.css('height', boxHgt);
	}
	sideBox.css({'width':'0', 'height':'0'});
	
	$('.inp-outer-box.inp-type').on('focusin', 'input', function () {
		const inpTypeParent = $(this).closest('.inp-outer-box.inp-type');
		let btnTblWid = inpTypeParent.find('.btn-tbl').outerWidth() + (twoDig[2] + irNum[5]);
		if (!inpTypeParent.hasClass('post-type')) {
			inpTypeParent.find('.inp-item').css('padding-right', btnTblWid);
			inpTypeParent.find('.inp-close').css('right', btnTblWid - (twoDig[1] + irNum[5]));
		} else {
			inpTypeParent.find('.inp-btn-box .inp-item').css('padding-right', btnTblWid);
			inpTypeParent.find('.inp-btn-box .inp-close').css('right', btnTblWid - (twoDig[1] + irNum[5]));
		}
		if (inpTypeParent.find('.time-num').length == 1) {
			inpTypeParent.find('.inp-item').css('padding-right', btnTblWid + twoDig[4]);
			inpTypeParent.find('.inp-close').css('right', btnTblWid - (twoDig[1] + irNum[5]) + twoDig[4]);
		}
	});

	$('.btn-depth-switch:not(.toggle-menu), .btn-depth-prev').off();
	$('.btn-depth-switch:not(.toggle-menu), .btn-depth-prev').on('click', function (e) {
		if ($(this).hasClass('btn-depth-switch')) {
			$(this).addClass('active', function () {
				$('.gnb-menu-list > li').find('> button, > a').stop().animate({'opacity':'0'}, secVal[4]);
				$('.hmj-header .gnb-menu-list').css('overflow-y', 'hidden');
				if ($(window).width() <= tbl) {
					$('.account-box').eq(0).fadeOut(secVal[2]);
				}
			});
		} else {
			$('.gnb-menu-list > li').find('> button, > a').stop().animate({'opacity':'1'}, secVal[4]);
			$('.toggle-menu').removeClass('active').next().slideUp(secVal[2]);
			$(this).closest('li').find('.btn-depth-switch').removeClass('active');
			$('.hmj-header .gnb-menu-list').css('overflow-y', 'auto');
			if ($(window).width() <= tbl) {
				$('.account-box').fadeIn(secVal[2]);
			}
		}
	});

	$('.toggle-menu').off();
	$('.toggle-menu').on('click', function () {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).next().slideDown(secVal[2]);
		} else {
			$(this).next().slideUp(secVal[2]);
		}
	});

	$('.btn-menu').on('click', function () {
		const bodyWid = $('body').width();
		scrYPos = $(window).scrollTop();
		$(this).toggleClass('active');
		if ($('html').hasClass('ios')) {
			$('body').css('position', 'fixed');
		} else {
			$('body').css('overflow', 'hidden');
		}
		if ($(this).hasClass('active')) {
			$('.hmj-header.scr-chk').css('backdrop-filter', 'unset');
			gnbMenuBox.parent().fadeIn(secVal[3], function () {
				gnbMenuBox.css('right', '0');
			});
			setObj(function () {
				if ($(window).width() > tbl) {
					gnbMenuBox.parent().addClass('active').find('.btn-menu-close').stop().animate({'right':'22px'}, secVal[3]);
				} else {
					gnbMenuBox.parent().addClass('active').find('.btn-menu-close').stop().animate({'right':'11px'}, secVal[3]);
				}
			}, secVal[3]);
		}

		gnbMenuBox.parent().on('click', function (e) {
			const tarItem = $('.hmj-wrap:not(.hmj-header), .gnb-menu-outer *:not(.btn-menu-close)');
			if (!$(e.target).is(tarItem)) {
				if ($('html').hasClass('ios')) {
					$('body').css('position', 'static');
				} else {
					$('body').css('overflow', 'visible');
				}
				gnbMenuBox.css('right', '-640px');
				gnbMenuBox.parent().find('.btn-menu-close').stop().animate({'right':'-100px'}, secVal[2]);
				setObj(function () {
					gnbMenuBox.parent().removeClass('active').fadeOut(secVal[2]);
					$('.btn-depth-switch').removeClass('active');
					$(window).scrollTop(scrYPos);
					$('.hmj-header.scr-chk').css('backdrop-filter', 'blur(80px)');
				}, secVal[3]);
				$('.btn-menu').removeClass('active');
				$('.toggle-menu').removeClass('active').next().slideUp(secVal[2]);
				$('.gnb-menu-list > li').find('> button, > a').stop().animate({'opacity':'1'}, 500);
			}
		});
	});

	$('.btn-side-menu').on('click', function () {
		$(this).toggleClass('active');
		sideBox.toggleClass('active');

		if (sideBox.hasClass('active')) {
			sideBox.css({'width':'217px', 'height':sideBoxHgt});
		} else {
			sideBox.css({'width':'0', 'height':'0'});
		}

		$('.side-menu-wrap.active').on('click', '.btn-menu-close', function () {
			$('.btn-side-menu').removeClass('active');
			$('.side-menu-wrap').removeClass('active');
		});
	});

	$('.js-tab .tab-box-list > li').on('click', function (e) {
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

	$(window).on('scroll resize orientationchange', function (e) {
		const chkBtnPos = $('.scr-fix-btn');
		const headerFixHgt = headerOuter.find('.header-cont').outerHeight(true) + irNum[0];
		let topVal = parseInt($('body').css('top')) * -1;
		scrPos = $(this).scrollTop();
		if (e.type == 'scroll') {
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
				// if (scrPos > 0 || topVal > 0) {
				// 	$('.btn-top-box').fadeIn(secVal[2]);
				// } else {
				// 	$('.btn-top-box').fadeOut(secVal[2]);
				// }
				if ($('html').hasClass('ie11')) {
					$('.hmj-wrap').on('mousewheel DOMMouseScroll', function (e) {
						if ($('.sub-cont').length !== 0) {
							if (e.originalEvent.wheelDelta < 0) {
								headerOuter.addClass('header-fixed');
								headerOuter.css('top', -headerFixHgt);
								if ($(window).width() <= tbl && $('.sub-cont').is('display', 'none')) {
									headerOuter.addClass('scr-chk');
								}
							} else {
								headerOuter.removeClass('header-fixed');
								headerOuter.css('top', 0);
								if ($(window).width() <= tbl && $('.sub-cont').is('display', 'none')) {
									headerOuter.removeClass('scr-chk').removeAttr('style');
								}
							}
						} else {
							if (e.originalEvent.wheelDelta < 0) {
								headerOuter.addClass('scr-chk');
							} else {
								headerOuter.removeClass('scr-chk').removeAttr('style');
							}
						}
					});
				} else {
					if ($('.sub-cont').length !== 0) {
						if (scrPos > lastScrTopPos) {
							if (!$('.hmj-wrap').hasClass('type2') || $(window).width() > tbl) {
								headerOuter.addClass('header-fixed');
								if ($(window).width() <= tbl && $('.sub-cont').css('display') === 'none') {
									headerOuter.addClass('scr-chk');
								} else {
									headerOuter.css('top', -headerFixHgt);
								}
								if ($('.hmj-wrap').hasClass('tabFixed') && $('.tab-box-list').hasClass('fixed')) { // 탭고정
									$(".tab-box-list").addClass("down");
									$(".tab-box-list").removeClass("up");
								}
							}
							if (scrPos < headerFixHgt) {
								headerOuter.attr('style', 'top: 0 !important;');
							}
						} else {
							headerOuter.removeClass('header-fixed');
							headerOuter.css('top', 0);
							if ($('.hmj-wrap').hasClass('tabFixed') && $('.tab-box-list').hasClass('fixed')) { // 탭고정
								$(".tab-box-list").addClass("up");
								$(".tab-box-list").removeClass("down");
							}
						}
					} else {
						if (scrPos > lastScrTopPos) {
							headerOuter.addClass('scr-chk');
						} else {
							headerOuter.removeClass('scr-chk').removeAttr('style');
						}
					}
				}
			}
			lastScrTopPos = scrPos;
			if (!$('.side-menu-wrap').length == 0) {
				mainBtnTop();
			}
		} else if (e.type == 'orientationchange') {
			if (window.orientation == 0) {
				$(window).trigger('resize');
			} else {
				$(window).trigger('resize');
			}
		} else {
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
			containerAutoHgt();
			resChk();
			contAutoPadding();
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
							$('.tooltip-cont').removeAttr('style');
							$('.tooltip-cont').removeClass('t-fix');
						}, secVal[1]);
					}
				} else {
					if (e.type == 'click') {
						if (!$(this).hasClass('active')) {
							setObj(function () {
								$('.tooltip-cont').removeAttr('style');
								$('.tooltip-cont').removeClass('t-fix');
							}, secVal[1]);
						}
						tooltip($(this));
					}
				}
			}
		}
	});

	$('.pop-open').on('click', function (e) {
		e.preventDefault();
		popupOpen($(this));
	});

	//checkbox all select 
	$(".check-terms").on("click", ".all input", function () {
		$(this).parents(".check-terms").find('input').prop("checked", $(this).is(":checked"));
	});

	//checkbox part select 
	$(".check-terms").on("click", ".normal input", function() {
		var is_checked = true;

		$(".check-terms .normal input").each(function(){
			is_checked = is_checked && $(this).is(":checked");
		});

		$(".all input").prop("checked", is_checked);
	});

	$('.layer-cont, .menu-inner-depth > ul').on('touchstart', function (e) {
		lastY = e.touches[0].clientY;
	});

	$('.layer-cont, .menu-inner-depth > ul').on('touchmove', function (e) {
		let top = e.touches[0].clientY;
		let scrollTop = $(e.currentTarget).scrollTop();
		let direction = (lastY - top) < 0 ? 'up' : 'down';
		
		if (scrollTop <= 0 && direction == 'up') {
			e.preventDefault();
		} else if (scrollTop >= (e.currentTarget.scrollHeight - $(window).outerHeight() + secVal[0]) && direction == 'down') {
			e.preventDefault();
		}
		lastY = top;
	});

	$('.btn-top-box').on('click', '.btn-top', function (e) {
		e.preventDefault();
		if (!$('.lineup-wrap').length == 0) {
			lineWrapPos = $('.lineup-wrap').offset().top;
		}
		if (!$(this).hasClass('main')) {
			$('html, body').animate({scrollTop:'0'}, '0');
			$(this).blur();
			chkBool = true;
		} else {
			$('html, body').stop().animate({scrollTop:lineWrapPos}, secVal[4], 'easeInOutQuint');
		}
	});

	$('.btn-drop-down').on('click', function () {
		if (!$(this).parent().hasClass('active')) {
			$(this).parent().addClass('active');
			innerCont.css('height', boxHgt);
		} else {
			$(this).parent().removeClass('active');
			innerCont.css('height', innerContLineHgt);
		}
	});

	$('.header-cont .btn-search').on('click', function () {
		const searchTar = $('.gnb-search-dim');
		if (!searchTar.hasClass('active')) {
			searchTar.show();
			setObj(function () {
				searchTar.addClass('active');
				searchTar.find('.inp-item').focus();
			}, irNum[0]);
		} else {
			searchClose();
		}

		$('.btn-search-close, .gnb-search-dim').on('click', function (e) {
			const tarItem = $('.search-outer-box, .search-outer-box *:not(.btn-search-close)');
			if (!$(e.target).is(tarItem)) {
				searchClose();
			}
		});

		function searchClose () {
			searchTar.removeClass('active');
			setObj(function () {
				searchTar.find('.inp-item').val(null);
				searchTar.find('*').removeClass('active');
				$('.btn-search').focus();
				searchTar.hide();
			}, secVal[6]);
		}
	});

	$('.search-outer-box').on('keyup', '.inp-item', function () {
		let inpVal = $(this).val();
		const searchParent = $(this).closest('.search-outer-box');
		if (!inpVal.length == 0) {
			searchParent.find('.keyword-box').addClass('active');
		} else {
			searchParent.find('.keyword-box').removeClass('active');
		}

		searchParent.find('.inp-close').on('click', function () {
			searchParent.find('.keyword-box').removeClass('active');
		});
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
			$('.footer-top .mo-toggle').find('.cont').show();
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
		$('.cont-outer').removeAttr('style');
		let headerHgt = $('.hmj-header').outerHeight(true);
		const contTopPd = parseInt($('.cont-outer').eq(0).css('padding-top'));
		
		if (!$('.cont-outer').prev().hasClass('top-visual') || $(window).width() <= tbl) {
			if (!$('.hmj-container').hasClass('m-complete')) {
				$('.cont-outer').css('padding-top', '0').eq(0).css('padding-top', (contTopPd + headerHgt));
			} else {
				$('.cont-outer').eq(0).css('margin-top', headerHgt);
			}
		} else {
			$('.cont-outer').eq(0).prev().css('margin-top', headerHgt);
		}
		if (!$('.top-visual').length == 0) {
			if ($(window).width() <= tbl && !$('.top-visual').hasClass('mo-none') && !$('.top-visual').hasClass('pc-only')) {
				$('.top-visual').css('margin-top', headerHgt);
				$('.cont-outer').eq(0).removeAttr('style');
			}
		}
		if ($('.cont-outer').prev().hasClass('top-tit-box')) {
			if ($(window).width() > tbl) {
				$('.cont-outer').css('padding-top', '0');
				$('.top-tit-box').css('margin-top', headerHgt);
			} else {
				$('.top-tit-box').css('margin-top', 0);
				$('.cont-outer').eq(0).css('padding-top', (contTopPd + headerHgt)).siblings().css('padding-top', '0');
			}
		}
	}
	contAutoPadding();

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

	function tabScrCenter (target) {
		const tabScrBox = target.closest('.js-tab.x-scroll').find('.tab-box-list');
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

	function tooltip (target) {
		const btnTooltipWid = target.outerWidth();
		tooltipCont = target.closest('.tooltip-box').find('.tooltip-cont');
		tooltipContWid = target.closest('.tooltip-box').find('.tooltip-cont').width();
		if (tooltipContWid > secVal[4]) {
			tooltipCont.addClass('t-fix');
		} else {
			setObj(function () {
				tooltipCont.removeClass('t-fix');
			}, secVal[1]);
		}
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
				tooltipCont.removeClass('t-fix');
			}, secVal[1]);
		}
		
		// if (!$('html').hasClass('ios')) {
		// 	const tarItem = $('.tooltip-box, .tooltip-box *');
		// 	$(document).on('click', function (e) {
		// 		if (!$(e.target).is(tarItem)) {
		// 			$('.btn-tooltip').removeClass('active');
		// 			setObj(function () {
		// 				tooltipCont.removeAttr('style');
		// 				tooltipCont.removeClass('t-fix');
		// 			}, secVal[1]);
		// 		}
		// 	});
		// } else {
		// 	$(document).on('touchstart', function (e) {
		// 		const tarItem = $('.tooltip-box, .tooltip-box *');
		// 		if (!$(e.target).is(tarItem)) {
		// 			$('.btn-tooltip').removeClass('active');
		// 			setObj(function () {
		// 				tooltipCont.removeAttr('style');
		// 				tooltipCont.removeClass('t-fix');
		// 			}, secVal[1]);
		// 		}
		// 	});
		// }
		tooltipCont.find('.close').on('click', function(){
			$('.btn-tooltip').removeClass('active');
			setObj(function () {
				tooltipCont.removeAttr('style');
				tooltipCont.removeClass('t-fix');
			}, secVal[1]);
		})
	}

	if (!$('.js-is-sticky').length == 0) {
		$('.js-is-sticky').stickybits();
	}

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

	// function gnbInnerHgt () {
	// 	const innerDepthTar = $('.menu-inner-depth .ir-count');
	// 	innerDepthTar.css('height', $(window).height() - 180);
	// }

	function mainBtnTop () {
		let lineWrapPos = $('.lineup-wrap').offset().top;
		let scrPos = $(this).scrollTop();
		if (scrPos < lineWrapPos) {
			$('.btn-top').addClass('main');
		} else {
			$('.btn-top').removeClass('main');
		}
	}
	if (!$('.side-menu-wrap').length == 0) {
		mainBtnTop();
	}

	//moToggle 
	function moToggle(){
		$('.mo-toggle').off()
		$('.mo-toggle .cont').slideUp(0);
		$('.mo-toggle .active .cont').slideDown(0);
		$('.mo-toggle').on('click', '.tit-btn, .mo-btn' ,function(){
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
			var bodyH = $(window).height();
			var topH = $('.hmj-header').height()
			$("[class*='intro-map']").css('height', bodyH - topH);
		}
	};
	mapAutoHeight();

	function mapSearchControl() {
		var trigger = $('.search-toggle');
		var topFloat = trigger.next('.search');
		var stationInfo = trigger.parents('.intro-map').find('.station-info');
		var closeItem = $('.intro-map > *:not(.top-float), .map > div * ');

		trigger.on('click', function() {
			if(!$(this).hasClass('on')) {
				$(this).addClass('on');
				topFloat.fadeIn(100);
				if(stationInfo.hasClass('on')) {
					stationInfo.removeClass('on').fadeOut(100)
				}
			} else {
				$(this).removeClass('on');
				topFloat.fadeOut(100);
			};
		});

		closeItem.on('click', function() {
			trigger.removeClass('on');
			topFloat.fadeOut(100);
		});		
	}
	mapSearchControl();

	function otherCheck() {
		let checkBox = $('.check-terms input');
	
		checkBox.on('click',function(){
			let otherCheckBox =  $(this).closest('li').hasClass('other');
			
			if(otherCheckBox) {
				$('.other-textarea').slideDown(200);
			} else {
				$('.other-textarea').slideUp(200);
			}
		})
	}
	otherCheck();
});

function iconTab(){
	var iconTabW = $('.icon-tab-list').find('li').outerWidth() / 2; 
	var iconTabC = $(window).width() / 2 - iconTabW;
	var iconTabP = $('.icon-tab-list').find('li.active').offset().left;

	$('.icon-tab-outer').scrollLeft(iconTabP - iconTabC);
}

function stationOn() {
	if(!$('.station-info').hasClass('on')) {
		$('.station-info').addClass('on').fadeIn(100);
	}
}
function stationOff() {
	$('.station-info').removeClass('on').fadeOut(100);
}

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

function customSelect () {
	//default selectbox
	$('div.slt-box:not(.shop-option)').on('click', '.selected-value', function (e) {
		if($(this).parent().hasClass('active')) {
			$(this).parent().removeClass('active');
		} else {
			$('div.slt-box').removeClass('active');
			$(this).parent().addClass('active');
		};
		$(this).parent().removeClass('on');

		//select option text
		$('.select-items').on('click', 'li', function () {
			//default selectbox
			var selectItem = $(this).text()
			$(this).addClass('selected').siblings('li').removeClass('selected');
			$(this).parent().siblings('.selected-value').text(selectItem);
			$(this).parents('div.slt-box').removeClass('active').addClass('on');
		});
	});

	//shop-option selectbox
	$('div.shop-option').on('click', '.selected-value', function (e) {
		if($(this).parent().hasClass('active')) {
			$(this).parent().removeClass('active');
			$('.mo-bottom-fixed > .scroll-area').css('height', 'auto');
		} else {
			$('div.slt-box').removeClass('active');
			$(this).parent().addClass('active');			
			floatAutoHeight();
		};

		//select option text
		$('.select-items').on('click', 'li', function () {
			$(this).parents('div.slt-box').removeClass('active');
		});
	});
	
	//outside click
	$('.hmj-wrap').on('click', function (e) {
		if(!$('div.slt-box').has(e.target).length) {
			$('div.slt-box').removeClass('active');
		}
	});
	
	//status desabled 
	if($('div.slt-box.disabled')) {
		$('div.slt-box.disabled').off();
	};

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

	//filebox
	var fileTarget = $('.filebox .upload-hidden');		
	fileTarget.on('change', function(){ 
		var filename = $(this)[0].files[0].name; 
		$(this).parent('.filebox').find('.upload-name').val(filename);
		$(this).parent().find('.inp-close').show();
	});
};

function popupOpen (target) {
	const bodyWid = $('body').width();
	const hgtSize = $(window).height();
	const popIdx = target.attr('data-pop-idx');
	popCont = $('.layer-popup-cont');
	popWrap = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']');
	chkSwitch = true;
	popWrap.fadeIn(secVal[4], function () {
		popAutoHgt();
	});
	popCont.fadeIn(secVal[4]);
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
		// const tarItem = $('.layer-popup-cont > div, .layer-title,'
		//  + '.layer-cont *:not(.btn-close, .btn-del), .bottom-fixed *:not(.btn-close)');
		const tarItem = $('.layer-popup-body, .btn-close');
		if ($(e.target).is(tarItem)) {
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
}

function popClose (target) {
	target.fadeOut(secVal[4]);
	target.find(popCont).fadeOut(secVal[4]).parent().removeAttr('style');
	target.find('.tar-loop').remove();
	chkSwitch = false;
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

//shop float auto height
function floatAutoHeight() {
	//mo && mo-bottom-fixed
	if($(document).width() < tbl && $('.mo-bottom-fixed').length > 0) {
		var bodyH = $(window).height() * 0.85;
		var bottomH = $('.bottom-fixed').height();
		if($('.mo-bottom-fixed .shop-option').hasClass('active')) {
			$('.mo-bottom-fixed > .scroll-area').css('height', bodyH - bottomH);
		} else {
			$('.mo-bottom-fixed > .scroll-area').css('max-height', bodyH - bottomH);
		}
	}
};

// $('.float-open').on('click', function() {
// 	if($('.mo-bottom-fixed').length > 0) {
// 		$('.mo-bottom-fixed').addClass('on');
// 		floatAutoHeight();
// 		$('body').css('overflow', 'hidden')
// 	}
// })

// $('.mo-bottom-fixed .shop-option').on('click', function() {
// 	if($(this).hasClass('active')) {
// 		floatAutoHeight();
// 	} else {
// 		$('.mo-bottom-fixed > .scroll-area').css('height', 'auto');
// 	}
// })

function floatOpen() {
	if ($(window).width() <= tbl) {
		$('.mo-bottom-fixed').addClass('on');
		floatAutoHeight();
		$('body').css('overflow', 'hidden')
		if($('body >.dim').length === 0) {
			$('.hmj-wrap').before('<div class="dim"></div>');
		}
	}
}

function floatClose(){
	$('body').css('overflow', 'auto');
	$('.mo-bottom-fixed').removeClass('on');
	$('body > .dim').remove();
};

function cartDimOn() {
	$('.dim-add-cart').fadeIn(100);
}
function cartDimOff(target) {
	$(target).fadeOut(100);
}

function cateCenter() {
	const target = $('.cate-list li.active');
	const tabScrBox = target.closest('.sub-cate').find('.tab-box-outer');
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
		tabScrPos = 0
	} else if (tabListWidth - tabTarPos <= tabScrBoxHarf) {
		tabScrPos = tabListWidth - tabScrBox.width() + (tabPdValue * irNum[1]);
	} else {
		tabScrPos = tabTarPos - tabScrBoxHarf;
	}
	tabScrBox.stop().animate({scrollLeft:tabScrPos}, secVal[2]);
};
// 탭고정
function tabFixed(){
	$.fn.Scrolling = function(obj, tar) {
		var _this = this;

		$(window).on('scroll resize orientationchange', function (e) {
			if ($(window).width() <= tbl) {
				var end = obj + tar;
				$(window).scrollTop() >= obj ? _this.addClass("fixed") : _this.removeClass("fixed");
				if($(window).scrollTop() >= end) _this.removeClass("fixed");
			} else {
				$(".tab-box-list").removeClass("fixed")
			}
		});
	};
	$(".tab-box-list").Scrolling($(".tab-box-list").offset().top, ($(".tab-box-item").height()));

	$('.tab-box-list li').click(function(){
		var offset = $('.tab-box-cont').offset();
		$('html').animate({scrollTop : offset.top - 160}, 400);
	});
}
//쿠기활용동의 팝업
function cookiePop() {
	let cookiePopWrap = $('.cookie-pop-wrap');

	if ($('body').find(cookiePopWrap).length == 1) {
		$('body').css('overflow', 'hidden');
	} else {
		$('body').css('overflow', 'auto');
	}		

	cookiePopWrap.find('.btn-close').on('click',function(){
		cookiePopWrap.fadeOut(secVal[4]);
		$('body').css('overflow', 'auto');
	})
}