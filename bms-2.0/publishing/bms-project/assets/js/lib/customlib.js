Date.prototype.calculate = function (str) {
  const opt = (str + '').charAt(0) === '+' ? 1 : -1;
  const value = parseInt((str + '').replace(/[^0-9]/gi, ''));
  switch ((str + '').charAt(str.length - 1).toLowerCase()) {
    case 'd':
      this.setDate(this.getDate() + opt * value);
      break;
    case 'm':
      this.setMonth(this.getMonth() + opt * value);
      break;
    case 'y':
      this.setFullYear(this.getFullYear() + opt * value);
      break;
  }

  return this;
}

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
    , beforeShow: function(input){
      const i_offset = $(input).offset();
      setTimeout(function(){
        $('#ui-datepicker-div').css({"top":i_offset.top + 54});
      })
    }
  });

  //input을 datepicker로 선언
  $('.date-picker').each((idx, dp) => {
    const $dp = $(dp);
    const datePickerOpt = {
      onSelect : function() {
        if( $('.date-picker table').find('.ui-datepicker-current-day')){
          // $('.date-picker table').find('.ui-datepicker-today').removeClass('ui-datepicker-today');
        }

      },
    };
    if ($dp.data('minDate') !== undefined) datePickerOpt.minDate = new Date().calculate($dp.data('minDate'));
    if ($dp.data('maxDate') !== undefined) datePickerOpt.maxDate = new Date().calculate($dp.data('maxDate'));

    console.log(datePickerOpt);
    $dp.datepicker(datePickerOpt);
console.log(new Date().calculate('+30d'))
  });

  //From의 초기값을 오늘 날짜로 설정
  // $('#datepicker').datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
  //To의 초기값을 내일로 설정
  // $('#datepicker2').datepicker('setDate', '+1D'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)

  carouselType1();
  carouselType2();
  carouselType3();
  carouselType4();
});

jQuery.event.add(window, 'load', function () {
  // masonry
  if($('.masonry').length !== 0) {
    $('.masonry .grid').masonry({
      itemSelector: '.grid-item',
      // columnWidth: '.grid-sizer',
      gutter: 15,
      percentPosition: true,
      horizontalOrder: true
    });
  }

  const outerW = $('.tab-carousel').innerWidth() - 172;
  const innerW = ($('.tab-carousel .tab-box-list li').width() + 32) * $('.tab-carousel .tab-box-list li').length;
  // const innerW = ($('.tab-carousel .tab-box-list').innerWidth());
  console.log('content :' + outerW);
  console.log('ul : ' + innerW);

  if(innerW >= outerW){
    tabCarousel();
    $('.tab-carousel').removeClass('minitab');
  }
  else {
    $('.tab-carousel').addClass('minitab');
  }
});

// Carousel
// carousel-type1
function carouselType1(){
  if($('.carousel-type1').length > 0) {
    const carouselType1 = new Swiper('.carousel-type1 .slide-swiper', {
      // Optional parameters
      direction: 'horizontal',

      //pagination
      pagination: {
        el: ".carousel-type1 .swiper-pagination",
        type: "fraction",
      },

      // Navigation arrows
      navigation: {
        nextEl: '.carousel-type1 .swiper-button-next',
        prevEl: '.carousel-type1 .swiper-button-prev',
      },
    });
  }
}

// carousel-type2
function carouselType2(){
  if($('.carousel-type2').length > 0) {
    if (window.matchMedia("(min-width: 1281px)").matches) {
      const carouselType2 = new Swiper('.carousel-type2 .slide-swiper', {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: "4",
        spaceBetween: 30,

        // Navigation arrows
        navigation: {
          nextEl: '.carousel-type2 .swiper-button-next',
          prevEl: '.carousel-type2 .swiper-button-prev',
        },
      });
    } else {
      const carouselType2Mediaquery = new Swiper('.carousel-type2 .slide-swiper', {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: "3",
        spaceBetween: 30,

        // Navigation arrows
        navigation: {
          nextEl: '.carousel-type2 .swiper-button-next',
          prevEl: '.carousel-type2 .swiper-button-prev',
        },
      });
    }
  }
}
$(window).on('resize', function(){
  carouselType2();
});

// carousel-type3
function carouselType3(){
  if($('.carousel-type3').length > 0) {
    if (window.matchMedia("(min-width: 1281px)").matches) {
      const carouselType2 = new Swiper('.carousel-type3 .slide-swiper', {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: "5",
        spaceBetween: 30,

        // Navigation arrows
        navigation: {
          nextEl: '.carousel-type3 .swiper-button-next',
          prevEl: '.carousel-type3 .swiper-button-prev',
        },
      });
    } else {
      const carouselType2Mediaquery = new Swiper('.carousel-type3 .slide-swiper', {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: "4",
        spaceBetween: 30,

        // Navigation arrows
        navigation: {
          nextEl: '.carousel-type3 .swiper-button-next',
          prevEl: '.carousel-type3 .swiper-button-prev',
        },
      });
    }
  }
}
$(window).on('resize', function(){
  carouselType3();
});

function carouselType4(){
  if($('.carousel-type4').length > 0) {
    const carouselType4 = new Swiper('.carousel-type4 .slide-swiper', {
      // Optional parameters
      direction: 'horizontal',
      autoHeight: true,

      //pagination
      pagination: {
        el: ".carousel-type4 .swiper-pagination",
        type: "fraction",
      },

      // Navigation arrows
      navigation: {
        nextEl: '.carousel-type4 .swiper-button-next',
        prevEl: '.carousel-type4 .swiper-button-prev',
      },
    });
  }
}

function tabCarousel(){
  if($('.tab-carousel').length > 0) {
    const  tabCarousel = new Swiper('.tab-carousel .slide-swiper', {
      // Optional parameters
      slidesPerView: "auto",
      direction: 'horizontal',


      //pagination
      pagination: {
        el: ".tab-carousel .swiper-pagination",
        type: "fraction",
      },

      // Navigation arrows
      navigation: {
        nextEl: '.tab-carousel .swiper-button-next',
        prevEl: '.tab-carousel .swiper-button-prev',
      },
    });
  }
}
