$(function () {
	if ($('.swiper-num01').length == 1) {
		// Swiper1
		var swpOpt1 = {},
		slideLength = $('.swiper-num01 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt1 = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.swiper-num01 [class*="swiper-button"]').hide();
		} else {
			swpOpt1 = {
				navigation: {
					nextEl: '.swiper-num01 .swiper-button-next',
					prevEl: '.swiper-num01 .swiper-button-prev',
				},
				pagination: {
					el: '.swiper-num01 .swiper-pagination',
					clickable: true,
				},
				// slidesPerView: 'auto',
				// centeredSlides: true,
				freeMode: true,
				mousewheel: {
					releaseOnEdges: true,
				},
				simulateTouch: false,
				speed: 300,
				loop: false,
				spaceBetween: 30,
				observer: true,
				observeParents: true,
			}
		}
		var swiper1 = new Swiper('.swiper-num01 .swiper-container', swpOpt1);
		
		swiper1.on('reachEnd', function(){
			setObj(function(){
				$('.btn-close-popup').trigger('click');
			}, scrFixPos);
		})
	}
});