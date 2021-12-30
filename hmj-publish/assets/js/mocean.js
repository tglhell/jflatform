$(function () {
	const mcHeader = $('.hmj-header .header-outer');
	const scrIdxLst = $('.scr-idx-list a');
	const ftrCnt = $('.hmj-footer');
	const swpPos = $('.sample-swiper-num03 .swiper-slide').eq(0).offset().left - 80;
	if ($(window).width() > tbl) {
		scrItem = $('.scr-item, .hmj-footer');
	} else {
		scrItem = $('.scr-item');
	}

	scrItem.off().on('mousewheel DOMMouseScroll', function (e) {
		if (!$('html, body').is(':animated')) {
			if (e.originalEvent.wheelDelta < 0) {
				dirDown();
			} else {
				dirUp();
			}
		} else {
			e.stopPropagation();
			return false;
		}
	});

	scrIdxLst.on('click', function (e) {
		e.preventDefault();
		const scrIdxNum = $(this).parent().index();
		ftrCnt.removeClass('active');
		scrItem.removeClass('active');
		$('.scr-item:nth-child(-n + ' + (scrIdxNum + 1) + ')').addClass('active');
		scrItem.eq(scrIdxNum).addClass('active-idx').siblings().removeClass('active-idx');
		scrIdxLst.removeClass('active').parent().eq(scrIdxNum).find('a').addClass('active');
		if (!scrIdxNum == 0) {
			mcHeader.parent().addClass('header-fixed');
			mcHeader.parent().css('top', -mcHeader.height());
		} else {
			mcHeader.parent().removeClass('header-fixed');
			mcHeader.parent().css('top', '0');
		}
	});

	$('.btn-top-box').on('click', '.btn-top', function (e) {
		scrItem.eq(0).addClass('active-idx active').siblings().removeClass('active-idx active');
		scrIdxLst.removeClass('active').parent().eq(0).find('a').addClass('active');
		mcHeader.parent().removeClass('header-fixed').css('top', '0');
		$('.btn-top-box, .hmj-footer').removeClass('active');
	});

	$('.scr-item').swipe({
		swipe:function(event, direction) {
			switch(direction) {
				case 'up':
					dirDown();
					break;
				case 'down':
					dirUp();
					break;
				default:
					return;
			}
		}
	});

	$('.hmj-footer').scroll(function () {
		const footerPd = parseInt($('.hmj-footer.active').css('padding-top'));
		const footerPos = $(this).find('.footer-top').offset().top;
		if (footerPos >= footerPd && $(window).width() <= tbl) {
			setTimeout(function () {
				ftrCnt.removeClass('active');
			}, secVal[2]);
		}
	});

	function dirDown () { // up
		if (!$('.hmj-wrap').hasClass('active')) {
			$('.hmj-wrap').addClass('active');
			tScrIdx = $('.scr-item.active-idx').index();
			scrIdxCnt = $('.scr-idx-list a.active').parent().index();
			$('html, body').animate({'overflow':'visible'}, 1200, function () {
				$('.hmj-wrap').removeClass('active');
			});
			if (tScrIdx !== $(this.length)) {
				if (!$('.gall').hasClass('active-idx') || $(window).width() <= tbl) {
					scrItem.eq(tScrIdx + 1).addClass('active');
					scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
				}
			}
			if (!(scrIdxCnt + 1) == 0) {
				mcHeader.parent().addClass('header-fixed');
				mcHeader.parent().css('top', -mcHeader.height());
				$('.btn-top-box').addClass('active');
			}
			if ((tScrIdx + 1) == scrItem.length) {
				ftrCnt.addClass('active');
				setTimeout(function () {
					ftrCnt.stop().animate({ scrollTop: '1' }, '0');
				}, secVal[3]);
			}
			if ($('.gall').hasClass('active-idx')) {
				if ($('.scr-item.gall-chk').hasClass('end')) {
					$('.scr-item.gall-chk').removeClass('gall');
					scrItem.eq(tScrIdx + 1).addClass('active');
					scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
				}
			} else {
				$('.scr-item.gall-chk.active-idx').addClass('gall');
			}
			return false;
		}
	}
	function dirUp () { // down
		if (!$('.hmj-wrap').hasClass('active')) {
			$('.hmj-wrap').addClass('active');
			tScrIdx = $('.scr-item.active-idx').index();
			scrIdxCnt = $('.scr-idx-list a.active').parent().index();
			$('html, body').animate({'overflow':'visible'}, 1200, function () {
				$('.hmj-wrap').removeClass('active');
			});
			const thisPos = parseInt($('.sample-swiper-num03 .swiper-slide').eq(0).offset().left);
			if (!ftrCnt.hasClass('active')) {
				if (tScrIdx !== 0) {
					if (!$('.gall').hasClass('active-idx') || $(window).width() <= tbl) {
						scrItem.eq(tScrIdx).removeClass('active');
						scrItem.eq(tScrIdx - 1).addClass('active-idx').siblings().removeClass('active-idx');
						scrIdxLst.parent().eq(tScrIdx - 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
					}
				}
				if (scrIdxCnt == 1) {
					mcHeader.parent().removeClass('header-fixed');
					mcHeader.parent().css('top', '0');
					$('.btn-top-box').removeClass('active');
				}
				if ($('.gall').hasClass('active-idx')) {
					const inPos = $('.sample-swiper-num03 .swiper-slide').eq(0).offset().left;
					if (swpPos == inPos) {
						$('.scr-item.gall-chk').removeClass('gall');
						scrItem.eq(tScrIdx).removeClass('active');
						scrItem.eq(tScrIdx - 1).addClass('active-idx').siblings().removeClass('active-idx');
						scrIdxLst.parent().eq(tScrIdx - 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
					}
				} else {
					$('.scr-item.gall-chk').addClass('gall');
				}
				if ($('.scr-item.gall-chk').hasClass('end')) {
					if (endPos < thisPos) {
						$('.scr-item.gall-chk').removeClass('end');
					}
				}
				return false;
			}
			ftrCnt.removeClass('active');
		}
	}

	var txtBox = $('.text-box');
	var contH = $(txtBox).height();
	$(txtBox).css({height: '84px'});
	$('.txt-open').on('click', function(){
		$(txtBox).toggleClass('active');
		if(txtBox.hasClass('active')){
			$(txtBox).css({height: contH});
		}else{
			$(txtBox).css({height: '84px'});
		}
	});


	//동영상 제어
	function videoControls(){
		$('.video-box').each(function(){
			let controlBtn = $(this).find('.btn-play');
			let video = $(this).find('video');
			let thumb = $(this).find('.img-thumb');
			if (!$(this).hasClass('sep-m-p') || $(window).width() <= tbl) {	
				$(controlBtn).on('click', function(){
					$(controlBtn).fadeOut();
					$(thumb).fadeOut();
					$(video).get(0).play();
				});
				$(video).on('click', function(e){
					e.preventDefault();
					if($(video).get(0).paused){
						$(this).get(0).play();
						$(controlBtn).fadeOut();
					}else{
						$(this).get(0).pause();
						$(controlBtn).fadeIn();
					}
				});
				$(this).on('mousewheel DOMMouseScroll touchmove', function(){
					$(controlBtn).fadeIn(500);
					$(thumb).fadeIn(500);
					$(video).get(0).pause();
				});
			}else{
				$(video).get(0).play();
				$(window).on('mousewheel DOMMouseScroll', function(){
					if ($('.section1').parent().hasClass('active-idx')){
						$(video).get(0).play();
					} else{
						$(video).get(0).pause();
					}
				});
			}
		});
	}
	videoControls();

	$(window).on('resize',function(){
		videoControls();
	});


	if ($('.sample-swiper-num03').length == 1) {
		let swpOpt = {},
		slideLength = $('.sample-swiper-num03 .swiper-slide').length;
		if (slideLength == 1) {
			swpOpt = {
				allowSlidePrev: false,
				allowSlideNext: false,
				simulateTouch: false
			}
			$('.sample-swiper-num03 [class*="swiper-button"]').hide();
		} else {
			swpOpt = {
				pagination: {
					el: '.sample-swiper-num03 .swiper-pagination',
					clickable: true,
				},
				freeMode: true,
				mousewheel: {
					releaseOnEdges: true,
					sensitivity: 2,
				},
				simulateTouch: true,
				speed: 500,
				loop: false,
				spaceBetween: 0,
				observer: true,
				observeParents: true,
				slidesPerView: 'auto',
			}
		}
		let sampleSwp3 = new Swiper('.sample-swiper-num03 .swiper-container', swpOpt);

		sampleSwp3.on('reachEnd', function(){
			setTimeout(function () {
				endPos = parseInt($('.sample-swiper-num03 .swiper-slide').eq(0).offset().left);
			}, secVal[6]);
			$('.scr-item.gall-chk').addClass('end');
			$('.scr-item.gall-chk').removeClass('gall');
		});
	}
});