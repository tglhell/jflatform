$(function(){
	const iNum = 14;
	$('.car-item-outer').on('mouseenter mouseleave', '.car-cont', function (e) {
		const _this = $(this);
		$('body').css('overflow', 'hidden');
		const winWid = $(window).width();
		$('body').css('overflow', 'visible');
		const bdWid = $('body').width();
		const widSum = winWid - bdWid;
		if (widSum == 0) {
			carItemWid = _this.find('.car-item').width() + irNum[5];
		} else {
			carItemWid = _this.find('.car-item').width();
		}
		carItemWidRes = secVal[0] * carItemWid / $(window).width();
		if ($(window).width() > tbl) {
			if (e.type == 'mouseenter') {
				if (!_this.is(':animated')) {
					_this.stop().animate({'overflow':'visible'}, secVal[4]);
					setObj(function () {
						for (i = irNum[0]; i < iNum; i++) {
							$(function(i){
								setObj(function(){
									_this.find('.car-item img').css('transform', 'translate3d(-' + (carItemWidRes * i) + 'vw, 0, 0)');
								}, twoDig[1] * i);
							}(i));
						}
					}, secVal[4]);
					$('.car-cont').removeClass('focus-in focus');
					_this.addClass('focus-in').siblings().addClass('focus');
				}
			} else {
				setObj(function () {
					for (i = iNum; i > 0 ; i--) {
						$(function(i){
							setObj(function(){
								if (!_this.hasClass('focus focus-in')) {
									_this.find('img').css('transform', 'translate3d(-' + (carItemWidRes * (iNum - i)) + 'vw, 0, 0)');
								}
							}, twoDig[1] * i);
						}(i));
					}
				}, secVal[4]);
				$('.car-cont').removeClass('focus-in focus');
			}
		}
	});

	if ($('.main-item-swiper').length == 1) {
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
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.main-item-swiper [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.main-item-swiper .swiper-button-next',
					prevEl: '.main-item-swiper .swiper-button-prev',
				},
				simulateTouch: true,
				speed: 500,
				loop: _boolChk,
				slidesPerView: 'auto',
				spaceBetween: 0,
				lazy: {
					loadPrevNext : true,
				},
				observer: true,
				observeParents: true,
				on: {
					slideChange: function () {
						if ($(window).width() <= tbl) {
							if ($('.main-item-swiper .car-cont').hasClass('swiper-slide-active')) {
								offIr = setTimeout(function () {
									for (i = iNum; i > 0 ; i--) {
										$(function(i){
											setObj(function(){
												$('.car-cont:not(.swiper-slide-active)').find('img').css('transform', 'translate3d(-' + (carItemWidRes * (iNum - i)) + 'vw, 0, 0)');
											}, twoDig[2] * i);
										}(i));
									}
									$('.car-cont').removeClass('focus-in');
								}, secVal[0]);
								onIr = setTimeout(function () {
									for (i = irNum[0]; i < iNum; i++) {
										$(function(i){
											setObj(function(){
												$('.swiper-slide-active').find('.car-item img').css('transform', 'translate3d(-' + (carItemWidRes * i) + 'vw, 0, 0)');
											}, twoDig[2] * i);
										}(i));
									}
									$('.swiper-slide-active').addClass('focus-in');
								}, secVal[1]);
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