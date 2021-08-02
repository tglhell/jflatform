$(function () {
	//모든 datepicker에 대한 공통 옵션 설정
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
		, showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
		, showMonthAfterYear: true //년도 먼저 나오고, 뒤에 월 표시
		, changeYear: true //콤보박스에서 년 선택 가능
		, changeMonth: true //콤보박스에서 월 선택 가능                
		, showOn: "button" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
		, buttonImage: "../assets/images/common/@ico_calendar.png" //버튼 이미지 경로
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
		let swpOpt = {},
		slideLength = $('.gallery-list1 .swiper-slide').length;
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
		let sampleSwp = new Swiper('.gallery-list1 .swiper-container', swpOpt);
		
		sampleSwp.on('reachEnd', function(){
			setObj(function(){
				$('.btn-close-popup').trigger('click');
			}, secVal[4]);
		});
	}

	if ($('.gallery-list2').length == 1) {
		let swpOpt = {},
		slideLength = $('.gallery-list2 .swiper-slide').length;
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
		let sampleSwp = new Swiper('.gallery-list2 .swiper-container', swpOpt);
		
		sampleSwp.on('reachEnd', function(){
			setObj(function(){
				$('.btn-close-popup').trigger('click');
			}, secVal[4]);
		});
	}

	//사양백과 팝업
	if ($('.gallery-list3').length == 1) {
		let swpOpt = {},
		slideLength = $('.gallery-list3 .swiper-slide').length;
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
		let sampleSwp = new Swiper('.gallery-list3 .swiper-container', swpOpt);
		
		sampleSwp.on('reachEnd', function(){
			setObj(function(){
				$('.btn-close-popup').trigger('click');
			}, secVal[4]);
		});
	}
});