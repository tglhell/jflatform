$(function () {
  //모든 datepicker에 대한 공통 옵션 설정
  $.datepicker.setDefaults({
    dateFormat: 'mm.dd.yy' //Input Display Format 변경
    , showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
    , showMonthAfterYear: false //년도 먼저 나오고, 뒤에 월 표시
    , changeYear: false //콤보박스에서 년 선택 가능
    , changeMonth: false //콤보박스에서 월 선택 가능
    //, showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시
    //, buttonImage: "../../assets/images/common/ico_calendar.svg" //버튼 이미지 경로
    , buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
    , buttonText: "캘린더 선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트
    // , yearSuffix: "." //달력의 년도 부분 뒤에 붙는 텍스트
    , monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] //달력의 월 부분 텍스트
    , monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] //달력의 월 부분 Tooltip 텍스트
    , dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] //달력의 요일 부분 텍스트
    , dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S']//달력의 요일 부분 Tooltip 텍스트
    // , minDate: "-1D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
    //, maxDate: "+1M" //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
  });

  //input을 datepicker로 선언
  $('.date-picker').datepicker();
  $('.date-picker').datepicker({
    onSelect : function() {
      if( $('.date-picker table').find('.ui-datepicker-current-day')){
        // $('.date-picker table').find('.ui-datepicker-today').removeClass('ui-datepicker-today');
      }

    }
  });

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
        slideLength = $('.curation-list .swiper-slide').length;
    if (slideLength == 1) {
      swpOpt = {
        allowSlidePrev: false,
        allowSlideNext: false,
        simulateTouch: false
      }
      $('.curation-list .swiper-pagination').hide();
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
      if ($(window).width() > tbl) {
        //pc
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false,
          spaceBetween: 16,
          slidesPerView: 5
        }
      } else {
        //mo
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false,
          spaceBetween: 0
        }
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
      if ($(window).width() < tbl) {//mo
        $('.detail-thumb').hide();
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
      if ($(window).width() > tbl) {
        //pc
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false,
          slidesPerView: 5,
          spaceBetween: 40
        }
      } else {
        //mo
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false,
          spaceBetween: 16,
          slidesPerView: 'auto'
        }
      }
      $('.recommend .swiper-control').hide();
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
          if (slideLength <= 1) {
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
              centeredSlides: true,
              simulateTouch: true,
              speed: 300,
              loop: false,
              spaceBetween: 0,
              observer: true,
              autoHeight:true,
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

  //브랜드거점
  let branchLen = $('.brand-branch .branch-list > li').length;

  for (var i = 0; i < branchLen+1; i++) {
    let branchSwp = $('.branch-swp').eq(i);
    if (branchSwp.children('.list').length == 1) {
      let swpOpt = {},
          slideLength = branchSwp.children('.list').find('.swiper-slide').length;
      if (slideLength == 1) {
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false
        }
        branchSwp.find('.list [class*="swiper-button"]').hide();
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
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
          }
        } else {
          //mo
          swpOpt = {
            spaceBetween: 0,
            pagination: {
              el: branchSwp.find('.swiper-pagination'),
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
      var brandThumbList = new Swiper(branchSwp.find('.list .swiper-container'), swpOpt);
    };

    if (branchSwp.find('.thumb').length == 1) {
      let swpOpt = {},
          slideLength = branchSwp.find('.thumb .swiper-slide').length;
      if (slideLength == 1) {
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false,
        }
        branchSwp.find('.thumb [class*="swiper-button"]').hide();
      } else {
        if ($(window).width() > tbl) {
          //pc
          swpOpt = {
            thumbs: {
              swiper: brandThumbList
            },
            pagination: {
              el: branchSwp.find('.thumb .swiper-pagination'),
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
              el: branchSwp.find('.thumb .swiper-pagination'),
              clickable: true,
              type: 'progressbar'
            },
            navigation: {
              nextEl: branchSwp.find('.swiper-button-next'),
              prevEl: branchSwp.find('.swiper-button-prev'),
            }
          }
        }
      }
      let brandDetailThumb = new Swiper(branchSwp.find('.thumb .swiper-container'), swpOpt);
    };
  }

  //brand story
  if ($('.brand-story').length == 1) {
    let swpOpt = {},
        slideLength = $('.brand-story .swiper-slide').length;
    if (slideLength == 1) {
      swpOpt = {
        allowSlidePrev: false,
        allowSlideNext: false,
        simulateTouch: false
      }
      $('.brand-story [class*="swiper-button"]').hide();
    } else {
      swpOpt = {
        navigation: {
          nextEl: '.brand-story .swiper-button-next',
          prevEl: '.brand-story .swiper-button-prev',
        },
        slidesPerView: '4',
        simulateTouch: true,
        speed: 300,
        loop: true,
        observer: true,
        observeParents: true,
        slidesOffsetBefore: 0,
      }
    }
    let sampleSwp = new Swiper('.brand-story .swiper-container', swpOpt);
  }

  //사양백과 리스트
  $('.gallery-list').each(function(){
    if ($(this).length == 1) {
      let swpOpt = {};
      let slideLength = $(this).find('.swiper-slide').length;
      if (slideLength == 1) {
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false
        }
        $(this).find('[class*="swiper-button"]').hide();
      } else {
        let _pcNon;
        if($(this).hasClass('swiper-pc-non')){
          _pcNon = false;
        }else{
          _pcNon = true;
        }
        swpOpt = {
          navigation: {
            nextEl: $(this).find('.swiper-button-next'),
            prevEl: $(this).find('.swiper-button-prev'),
          },
          pagination: {
            el: $(this).find('.swiper-pagination'),
            clickable: true,
          },
          simulateTouch: true,
          speed: 300,
          loop: false,
          spaceBetween: 0,
          observer: true,
          observeParents: true,
          watchOverflow : true,
          allowTouchMove : true,
          autoPlay: false,
          breakpoints:{
            1120:{
              allowTouchMove : _pcNon,
            }
          }
        }
      }
      let galleryList = new Swiper($(this).find('.swiper-container'), swpOpt);

      $(window).on('resize',function(){
        galleryList.slideTo(0, 0, false);
      });
    }
  });

  $('.subsidy-swiper').each(function(){
    if ($(this).length == 1) {
      let swpOpt = {};
      let slideLength = $(this).find('.swiper-slide').length;
      if (slideLength == 1) {
        swpOpt = {
          allowSlidePrev: false,
          allowSlideNext: false,
          simulateTouch: false,
          centeredSlides : true,
        }
        $(this).find('[class*="swiper-button"]').hide();
      } else {
        let _view;
        if($(window).width() > tbl){
          _view = 2;
        }else{
          _view = 1;
        }
        swpOpt = {
          navigation: {
            nextEl: $(this).find('.swiper-button-next'),
            prevEl: $(this).find('.swiper-button-prev'),
          },
          pagination: {
            el: $(this).find('.swiper-pagination'),
            clickable: true,
          },
          simulateTouch: true,
          speed: 300,
          loop: false,
          spaceBetween: 0,
          observer: true,
          observeParents: true,
          watchOverflow : true,
          allowTouchMove : true,
          autoPlay: false,
          breakpoints:{
            1120:{
              slidesPerView : _view,
            }
          }
        }
      }
      let subsidySwiper = new Swiper($(this).find('.swiper-container'), swpOpt);
    }
  });
});