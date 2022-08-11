/* s : submit_design_write */
function designReview () {
	maxItemLeng = 10; // 체크박스 체크된 최대 갯수
	swtParent = $('.js-switch-outer');
	$('.js-switch, .switch-placeholder').on('click', function () {
		$(this).closest(swtParent).toggleClass('active');
		chkLeng ($(this));
	});
	$('.switch-btm-box .chk').on('click', 'input', function () {
		const thisTxt = $(this).parent().find('span').text();
		const tagTxt = $(this).parents('.add-tag').find('.switch-item-list .txt');
		$(this).parent().toggleClass('on');
		chkLeng ($(this));
		if ($(this).parent().hasClass('on')) {
			let chkItemIdx = [$(this).closest('.check-box').index(), $(this).parent().index()];
			let chkSwtTxt = [$(this).closest('.check-box').find('>label').text(), $(this).parent().find('span').text()];
			strCateTxt = '<strong><span>' + chkItemIdx[0] + '</span>'+ chkSwtTxt[0] + '</strong>';
			hypTxt = ' - ';
			if (swtParent.find('.switch-cont').hasClass('add-tag')) {
				strCateTxt = '';
				hypTxt = '';
			}
			$(this).closest(swtParent).find('ul').prepend('<li data-label="' + chkSwtTxt[1] + '">'
			+ strCateTxt + hypTxt + '<span>' + chkItemIdx[1] + '</span>' + chkSwtTxt[1] + '<button class="btn-item-del"></button></li>');
			let swtItems = $(this).closest(swtParent).find('ul').children('li').get();
			swtItems.sort(function (a, b) {
				let swtLi = [$(a).find('span').text(), $(b).find('span').text()];
				return swtLi[0] - swtLi[1];
			});
			$.each(swtItems, function (index, obj) {
				$(this).closest(swtParent).find('ul').append(obj);
			});
			tagTxt.hide();
			$('.btn-item-del').on('click', function () {
				const dataChkTxt = $(this).parent().attr('data-label');
				const chkCnt = $(this).closest('.switch-cont');
				const tarInp = chkCnt.find('.chk input');
				$(this).parent().remove();
				chkCnt.find('.chk span:contains(' + dataChkTxt + ')').parent().removeClass('on').find('input').prop('checked', false);
				chkLeng (tarInp);
				if (tagTxt.next().children().length = 0 ) {
					tagTxt.show();
				}
			});
		} else {
			$(this).closest(swtParent).find('ul').find('li[data-label="' + thisTxt + '"]').remove();
		}
	});
}

function chkLeng (elem) {
	const tarSwtPrnt = elem.closest(swtParent);
	const swtCntVal = [tarSwtPrnt.find('ul').height(), parseInt(tarSwtPrnt.find('ul').css('margin-top')),
	tarSwtPrnt.find('.chk input:checked').length, tarSwtPrnt.find('.chk input:not(:checked)'), 'disabled'];
	const swtCntPd = [tarSwtPrnt.find('.switch-cont'), parseInt(tarSwtPrnt.find('.switch-cont').css('padding-top'))];
	chkSwitch = false;
	if (swtCntVal[2] !== 0) {
		if (!swtCntPd[0].hasClass('active') && !swtCntPd[0].children().is('.switch-item-list')) {
			swtCntPd[0].addClass('active').prepend('<div class="switch-item-list"><ul></ul></div>');
		}
		tarSwtPrnt.addClass('on');
		switch(swtCntVal[2]) {
			case maxItemLeng :
				swtCntVal[3].prop(swtCntVal[4], !chkSwitch);
				break
			default :
				swtCntVal[3].prop(swtCntVal[4], chkSwitch);
				break
		}
	} else if (!swtCntPd[0].is('.add-tag')) {
		tarSwtPrnt.removeClass('on').find('.switch-cont').removeClass('active');
		tarSwtPrnt.removeAttr('style').find('.switch-item-list').remove();
	} else {
		swtCntPd[0].find('.switch-item-list .txt').show();
	}
	if (tarSwtPrnt.hasClass('on') && !swtCntPd[0].is('.add-tag')) {
		tarSwtPrnt.removeAttr('style');
		elem.closest('.js-switch-outer.on:not(.active)').css('height', (swtCntVal[0] + swtCntVal[1]) + (swtCntPd[1] * irNum[1]));
	}
}
/* e : submit_design_write */

