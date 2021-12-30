// Key Visual Swiper
function mainKeyvisualSwiper () {
	if ($('.main-swiper-num01').length == 1) {
		let swpOpt = {},
		slideLength = $('.main-swiper-num01 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.main-swiper-num01 [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.main-swiper-num01 .swiper-button-next',
					prevEl: '.main-swiper-num01 .swiper-button-prev',
				},
				pagination: {
					el: '.main-swiper-num01 .swiper-pagination',
					clickable: true,
				},
				simulateTouch: true,
				speed: 300,
				loop: true,
				spaceBetween: 0,
				observer: true,
				observeParents: true,
			}
		}
		let mainSwp = new Swiper('.main-swiper-num01 .swiper-container', swpOpt);
	}
}

// Lineup Rotate
function chkStartPos () {
	chkActPos = $('.lineup-wrap').offset().top;
	chkPos = false;
	scrPos = $(window).scrollTop();
	iNum = 12; // 전체 이미지수 -1
	
	$(window).scroll(function () {
		scrPos = $(this).scrollTop();
		startPos();
	});
	
	function startPos () {
		if (scrPos >= chkActPos && !chkPos) {
			$('.main-item-swiper').addClass('active');
			for (i = irNum[0]; i < iNum; i++) {
				$(function(i){
					setTimeout(function(){
						$('.swiper-slide-active').find('.car-item img').css('transform', 'translateX(-' + (carItemWidRes * i) + 'vw)');
					}, twoDig[2] * i);
				}(i));
			}
			setTimeout(function () {
				$('.swiper-slide-active').addClass('focus-in');
			}, secVal[2]);
			chkPos = true;
		}
	}
	startPos ();
}

// Lineup Swiper
function mainLineupSwiper () {
	if ($('.main-item-swiper').length == 1) {
		$('body').css('overflow', 'hidden');
		const winWid = $(window).width();
		$('body').css('overflow', 'visible');
		const bdWid = $('body').width();
		const widSum = winWid - bdWid;
		if ($(window).width() > tbl) {
			if (widSum == 0) {
				carItemWid = $('.main-item-swiper').find('.car-item').width() + irNum[1];
				$('.main-item-swiper').find('.car-item img').css('width', '526.25vw');
			} else {
				carItemWid = $('.main-item-swiper').find('.car-item').width();
				$('.main-item-swiper').find('.car-item img').css('width', '528.75vw');
			}
		}
		let swpOpt = {},
		mainSwiper = $('.main-item-swiper .swiper-slide');
		slideLength = mainSwiper.length;
		carItemWid = mainSwiper.find('.car-item').width();
		carItemWidRes = secVal[0] * carItemWid / $(window).width();
		if ($(window).width() > tbl) {
			_slideSpeed = 700;
			_slideDelay = 900;
			_rotateVal = 25;
		} else{
			_slideSpeed = 300;
			_slideDelay = 300;
			_rotateVal = 15;
		}
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.main-item-swiper [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				slidesPerView: 'auto',
				simulateTouch: true,
				centeredSlides: false,
				loop: true,
				speed: _slideSpeed,
				observer: true,
				observeParents: true,
				navigation: {
					nextEl: ".main-item-swiper .swiper-button-next",
					prevEl: ".main-item-swiper .swiper-button-prev"
				},
				pagination: {
					el: '.main-item-swiper .swiper-pagination',
					clickable: true,
				},
				on: {
					slideChange: function () {
						if ($('.main-item-swiper .car-cont').hasClass('swiper-slide-active')) {
							$('.car-cont').removeClass('focus-in');
							$('.car-cont').find('img').css('transform', 'translateX(-0vw)');
							if (!$('.car-cont').is(':animated')) {
								$('.car-cont').animate({'overflow':'visible'}, secVal[4]);
								swpActChk = true;
							}
							setTimeout(function () {
								$('.swiper-slide-active').addClass('focus-in');
								if (swpActChk) {
									for (i = irNum[0]; i < iNum; i++) {
										$(function(i){
											setTimeout(function(){
												$('.swiper-slide-active').find('.car-item img').css('transform', 'translateX(-' + (carItemWidRes * i) + 'vw)');
											}, _rotateVal * i);
										}(i));
									}
								}
								swpActChk = false;
							}, _slideDelay);
						}
					}
				}
			}
		}
		let sampleSwp = new Swiper('.main-item-swiper .swiper-container', swpOpt);
	}
}

 // Brand Swiper
function mainBrandSwiper () {
	if ($('.brand-list-cont').length == 1) {
		let swpOpt = {};
		if ($(window).width() > tbl) {
			_resChk = false;
			_sBetween = 16;
		} else{
			_resChk = true;
			_sBetween = 8;
		}
		swpOpt = {
			navigation: {
				nextEl: '.brand-list-cont .swiper-button-next',
				prevEl: '.brand-list-cont .swiper-button-prev',
			},
			pagination: false,
			slidesPerView: 'auto',
			// centeredSlides: true,
			simulateTouch: true,
			speed: 300,
			loop: true,
			spaceBetween: _sBetween,
			centeredSlides: _resChk,
			observer: true,
			observeParents: true,
		}
		let galleryList1 = new Swiper('.brand-list-cont .swiper-container', swpOpt);
	}
}