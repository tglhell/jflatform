// design_review_03
// function reviewManagementFunc () {
// 	eDateTar = [$('.review-list-filter .text'), $('.daterange'), $('.date-fix-type .slt-date'), $('.search-date')];
// 	prntDateTar = [$('.review-filter-outer'), $('.review-list-filter'), $('.review-filter-form')];
// 	sltMon = parseInt(eDateTar[2].find('li.selected').text());
// 	eDateTar[0].on('click', function () {
// 		$(this).closest(prntDateTar[1]).addClass('on');
// 		$(this).closest(prntDateTar[0]).find(prntDateTar[2]).slideDown((secVal[2], 'easeInOutQuart'));
// 	});
// 	$('.btn-search-close').on('click', function () {
// 		$(this).closest(prntDateTar[0]).find(prntDateTar[1]).removeClass('on');
// 		$(this).closest(prntDateTar[0]).find(prntDateTar[2]).slideUp((secVal[2], 'easeInOutQuart'));
// 	});
// 	eDateTar[2].on('click', '.select-items', function () {
// 		const _thisTar = [$(this).find('li.selected'), $('.slt-picker'), $(this).find('li.selected').text(), $(this).find('li:last-of-type').text()];
// 		const chkMon = parseInt(_thisTar[0].text());
// 		sltMon = chkMon;
// 		switch(_thisTar[2]) {
// 			case _thisTar[3] :
// 				dateInp ();
// 				eDateTar[3].eq(1).text(sDateVal);
// 				_thisTar[1].show().find('.daterange').val('');
// 				break
// 			default :
// 				dateInp ();
// 				_thisTar[1].hide();
// 				break
// 		}
// 	});
// 	eDateTar[1].on('focusin', function () {
// 		eDateTar[1].on('apply.daterangepicker', function(ev, picker) {
// 			sDateVal = picker.startDate.format('MM.DD.YYYY');
// 			eDateVal = picker.endDate.format('MM.DD.YYYY');
// 			eDateTar[2].find('input').prop('checked', chkSwitch);
// 			actDateInp ();
// 		});
// 	});
// 	dateInp ();
// }
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
		if (_thisTar[2] == _thisTar[3]) {
			dateInp ();
			eDateTar[3].eq(1).text(sDateVal);
			_thisTar[1].show().find('.daterange').val('');
		} else {
			dateInp ();
			_thisTar[1].hide();
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
	eLastDate = new Date(chkDate[0], chkDate[3], 0).getDate();
	chkDate[3] = String(chkDate[3]).padStart(2, '0');
	if (chkDate[2] > eLastDate) {
		eDateVal = chkDate[3] + '.' + eLastDate + '.' + chkDate[0];
	} else if (chkDate[2] >= sLastDate) {
		if (sLastDate < eLastDate) {
			eDateVal = chkDate[3] + '.' + eLastDate + '.' + chkDate[0];
		}
	} else { 
		eDateVal = chkDate[3] + '.' + chkDate[2] + '.' + chkDate[0];
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

// design_review_05
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
			rightFixPos = [parseInt($(this).parent().css('right')), (dsWsize[0] - dsWsize[1])];
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
btmFixBoxFunc ();

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
reviewCarousel ();

function dsSaveToast () {
	setInterval(function () {
		$('.write-save-toast').addClass('active');
		setTimeout(function () {
			$('.write-save-toast').removeClass('active');
		}, secVal[2] * twoDig[0]);
		dateInp ();
	}, 10000);
	// }, secVal[8] * secVal[1]);
}
dsSaveToast ();

function dateInp () {
	const nDate = new Date();
	const chkDate = [nDate.getFullYear(), nDate.getMonth() + irNum[0], nDate.getDate(), nDate.getHours(), nDate.getMinutes()];
	const chkDateLeng = chkDate.slice(1, 5).length;
	for (i = 1; i <= chkDateLeng; i++) chkDate[i] = String(chkDate[i]).padStart(2, '0');
	let sDateVal = chkDate[1] + '.' + chkDate[2] + '.' + chkDate[0] + ' ' + chkDate[3] + ':' + chkDate[4];
	$('.toast-check-time').text(sDateVal);
}