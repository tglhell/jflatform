$(function () {
	//모든 datepicker에 대한 공통 옵션 설정
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
		, showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
		, showMonthAfterYear: true //년도 먼저 나오고, 뒤에 월 표시
		, changeYear: false //콤보박스에서 년 선택 가능
		, changeMonth: false //콤보박스에서 월 선택 가능                
		, showOn: "button" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
		, buttonImage: "../../assets/images/common/ico_calendar.svg" //버튼 이미지 경로
		, buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
		, buttonText: "달력 선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
		, yearSuffix: "." //달력의 년도 부분 뒤에 붙는 텍스트
		, monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] //달력의 월 부분 텍스트
		, monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] //달력의 월 부분 Tooltip 텍스트
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
	if ($(window).width() <= tbl) { //only mo
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
				simulateTouch: true,
				speed: 300,
				loop: false,
				spaceBetween: 20,
				observer: true,
				observeParents: true,
				autoHeight: true
			}
		}
		let curationSlide = new Swiper('.curation-list .swiper-container', swpOpt);		
	};

	//Shop thumb-list
	if ($('.thumb-list').length == 1) {
		let swpOpt = {},
		slideLength = $('.thumb-list .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.thumb-list [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					spaceBetween: 16,
					slidesPerView: 5,
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			} else {
				//mo
				swpOpt = {
					spaceBetween: 0,
					pagination: {
						el: '.thumb-list .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			}
		}
		var thumbList = new Swiper('.thumb-list .swiper-container', swpOpt);
	};

	//Shop detail-thumb
	if ($('.detail-thumb').length == 1) {
		let swpOpt = {},
		slideLength = $('.detail-thumb .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.detail-thumb [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					thumbs: {
						swiper: thumbList
					},
					pagination: {
						el: '.detail-thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					speed: 100,
					cssMode: true,
					mousewheel: true,
					keyboard: true,
					observer: true,
					observeParents: true,
				}
			} else {
				$('.detail-thumb').hide();
			}
		}
		let detailThumb = new Swiper('.detail-thumb .swiper-container', swpOpt);
	};

	//Shop recommend
	if ($('.recommend').length == 1) {
		let swpOpt = {};
		let slideLength = $('.recommend .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.recommend [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					spaceBetween: 40,
					slidesPerView: 5,
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true,
					navigation: {
						nextEl: '.recommend .swiper-button-next',
						prevEl: '.recommend .swiper-button-prev',
					},
				}
			} else {
				//mo
				swpOpt = {
					spaceBetween: 16,
					slidesPerView: 'auto',
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			}
		}
		let recommend = new Swiper('.recommend .swiper-container', swpOpt);		
	};

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

				if($('.main-banner.type01').length ==1) {
					let swpOpt = {},
					slideLength = $('.main-banner.type01 .swiper-slide').length;
					if (slideLength == 1) {
						swpOpt = {
							allowSlidePrev: false,
							allowSlideNext: false,
							simulateTouch: false
						}
						$('.main-banner.type01 [class*="swiper-button"]').hide();
					} else {
						swpOpt = {
							navigation: {
								nextEl: '.main-banner.type01 .swiper-button-next',
								prevEl: '.main-banner.type01 .swiper-button-prev',
							},
							pagination: {
								el: '.main-banner.type01 .swiper-pagination',
								clickable: true,
							},
							slidesPerView: 'auto',
							// centeredSlides: true,
							simulateTouch: true,
							speed: 300,
							loop: false,
							spaceBetween: 8,
							observer: true,
							observeParents: true,
						}
					}
					let listBanner01 = new Swiper('.main-banner.type01 .swiper-container', swpOpt);
					chkSwpBool = true;
				}

				if($('.main-banner.type02').length == 1) {
					let swpOpt = {},
					slideLength = $('.main-banner.type02 .swiper-slide').length;
					if (slideLength == 1) {
						swpOpt = {
							allowSlidePrev: false,
							allowSlideNext: false,
							simulateTouch: false
						}
						$('.main-banner.type02 [class*="swiper-button"]').hide();
					} else {
						swpOpt = {
							navigation: {
								nextEl: '.main-banner.type02 .swiper-button-next',
								prevEl: '.main-banner.type02 .swiper-button-prev',
							},
							pagination: {
								el: '.main-banner.type02 .swiper-pagination',
								clickable: true,
							},
							slidesPerView: 'auto',
							// centeredSlides: true,
							simulateTouch: true,
							speed: 300,
							loop: false,
							spaceBetween: 8,
							observer: true,
							observeParents: true,
						}
					}
					let listBanner01 = new Swiper('.main-banner.type02 .swiper-container', swpOpt);
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

	// 이벤트
	if ($('.event-banner-swiper').length == 1) {
        let swpOpt = {},
        slideLength = $('.event-banner-swiper .swiper-slide').length;
        if (slideLength == 1) {
            swpOpt = {
                allowSlidePrev: false,
                allowSlideNext: false,
                simulateTouch: false
            }
            $('.event-banner-swiper [class*="swiper-button"]').hide();
        } else {
            let _gap ;
            if ($(window).width() > tbl) {
                _gap = 80;
            } else{
                _gap = 0;
            }
            swpOpt = {
                navigation: {
                    nextEl: '.event-banner-swiper .swiper-button-next',
                    prevEl: '.event-banner-swiper .swiper-button-prev',
                },
                pagination: {
                    el: '.event-banner-swiper .swiper-pagination',
                    clickable: true,
                },
                // slidesPerView: 'auto',
                // centeredSlides: true,
                simulateTouch: true,
                speed: 300,
                loop: true,
                spaceBetween: _gap,
                observer: true,
                observeParents: true,
                autoplay: true,
                delay: 5000,
            }
        }
        let eventBannerSwiper = new Swiper('.event-banner-swiper .swiper-container', swpOpt);
    }

	// manin brand
	if ($('.brand-list-cont').length == 1) {
		let swpOpt = {};
		let _gap;
		if ($(window).width() > tbl) {
			_gap = 32;
		} else{
			_gap = 16;
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
			loop: false,
			spaceBetween: _gap,
			observer: true,
			observeParents: true,
		}
		let galleryList1 = new Swiper('.brand-list-cont .swiper-container', swpOpt);
	}

	//브랜드거점
	if ($('.branch-swp01 .list').length == 1) {
		let swpOpt = {},
		slideLength = $('.branch-swp01 .list .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.branch-swp01 .list [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					spaceBetween: 32,
					slidesPerView: 3,
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true,
				}
			} else {
				//mo
				swpOpt = {
					spaceBetween: 0,
					pagination: {
						el: '.branch-swp01 .list .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true,
				}
			}
		}
		var brandThumbList = new Swiper('.branch-swp01 .list .swiper-container', swpOpt);
	};

	if ($('.branch-swp01 .thumb').length == 1) {
		let swpOpt = {},
		slideLength = $('.branch-swp01 .thumb .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false,
			}
			$('.branch-swp01 .thumb [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					thumbs: {
						swiper: brandThumbList
					},
					pagination: {
						el: '.branch-swp01 .thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					speed: 100,
					cssMode: true,
					mousewheel: true,
					keyboard: true,
					observer: true,
					observeParents: true,
					navigation: false
				}
			} else {
				//mo
				swpOpt = {
					pagination: {
						el: '.branch-swp01 .thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					navigation: {
						nextEl: '.branch-swp01 .swiper-button-next',
						prevEl: '.branch-swp01 .swiper-button-prev',
					}
				}
				$('.branch-swp01 thumb').hide();
			}
		}
		let brandDetailThumb = new Swiper('.branch-swp01 .thumb .swiper-container', swpOpt);
	};


	if ($('.branch-swp02 .list').length == 1) {
		let swpOpt = {},
		slideLength = $('.branch-swp02 .list .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.branch-swp02 .list [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					spaceBetween: 32,
					slidesPerView: 3,
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			} else {
				//mo
				swpOpt = {
					spaceBetween: 0,
					pagination: {
						el: '.branch-swp02 .list .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			}
		}
		var brandThumbList = new Swiper('.branch-swp02 .list .swiper-container', swpOpt);
	};

	if ($('.branch-swp02 .thumb').length == 1) {
		let swpOpt = {},
		slideLength = $('.branch-swp02 .thumb .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.branch-swp02 .thumb [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					thumbs: {
						swiper: brandThumbList
					},
					pagination: {
						el: '.branch-swp02 .thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					speed: 100,
					cssMode: true,
					mousewheel: true,
					keyboard: true,
					observer: true,
					observeParents: true,
					navigation:false
				}
			} else {
				swpOpt = {
					pagination: {
						el: '.branch-swp02 .thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					navigation: {
						nextEl: '.branch-swp02 .swiper-button-next',
						prevEl: '.branch-swp02 .swiper-button-prev',
					}
				}
				$('.branch-swp02 thumb').hide();
			}
		}
		let brandDetailThumb = new Swiper('.branch-swp02 .thumb .swiper-container', swpOpt);
	};


	if ($('.branch-swp03 .list').length == 1) {
		let swpOpt = {},
		slideLength = $('.branch-swp03 .list .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.branch-swp03 .list [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					spaceBetween: 32,
					slidesPerView: 3,
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true,
					
				}
			} else {
				//mo
				swpOpt = {
					spaceBetween: 0,
					pagination: {
						el: '.branch-swp03 .list .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					simulateTouch: true,
					speed: 300,
					loop: false,
					observer: true,
					observeParents: true
				}
			}
		}
		var brandThumbList = new Swiper('.branch-swp03 .list .swiper-container', swpOpt);
	};

	if ($('.branch-swp03 .thumb').length == 1) {
		let swpOpt = {},
		slideLength = $('.branch-swp03 .thumb .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.branch-swp03 .thumb [class*="swiper-button"]').hide();
		} else {
			if ($(window).width() > tbl) {
				//pc
				swpOpt = {
					thumbs: {
						swiper: brandThumbList
					},
					pagination: {
						el: '.branch-swp03 .thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					speed: 100,
					cssMode: true,
					mousewheel: true,
					keyboard: true,
					observer: true,
					observeParents: true,
					navigation:false
				}
			} else {
				swpOpt = {
					pagination: {
						el: '.branch-swp03 .thumb .swiper-pagination',
						clickable: true,
						type: 'progressbar'
					},
					navigation: {
						nextEl: '.branch-swp03 .swiper-button-next',
						prevEl: '.branch-swp03 .swiper-button-prev',
					}
				}
				$('.branch-swp03 thumb').hide();
			}
		}
		let brandDetailThumb = new Swiper('.branch-swp03 .thumb .swiper-container', swpOpt);
	};
});