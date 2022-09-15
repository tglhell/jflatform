/* s : submit_design_write */
function designReview () {
	maxItemLeng = 10; // 체크박스 체크된 최대 갯수
	swtParent = $('.js-switch-outer');
	outerSltTagBox = $('.selected-tag .selected-box');
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
			$('.btn-item-del').off().on('click', function () {
				const dataChkTxt = $(this).parent().attr('data-label');
				const chkCnt = $(this).closest('.switch-cont');
				const tarInp = chkCnt.find('.chk input');
				const btnDelIdx = $(this).closest('li').index();
				if ($('.add-tag-pop').css('display') === 'none') {
					$('.add-tag-pop .switch-item-list').find('ul li').eq(btnDelIdx).remove();
					if ($('.add-tag-pop .switch-item-list').find('ul li').length == 0) {
						$('.add-tag .switch-item-list').find('p').show();
					}
					$('.add-tag-pop').find('.chk span:contains(' + dataChkTxt + ')').parent().removeClass('on').find('input').prop('checked', false);
				}
				$(this).parent().remove();
				chkCnt.find('.chk span:contains(' + dataChkTxt + ')').parent().removeClass('on').find('input').prop('checked', false);
				chkLeng (tarInp);
				if (tagTxt.next().children().length = 0 ) {
					tagTxt.show();
				}
				sltItemLeng = outerSltTagBox.find('ul').children('li').length;
				if (sltItemLeng == 0) {
					outerSltTagBox.removeClass('active');
					$('.btn-item-add').off();
				} else if (sltItemLeng < maxItemLeng) {
					$('.add-tag-pop .check-box').find('.chk:not(.on) input').prop('disabled', false);
				}
			});
		} else {
			$(this).closest(swtParent).find('ul').find('li[data-label="' + thisTxt + '"]').remove();
		}

		
		$('.btn-item-add').on('click', function () {
			const btnItemCloseTar = $(this).closest('.layer-popup-wrap');
			outerSltTagBox.addClass('active');
			outerSltTagBox.find('li').remove();
			$('.add-tag .switch-item-list').find('ul li').clone(true).appendTo('.selected-tag ul');
			popClose (btnItemCloseTar);
			if ($('.add-tag .switch-item-list').find('ul li').length == 0) {
				outerSltTagBox.removeClass('active');
				$('.btn-item-add').off();
			}
		});

		$('.add-tag-pop .btn-close').off().on('click', function () {
			$('.add-tag-pop .check-box').find('.chk span').parent().removeClass('on').find('input').prop('checked', false);
			setTimeout(function () {
				$('.add-tag .switch-item-list ul').find('li').remove();
				outerSltTagBox.find('ul li').clone(true).appendTo('.add-tag .switch-item-list ul');
			}, 500);
			for (i = 0; i < outerSltTagBox.find('ul li').length; i++) {
				const chkTagItemLbl = outerSltTagBox.find('ul li').eq(i).attr('data-label');
				$('.add-tag-pop .check-box').find('.chk span:contains(' + chkTagItemLbl + ')').parent().addClass('on').find('input').prop('checked', true);
			}
			if (outerSltTagBox.find('ul li').length == maxItemLeng) {
				console.log(outerSltTagBox.find('ul li').length);
				$('.add-tag-pop .check-box').find('.chk:not(.on) input').prop('disabled', true);
			} else if (outerSltTagBox.find('ul li').length == 0) {
				setTimeout(function () {
					$('.add-tag .switch-item-list').find('p').show();
				}, 500);
			} else {
				$('.add-tag-pop .check-box').find('.chk input').prop('disabled', false);
			}
		});
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
		$(this).removeClass('date-chk');
		eDateTar[1].on('apply.daterangepicker', function(ev, picker) {
			sDateVal = picker.startDate.format('MM.DD.YYYY');
			eDateVal = picker.endDate.format('MM.DD.YYYY');
			eDateTar[2].find('input').prop('checked', chkSwitch);
			actDateInp ();
		});
		if ($(this).closest('.layer-popup-wrap').is('.w1200')) {
			$(this).closest('.layer-popup-wrap.w1200').find('.layer-popup-cont-inner').scroll(function () {
				let drpInpHgt = $(this).find('.daterange').outerHeight(true);
				let drpPos = $(this).find('.daterange').offset().top + drpInpHgt;
				$('.daterangepicker').css('top', drpPos);
			});
		}
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
	if ($(eDateTar[1]).hasClass('date-chk')) {
		if (!$(eDateTar[1]).parent().is('.active')) {
			$('.daterange.date-chk').val('');
		}
	} else {
		eDateTar[1].val(sDateVal + ' - ' + eDateVal);
	}
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
		$(this).siblings('li').removeClass('active');
		$(this).addClass('active');
		tabContLi.removeClass('active');
		tabContLi.eq(i).addClass('active');
		if (!$('.txt-cont').is('.short')) {
			txtMore ();
		}
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
		let thisTxtH = $(this).siblings('.txt').outerHeight(),
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
	cateThumbBox = $('.cate-thumb-box');

	addFile.on('change', function (e) {
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
		if ($(this).parents('.comment-box').hasClass('cate-thumb-box')) {
			$(this).parents('.comment-box').addClass('active').parent().find('.right .input-item').val(filename);
			thumbReadUrl (this);
			e.target.value = null;
		}
		fileCont.children('ul').append(pushTag);
		$('.btn-item-del').on('click', function() {
			let $this = $(this);
			clearFile($this)
		})
	});
	reSizeCmmt();
	function reSizeCmmt() {
		let reWinWid = ($(window).width() - 1920) / 2;
		if ($(window).width() > 1920) {
			$('.comment-box:not(.cate-thumb-box)').css('right',reWinWid);
		} else {
			$('.comment-box:not(.cate-thumb-box)').css('right', 0);
		}
	}
	$(window).resize(function() {
		reSizeCmmt();
	})
}