/* s : manage_design_list */
function reviewManagementFunc () {
	eDateTar = [$('.review-list-filter .text'), $('.daterange'), $('.date-fix-type .slt-date'), $('.search-date')];
	prntDateTar = [$('.review-filter-outer'), $('.review-list-filter'), $('.review-filter-form')];
	sltMon = parseInt(eDateTar[2].find('li.selected').text());
	eDateTar[0].on('click', function () {
		$(this).closest(prntDateTar[1]).addClass('on');
		$(this).closest(prntDateTar[0]).find(prntDateTar[2]).slideDown((secVal[2], 'easeInOutQuart'));
	});
	$('.btn-search-close').on('click', function () {
		$(this).closest(prntDateTar[0]).find(prntDateTar[1]).removeClass('on');
		$(this).closest(prntDateTar[0]).find(prntDateTar[2]).slideUp((secVal[2], 'easeInOutQuart'));
	});
	eDateTar[2].on('click', '.select-items', function () {
		const _thisTar = [$(this).find('li.selected'), $('.slt-picker'), $(this).find('li.selected').text(), $(this).find('li:last-of-type').text()];
		const chkMon = parseInt(_thisTar[0].text());
		sltMon = chkMon;
		switch(_thisTar[2]) {
			case _thisTar[3] :
				dateInp ();
				eDateTar[3].eq(1).text(sDateVal);
				_thisTar[1].show().find('.daterange').val('');
				break
			default :
				dateInp ();
				_thisTar[1].hide();
				break
		}
	});
	eDateTar[1].on('focusin', function () {
		eDateTar[1].on('apply.daterangepicker', function(ev, picker) {
			sDateVal = picker.startDate.format('MM.DD.YYYY');
			eDateVal = picker.endDate.format('MM.DD.YYYY');
			eDateTar[2].find('input').prop('checked', chkSwitch);
			actDateInp ();
		});
	});
	dateInp ();
}

function dateInp () {
	nDate = new Date();
	dateRangeOptions = {};
	chkDate = [nDate.getFullYear(), nDate.getMonth() + irNum[0], nDate.getDate(), nDate.getMonth() + (sltMon + irNum[0])];
	for (i = 1; i <= 2; i++) chkDate[i] = String(chkDate[i]).padStart(2, '0');
	sDateVal = chkDate[1] + '.' + chkDate[2] + '.' + chkDate[0];
	sLastDate = new Date(chkDate[0], chkDate[1], 0).getDate();
	if ((parseInt(chkDate[1]) + sltMon) > 12) {
		let sum = 12 - (parseInt(chkDate[1]) + sltMon);
		chkDate[3] = -sum;
		chkDate[0]++;
	}
	chkDate[3] = String(chkDate[3]).padStart(2, '0');
	eLastDate = new Date(chkDate[0], chkDate[3], 0).getDate();
	eDateVal = chkDate[3] + '.' + chkDate[2] + '.' + chkDate[0];
	if (chkDate[2] > eLastDate) {
		eDateVal = chkDate[3] + '.' + eLastDate + '.' + chkDate[0];
	} else if (chkDate[2] >= sLastDate) {
		if (sLastDate < eLastDate) {
			eDateVal = chkDate[3] + '.' + eLastDate + '.' + chkDate[0];
		}
	}
	if ($('.select-items li:last-of-type').hasClass('selected')) {
		eDateVal = sDateVal;
	}
	actDateInp ();
}

function actDateInp () {
	dateRangeOptions = {
		startDate: sDateVal,
		endDate: eDateVal,
		autoUpdateInput: false,
		locale: {
			"firstDay": 1,
			"daysOfWeek": [ "S", "M", "T", "W", "T", "F", "S"],
		},
		autoApply: true,
	}
	eDateTar[1].daterangepicker(dateRangeOptions);
	eDateTar[1].val(sDateVal + ' - ' + eDateVal);
	eDateTar[3].eq(0).text(sDateVal);
	eDateTar[3].eq(1).text(eDateVal);
}
/* e : manage_design_list */

/* s : manage desgin view */
function review_management_view_set() {
	$('.review-management').parents('html').addClass('management');
	//top tab
	$('.top-tab-menu').on('click', 'li', function() {
		let i = $(this).index(),
				tabContLi = $(this).parent('.top-tab-menu').next('.top-tab-cont').find('.top-tab-list');
		$(this).parent().find('li').removeClass('active');
		$(this).addClass('active');
		tabContLi.removeClass('active');
		tabContLi.eq(i).addClass('active');

		txtMore();
	})
}

// tooltip
function nameTooltip() {
	const targetName = $('.timeline').find('.writer');
	targetName.on('click', function(e) {
		let tooltip = $(this).next('.tooltip');
		$(this).addClass('active');
		tooltip.fadeIn();
	})
	targetName.next().find('.btn-close').on('click', function() {
		$(this).parent().fadeOut().siblings('.writer').removeClass('active');
	}) 
}

