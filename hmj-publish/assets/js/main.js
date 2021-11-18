$(function(){
	const iNum = 14;
	$('.car-item-outer').on('mouseenter mouseleave', '.car-cont', function (e) {
		const _this = $(this);
		if ($(window).width() >= pc) {
			carItemWid = _this.find('.car-item').width();
		} else {
			carItemWid = _this.find('.car-item').width() + irNum[4];
		}
		carItemWidRes = secVal[0] * carItemWid / $(window).width();
		if ($(window).width() > tbl) {
			if (e.type == 'mouseenter') {
				if (!$(this).is(':animated')) {
					$(this).stop().animate({'overflow':'visible'}, secVal[4]);
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
					$(this).addClass('focus-in').siblings().addClass('focus');
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
		let menuTitArr = [];
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
		for (let i = 0; i < slideLength; i++) {
			menuItem = $('.main-item-swiper .swiper-slide').eq(i).find('.item-tit').text();
			menuTitArr.push(menuItem);
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
				pagination: {
					el: '.main-item-swiper .swiper-pagination',
					clickable: true,
					renderBullet: function (index, className) {
						return '<span class="' + className + '">' + (menuTitArr[index]) + '</span>';
					},
				},
				simulateTouch: true,
				speed: 500,
				loop: _boolChk,
				slidesPerView: 'auto',
				spaceBetween: 0,
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
									clearTimeout(onIr);
									clearTimeout(offIr);
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
			_gap = 32;
			_resChk = false;
			_boolChk = true;
		} else{
			_gap = 16;
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
			spaceBetween: _gap,
			centeredSlides: _resChk,
			observer: true,
			observeParents: true,
		}
		let galleryList1 = new Swiper('.brand-list-cont .swiper-container', swpOpt);
	}
});