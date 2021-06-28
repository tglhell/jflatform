$(function () {
	if ($('.sample-swiper-num01').length == 1) {
		let swpOpt = {},
		slideLength = $('.sample-swiper-num01 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.sample-swiper-num01 [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.sample-swiper-num01 .swiper-button-next',
					prevEl: '.sample-swiper-num01 .swiper-button-prev',
				},
				pagination: {
					el: '.sample-swiper-num01 .swiper-pagination',
					clickable: true,
				},
				// slidesPerView: 'auto',
				// centeredSlides: true,
				simulateTouch: true,
				speed: 300,
				loop: false,
				spaceBetween: 0,
				observer: true,
				observeParents: true,
			}
		}
		let sampleSwp = new Swiper('.sample-swiper-num01 .swiper-container', swpOpt);
		
		sampleSwp.on('reachEnd', function(){
			setObj(function(){
				$('.btn-close-popup').trigger('click');
			}, fadeVal);
		});
	}
});