function thumbReadUrl (input) {
	if (input.files && input.files[0]) {
		let reader = new FileReader();
		reader.onload = function (e) {
			cateThumbBox.find('.add-file label img').remove();
			cateThumbBox.find('.add-file label').append('<img src="' + e.target.result + '" alt="대표 이미지">');
		}
		reader.readAsDataURL(input.files[0]);
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


/* s : submit_library_write */
function btmFixBoxFunc () {
	const dsFixBoxTar = [$('.btm-btn-fix, .comment-box:not(.cate-thumb-box)'), $('.bms-footer'), $('.right-guide-outer'), $('.btn-top-box'), $('body')];
	const dsFixBoxPos = [parseInt(dsFixBoxTar[0].css('bottom')), parseInt(dsFixBoxTar[3].css('right'))];
	$(window).on('scroll resize mouseover', function () {
		let dsScrPos = $(this).scrollTop();
		let dsScrPosSum = ($(document).height() - $(window).height()) - dsFixBoxTar[1].outerHeight(true);
		if (dsScrPos >= dsScrPosSum) {
			dsFixBoxTar[0].css('bottom', (dsScrPos - dsScrPosSum) + dsFixBoxPos[0]);
		} else {
			dsFixBoxTar[0].css('bottom', dsFixBoxPos[0]);
		}
	});
	if (dsFixBoxTar[0].length !== 0) {
		dsFixBoxTar[0].on('click', '.btn-right-guide', function () {
			const dsWsize = [$(window).outerWidth(), $(window).width()];
			const rightFixPos = [parseInt($(this).parent().css('right')), (dsWsize[0] - dsWsize[1])];
			dsFixBoxTar[2].toggleClass('active');
			if (dsFixBoxTar[2].hasClass('active')) {
				dsFixBoxTar[0].css({'width':dsWsize[1]});
				dsFixBoxTar[4].css({'overflow':'hidden', 'width':dsWsize[1]});
				dsFixBoxTar[3].css('right', dsFixBoxPos[1] + rightFixPos[1]);
			}
			$(document).on('click', function (e) {
				if (dsFixBoxTar[2].hasClass('active')) {
					const dsReFixTar = $('.btn-right-guide *, .right-guide-outer, .right-guide-outer *');
					if(!$(e.target).is(dsReFixTar)) {
						dsRboxClose ();
					}
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
					dsFixBoxTar[0].css({'width':'auto'});
					dsFixBoxTar[4].removeAttr('style');
				}, secVal[4]);
			}
		});
	}
}

function rightGuideSwiper () {
	if($('.review-guide-step').length > 0) {
		const rightGuideSwiper = new Swiper('.review-guide-step .slide-swiper', {
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
		});
		rightGuideSwiper.on('transitionStart', function() {
			const swpLinkTar = $('.guide-step-info > ul').find('> li');
			swpLinkTar.removeAttr('class').eq(rightGuideSwiper.realIndex).addClass('on');
		});
	}
}

function dsSaveToast () {
	$('.btn-tp-save').on('click', function () {
		$('.write-save-toast').addClass('active');
		setTimeout(() => {
			$('.write-save-toast').removeClass('active');
		}, 3000);
	});
}

$(function () {
	$('.side .right').find('input').on('change', function () {
		const chkInpTar = $(this).closest('.input-outer-box').find('.inp-slice-box input');
		if ($(this).is(':checked')) {
			chkInpTar.addClass('disabled').prop('disabled');
		} else {
			chkInpTar.removeClass('disabled').prop('enabled');
		}
	});

	$('.selected-tag .btn-item-del').on('click', function () {
		$(this).parent().remove();
		if ($('.selected-tag .switch-item-list').find('ul li').length == 0) {
			outerSltTagBox.removeClass('active');
		}
	});
});
/* e : submit_library_write */