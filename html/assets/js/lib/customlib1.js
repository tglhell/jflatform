$(function () {
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
				// autoplay: {
				// 	delay: 4000,
				// 	disableOnInteraction: false,
				// },
				simulateTouch: true,
				speed: 300,
				loop: true,
				spaceBetween: 0,
				on: {
					slideChange: function () {
						mainSwpAutoIdx ();
					}
				}
			}
		}
		let mainSwp = new Swiper('.main-swiper-num01 .swiper-container', swpOpt);

		function mainSwpAutoIdx () {
			const mainSwpPagination = $('.main-swiper-num01').find('.swiper-pagination');
			const mainSwpLength = mainSwpPagination.find('.swiper-pagination-bullet').length;
			const mainSwpIdx = parseInt(mainSwpPagination.find('.swiper-pagination-bullet-active').index()) + 1 + ' / ' + mainSwpLength;
			mainSwpPagination.removeClass('swp-prs', function(){
				mainSwpPagination.attr('data-swp-idx', mainSwpIdx).addClass('swp-prs');
			});
		}
		mainSwpAutoIdx ();
	}
});