//text more
function txtMore() {
	let txtList = $('.timeline .list'),
		txtCont = $('.timeline .txt-cont'),
		txtContLen = txtCont.length,
		txtContH,
		txtContHArr = [],
		listIdxArr =[],
		minHeight = 241,
		pushBtn = '<button type="button" class="btn-more"></button>',
		btnTxt1 = 'More',
		btnTxt2 = 'Close';

	txtCont.each(function(){
		txtContH = $(this).find('.txt').outerHeight();
		txtContHArr.push(txtContH);
	})

	txtList.each(function(i) {
		$(this).attr('data-idx',i);
		listIdx = $(this).data('idx');
		listIdxArr.push(listIdx);
	})

	for (let i=0; i<txtContLen; i++) {     
		if (txtContHArr[i] >= minHeight){
			txtCont.eq(i).append(pushBtn).addClass('short').find('.btn-more').text(btnTxt1);
			txtCont.eq(i).find('.txt').css({height:minHeight-1});
		} 
	}

	let btnMore = $('.timeline .btn-more');
	btnMore.on('click', function() {
		let thisTxtH = $(this).siblings().outerHeight(),
				thisIdx = $(this).parents('.list').data('idx');

		if (thisTxtH >= minHeight){
			$(this).text(btnTxt1).parent().addClass('short');
			$(this).siblings('.txt').stop().animate({height:minHeight-1});
		} else {
			$(this).text(btnTxt2).parent().removeClass('short');
			$(this).siblings('.txt').stop().animate({height:txtContHArr[thisIdx]});
		}		

		if ($(window).width() > 1280) {
			let liIdx = $(this).closest('.list').data('idx'),
			txtIdxH = txtContHArr[liIdx] - (minHeight-1),
			commentB = parseInt($('.comment-box').css('bottom'));
			if (commentB > 0) {
				if($(this).parent('.txt-cont').hasClass('short')) {
					$('.comment-box').stop().animate({
						bottom:commentB + txtIdxH
					});
				} else {
					$('.comment-box').stop().animate({
						bottom:commentB - txtIdxH
					});
				}
			}
		}
	})
}

// comment file
function commentFile() {
	let addFile = $('.comment-box input[type="file"]');

	addFile.on('change', function(){
		let fileCont = $(this).parents('.inp-cont').next('.switch-item-list'),
				filename;
		if(!fileCont.children().is('ul')) {
			fileCont.append('<ul></ul>');
		}
		if(window.FileReader){
			filename = $(this)[0].files[0].name;
		} else {
			filename = $(this).val().split('/').pop().split('\\').pop();
		}

		let pushTag = '<li>'+filename+'<button class="btn-item-del"></button></li>';
		fileCont.children('ul').append(pushTag);
		$('.btn-item-del').on('click', function() {
			let $this = $(this);
			clearFile($this)
		})
	}); 

	const cmFixBoxTar = [$('.comment-box'), $('.bms-footer')];
	const cmFixBoxPos = [parseInt(cmFixBoxTar[0].css('bottom'))];
	if (cmFixBoxTar[0].length !== 0) {
		$(window).on('scroll', function () {
			let cmScrPos = $(this).scrollTop();
			let cmScrPosSum = ($(document).height() - $(window).height()) - cmFixBoxTar[1].outerHeight(true);
			if (cmScrPos >= cmScrPosSum) {
				cmFixBoxTar[0].css('bottom', (cmScrPos - cmScrPosSum) + cmFixBoxPos[0]);
			} else {
				cmFixBoxTar[0].css('bottom', cmFixBoxPos[0]);
			}
		});
	}
}

//clear file
function clearFile($this) {
	$this.parent().remove();
	$('.inpfile').val('');
	$this.parents('.comment-box').find('.inpfile').replaceWith($('.inpfile').clone(true));
}

//resize textarea
function autoReTxt() {
	$('.txtarea-resize textarea').on('keydown keyup', function() {
		let inpBtn = $(this).parent().next('.btn');
		if ($(this).val() == '') {
			inpBtn.attr('disabled', true);
		} else {
			inpBtn.attr('disabled', false);
		}
		$(this).height(1).height( $(this).prop('scrollHeight') );	
	})
}
/* e : manage design view */

/* s : review management view */
function review_management_set() {
	$('.design-review-view').parents('html').addClass('view-wrap');
	$('.view-wrap').find('.layer-popup-cont').width(1200);
	if($(window).width() < 1281) {
		$(window).on('scroll', function(){
			$('.bms-header').removeClass('fixed');
			let scroll = $(this).scrollTop(),
					targetH = $('.view-wrap .timeline').offset().top,
					headerH = $('.bms-header').height();
			if(scroll > targetH - headerH) {
				$('.bms-header').addClass('fixed')
			} else {
				$('.bms-header').removeClass('fixed')
			}
		})
	}  
}
/* e : review management view */


