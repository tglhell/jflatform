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
								}, twoDig[3] * i);
							}(i));
						}
					}, secVal[1]);
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
		const _this = $(this);
		const iNum = 14;
		carItemWid = _this.find('.car-item').width();
		carItemWidRes = secVal[0] * carItemWid / $(window).width();
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
				// slidesPerView: 'auto',
				// centeredSlides: true,
				simulateTouch: true,
				speed: 500,
				loop: true,
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
											setTimeout(function(){
												$('.car-cont:not(.swiper-slide-active)').find('img').css('transform', 'translate3d(-' + (carItemWidRes * (iNum - i)) + 'vw, 0, 0)');
											}, twoDig[1] * i);
										}(i));
									}
									$('.car-cont').removeClass('focus-in');
								}, secVal[0]);
								onIr = setTimeout(function () {
									clearTimeout(onIr);
									clearTimeout(offIr);
									for (i = irNum[0]; i < iNum; i++) {
										$(function(i){
											testT = setTimeout(function(){
												$('.swiper-slide-active').find('.car-item img').css('transform', 'translate3d(-' + (carItemWidRes * i) + 'vw, 0, 0)');
											}, twoDig[3] * i);
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
});