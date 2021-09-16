$(function () {
	//모든 datepicker에 대한 공통 옵션 설정
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
		, showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
		, showMonthAfterYear: true //년도 먼저 나오고, 뒤에 월 표시
		, changeYear: true //콤보박스에서 년 선택 가능
		, changeMonth: true //콤보박스에서 월 선택 가능                
		, showOn: "button" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
		, buttonImage: "../assets/images/common/ico_calendar.svg" //버튼 이미지 경로
		, buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
		, buttonText: "달력 선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
		//, yearSuffix: "년" //달력의 년도 부분 뒤에 붙는 텍스트
		, monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] //달력의 월 부분 텍스트
		, monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] //달력의 월 부분 Tooltip 텍스트
		, dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'] //달력의 요일 부분 텍스트
		, dayNames: ['日', '月', '火', '水', '木', '金', '土'] //달력의 요일 부분 Tooltip 텍스트
		// , minDate: "-1D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
		//, maxDate: "+1M" //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)                    
	});

	//input을 datepicker로 선언
	$('.date-picker').datepicker();

	//From의 초기값을 오늘 날짜로 설정
	// $('#datepicker').datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
	//To의 초기값을 내일로 설정
	// $('#datepicker2').datepicker('setDate', '+1D'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
	
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
			}, secVal[4]);
		});
	}


	//사양백과 리스트
	if ($('.gallery-list1').length == 1) {
		let swpOpt = {};
		let slideLength = $('.gallery-list1 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.gallery-list1 [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.gallery-list1 .swiper-button-next',
					prevEl: '.gallery-list1 .swiper-button-prev',
				},
				pagination: {
					el: '.gallery-list1 .swiper-pagination',
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
		let galleryList1 = new Swiper('.gallery-list1 .swiper-container', swpOpt);
	}

	if ($('.gallery-list2').length == 1) {
		let swpOpt = {};
		let slideLength = $('.gallery-list2 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.gallery-list2 [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.gallery-list2 .swiper-button-next',
					prevEl: '.gallery-list2 .swiper-button-prev',
				},
				pagination: {
					el: '.gallery-list2 .swiper-pagination',
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
		let galleryList2 = new Swiper('.gallery-list2 .swiper-container', swpOpt);
	}

	//사양백과 팝업
	if ($('.gallery-list3').length == 1) {
		let swpOpt = {};
		let slideLength = $('.gallery-list3 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.gallery-list3 [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.gallery-list3 .swiper-button-next',
					prevEl: '.gallery-list3 .swiper-button-prev',
				},
				pagination: {
					el: '.gallery-list3 .swiper-pagination',
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
		let galleryList3 = new Swiper('.gallery-list3 .swiper-container', swpOpt);		
	};

	//Shop Main
	if ($('.shop-visual').length == 1) {
		let swpOpt = {},
		slideLength = $('.shop-visual .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.shop-visual .control-area').hide();
		} else {
			swpOpt = {
				navigation: {
					nextEl: '.shop-visual .swiper-button-next',
					prevEl: '.shop-visual .swiper-button-prev',
				},
				pagination: {
					el: '.shop-visual .swiper-pagination',
					clickable: true,
					type: 'custom',
					renderCustom : function(t,e,a){ function n(t) {
						return t<10?"0" + t.toString():t.toString()
					}
						return'<span class="swiper-page-current">'+ n(e) + 
						'</span><div class="bar-progress"><span class="bar-ing"></span></div><span class="swiper-page-total">' + n(a) + 
						'</span>'
					}
				},
				simulateTouch: true,
				speed: 300,
				loop: true,
				spaceBetween: 0,
				observer: true,
				observeParents: true,
				autoplay: {
					delay: 3000,
				},
				paginationClickable: true,
				autoplayDisableOnInteraction: true,
			}
		}
		let shopMainSlide = new Swiper('.shop-visual .swiper-container', swpOpt);

		$(".shop-visual .swiper-control").on('click', function(){
			if ($('.swiper-control').hasClass('stop')) {
				shopMainSlide.autoplay.start();
				$(this).removeClass('stop').text('Play');
				$('.bar-ing').show();
			} else {
				shopMainSlide.autoplay.stop()
				$(this).addClass('stop').text('Stop');
				$('.bar-ing').hide();
			}
		});
	};

	//curation-list
	if ($(window).width() < tbl) {
		let swpOpt = {},
		slideLength = $('.shop-visual .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.curation-list [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				pagination: {
					el: '.curation-list .swiper-pagination',
					clickable: true,
				},
				// slidesPerView: 'auto',
				// centeredSlides: true,
				simulateTouch: true,
				speed: 300,
				loop: false,
				spaceBetween: 20,
				observer: true,
				observeParents: true,
			}
		}
		let curationSlide = new Swiper('.curation-list .swiper-container', swpOpt);
	};

	//Shop Detail Thumb
	if ($('.thumb-slide').length == 1) {
		let swpOpt = {},
		slideLength = $('.thumb-slide .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.thumb-slide [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					spaceBetween: 8,
					slidesPerView: 4,
					navigation: {
						nextEl: '.thumb-slide .swiper-button-next',
						prevEl: '.thumb-slide .swiper-button-prev',
					},
					
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			} else {
				swpOpt = {
					spaceBetween: 0,
					navigation: {
						nextEl: '.thumb-slide .swiper-button-next',
						prevEl: '.thumb-slide .swiper-button-prev',
					},
					pagination: {
						el: '.thumb-slide .swiper-pagination',
						clickable: true,
					},
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			}
		}
		var goodsThumb = new Swiper('.thumb-slide .swiper-container', swpOpt);
	};

	//Shop Sub Main
	// if ($('.select-thumb').length == 1) {
	// 	let swpOpt = {},
	// 	slideLength = $('.select-thumb .swiper-slide').length;
	// 	if (slideLength == 1) {
	// 		swpOpt = {
	// 			allowSlidePrev: false,
	// 			allowSlideNext: false,
	// 			simulateTouch: false
	// 		}
	// 		$('.select-thumb [class*="swiper-button"]').hide();
	// 	} else {
	// 		if ($(window).width() > tbl) {
	// 			//pc
	// 			swpOpt = {
	// 				thumbs: {
	// 					swiper: goodsThumb
	// 				},
	// 				speed: 100,
	// 				cssMode: true,
	// 				mousewheel: true,
	// 				keyboard: true,
	// 				observer: true,
	// 				observeParents: true,
	// 			}
	// 		} else {
	// 			$('.select-thumb').hide();
	// 		}
	// 	}
	// 	let selectedThumb = new Swiper('.select-thumb .swiper-container', swpOpt);
	// };

	// my Main 
	function listCarSwp () {
		let ww = $(window).width();
		chkSwpBool = false;
		if (!chkSwpBool) {
			if (ww <= tbl) {				
				if ($('.list-my-car').length == 1) {
					let swpOpt = {},
					slideLength = $('.list-my-car .swiper-slide').length;
					if (slideLength == 1) {
						swpOpt = {
							allowSlidePrev: false,
							allowSlideNext: false,
							simulateTouch: false
						}
						$('.list-my-car [class*="swiper-button"]').hide();
					} else {
						swpOpt = {
							navigation: {
								nextEl: '.list-my-car .swiper-button-next',
								prevEl: '.list-my-car .swiper-button-prev',
							},
							pagination: {
								el: '.list-my-car .swiper-pagination',
								clickable: true,
							},
							autoHeight: true,
							slidesPerView: 'auto',
							// centeredSlides: true,
							simulateTouch: true,
							speed: 300,
							loop: false,
							spaceBetween: 0,
							observer: true,
							observeParents: true,
						}
					}
					let listMyCar = new Swiper('.list-my-car .swiper-container', swpOpt);
					chkSwpBool = true;
				}
			} else {
				
			}
		}
	}
	listCarSwp ();

	$(window).on('resize', function() {
		if (!chkSwpBool) {
			listCarSwp ();
		}
	});
});