/* s : design_review_05 */
function btmFixBoxFunc () {
	const dsFixBoxTar = [$('.btm-fix-box'), $('.bms-footer'), $('.right-guide-outer'), $('.btn-top-box'), $('.bms-header, body')];
	const dsFixBoxPos = [parseInt(dsFixBoxTar[0].css('bottom')), parseInt(dsFixBoxTar[3].css('right'))];
	if (dsFixBoxTar[0].length !== 0) {
		$(window).on('scroll', function () {
			let dsScrPos = $(this).scrollTop();
			let dsScrPosSum = ($(document).height() - $(window).height()) - dsFixBoxTar[1].outerHeight(true);
			if (dsScrPos >= dsScrPosSum) {
				dsFixBoxTar[0].css('bottom', (dsScrPos - dsScrPosSum) + dsFixBoxPos[0]);
			} else {
				dsFixBoxTar[0].css('bottom', dsFixBoxPos[0]);
			}
		});
		dsFixBoxTar[0].on('click', '.btn-right-guide', function () {
			const dsWsize = [$(window).outerWidth(), $(window).width()];
			const rightFixPos = [parseInt($(this).parent().css('right')), (dsWsize[0] - dsWsize[1])];
			dsFixBoxTar[2].toggleClass('active');
			if (dsFixBoxTar[2].hasClass('active')) {
				dsFixBoxTar[4].css({'overflow':'hidden', 'width':dsWsize[1]});
				$(this).parent().css('right', rightFixPos[0] + rightFixPos[1]);
				dsFixBoxTar[3].css('right', dsFixBoxPos[1] + rightFixPos[1]);
			}
			$(document).on('click', function (e) {
				const dsReFixTar = $('.btn-right-guide *, .right-guide-outer, .right-guide-outer *');
				if(!$(e.target).is(dsReFixTar)) {
					dsRboxClose ();
				}
			});
			$('.btn-guide-close').on('click',function () {
				dsRboxClose ();
			});
			function dsRboxClose () {
				dsFixBoxTar[2].removeClass('active');
				dsFixBoxTar[0].css('right', rightFixPos[0]);
				dsFixBoxTar[3].removeAttr('style');
				setObj(() => {
					dsFixBoxTar[4].removeAttr('style');
				}, secVal[4]);
			}
		});
	}
}

function reviewCarousel () {
	if($('.review-guide-step').length > 0) {
		const carouselType1 = new Swiper('.review-guide-step .slide-swiper', {
			direction: 'horizontal',
			pagination: {
				el: ".review-guide-step .swiper-pagination",
				type: "fraction",
			},
			navigation: {
				nextEl: '.review-guide-step .swiper-button-next',
				prevEl: '.review-guide-step .swiper-button-prev',
			},
			loop: true,
			initialSlide: 0,
			on: {
				slideChangeTransitionStart: function () {
					const swpLinkTar = [$('.guide-step-info > ul').find('> li'), $('.guide-step2-info > ul').find('> li')];
					let swpChpIdx = $('.review-guide-step .swiper-slide-active').attr('data-swiper-slide-index');
					let swpStepLeng = $('.guide-step2-info > ul').find('> li').length;
					swpLinkTar[0].removeAttr('class').eq(swpChpIdx).addClass('on');
					if (swpChpIdx < swpStepLeng) {
						swpLinkTar[1].removeAttr('class').eq(swpStepLeng - swpStepLeng).addClass('on');
					} else {
						swpLinkTar[1].removeAttr('class').eq(swpStepLeng - irNum[0]).addClass('on');
					}
				}
			}
		});
	}
}

function dsSaveToast () {
	setInterval(function () {
		$('.write-save-toast').addClass('active');
		setTimeout(function () {
			$('.write-save-toast').removeClass('active');
		}, secVal[2] * twoDig[0]);
		dsSaveDateInp ();
	}, 10000);
	// }, secVal[8] * secVal[1]);
}

function dsSaveDateInp () {
	const nDate = new Date();
	const chkDate = [nDate.getFullYear(), nDate.getMonth() + irNum[0], nDate.getDate(), nDate.getHours(), nDate.getMinutes()];
	const chkDateLeng = chkDate.length;
	for (i = 1; i < chkDateLeng; i++) chkDate[i] = String(chkDate[i]).padStart(2, '0');
	let sDateVal = chkDate[1] + '.' + chkDate[2] + '.' + chkDate[0] + ' ' + chkDate[3] + ':' + chkDate[4];
	$('.toast-check-time').text(sDateVal);
}
/* e : design_review_05 */