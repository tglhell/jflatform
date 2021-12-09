$(function(){
	const iNum = 14;
	if ($('.main-item-swiper').length == 1) {
		$('body').css('overflow', 'hidden');
		const winWid = $(window).width();
		$('body').css('overflow', 'visible');
		const bdWid = $('body').width();
		const widSum = winWid - bdWid;
		if (widSum == 0) {
			carItemWid = $('.main-item-swiper').find('.car-item').width() + irNum[1];
			$('.main-item-swiper').find('.car-item img').css('width', '614.29167vw');
		} else {
			carItemWid = $('.main-item-swiper').find('.car-item').width();
			$('.main-item-swiper').find('.car-item img').css('width', '619.79167vw');
		}
		let swpOpt = {},
		slideLength = $('.main-item-swiper .swiper-slide').length;
		let _boolChk;
		const _this = $(this);
		const iNum = 14;
		carItemWid = _this.find('.car-item').width();
		carItemWidRes = secVal[0] * carItemWid / $(window).width();
		if ($(window).width() > tbl) {
			_boolChk = true;
		} else{
			_boolChk = false;
		}
		onIr = setTimeout(function () {
			for (i = irNum[0]; i < iNum; i++) {
				$(function(i){
					setObj(function(){
						$('.swiper-slide-active').find('.car-item img').css('transform', 'translate3d(-' + (carItemWidRes * i) + 'vw, 0, 0)');
					}, twoDig[2] * i);
				}(i));
			}
			$('.swiper-slide-active').addClass('focus-in');
		}, secVal[8]);
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.main-item-swiper [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				 // Assign some jquery elements we'll need

				slidesPerView: 'auto',
				simulateTouch: false,
				centeredSlides: false,
				loop: true,
				loopAdditionalSlides: 30,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev"
				},
				on: {
					slideChange: function () {
						if ($(window).width() <= tbl || $(window).width() > tbl) {
							if ($('.main-item-swiper .car-cont').hasClass('swiper-slide-active')) {
								// for (i = iNum; i > 0 ; i--) {
								// 	$(function(i){
								// 		setObj(function(){
								// 			$('.car-cont:not(.swiper-slide-active)').find('img').css('transform', 'translate3d(-' + (carItemWidRes * (iNum - i)) + 'vw, 0, 0)');
								// 		}, twoDig[1] * i);
								// 	}(i));
								// }
								$('.car-cont:not(.swiper-slide-active)').find('img').css('transform', 'translate3d(-0vw, 0, 0)');
								$('.car-cont').removeClass('focus-in');
								onIr = setTimeout(function () {
									for (i = irNum[0]; i < iNum; i++) {
										$(function(i){
											setObj(function(){
												$('.swiper-slide-active').find('.car-item img').css('transform', 'translate3d(-' + (carItemWidRes * i) + 'vw, 0, 0)');
											}, twoDig[2] * i);
										}(i));
									}
									$('.swiper-slide-active').addClass('focus-in');
								}, secVal[8]);
							}
						}
					}
				}
			}
		}
		let sampleSwp = new Swiper('.main-item-swiper .swiper-container', swpOpt);
		// sampleSwp.update();
	}

	// manin brand
	if ($('.brand-list-cont').length == 1) {
		let swpOpt = {};
		let _gap;
		if ($(window).width() > tbl) {
			_resChk = false;
			_boolChk = true;
		} else{
			_resChk = true;
			_boolChk = false;
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
			loop: _boolChk,
			spaceBetween: 16,
			centeredSlides: _resChk,
			observer: true,
			observeParents: true,
		}
		let galleryList1 = new Swiper('.brand-list-cont .swiper-container', swpOpt);
	}
});