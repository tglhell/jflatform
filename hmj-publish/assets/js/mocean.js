$(function () {
	const mcHeader = $('.hmj-header .header-outer');
	const scrIdxLst = $('.scr-idx-list a');
	const ftrCnt = $('.hmj-footer');
	if ($(window).width() > tbl) {
		scrItem = $('.scr-item, .hmj-footer');
	} else {
		scrItem = $('.scr-item');
	}

	scrItem.on('mousewheel DOMMouseScroll', function (e) {
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
			setObj(function () {
				ftrCnt.removeClass('active');
			}, secVal[2]);
		}
	});

	function dirDown () { // up
		tScrIdx = $('.scr-item.active-idx').index();
		scrIdxCnt = $('.scr-idx-list a.active').parent().index();
		$('html, body').stop().animate({'overflow':'visible'}, secVal[3]);
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
		}
		if ((tScrIdx + 1) == scrItem.length) {
			ftrCnt.addClass('active');
			setObj(function () {
				ftrCnt.stop().animate({ scrollTop: '1' }, '0');
			}, secVal[3]);
		}
		return false;
	}
	function dirUp () { // down
		tScrIdx = $('.scr-item.active-idx').index();
		scrIdxCnt = $('.scr-idx-list a.active').parent().index();
		$('html, body').stop().animate({'overflow':'visible'}, secVal[3]);
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
			}
			if (!$('.scr-item.gall-chk').hasClass('gall')) {
				$('.scr-item.gall-chk').addClass('gall');
			}
			return false;
		}
		ftrCnt.removeClass('active');
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


	function videoControls(){
		$('.video-box').each(function(){
			var controlBtn = $(this).find('.btn-play');
			var video = $(this).find('video');
			var thumb = $(this).find('.img-thumb');
			if (!$(this).hasClass('sep-m-p') || $(window).width() <= tbl) {	
				$(controlBtn).on('click', function(){
					$(controlBtn).fadeOut();
					$(thumb).fadeOut();
					$(video).get(0).play();
				});
				$(video).on('click', function(e){
					e.preventDefault();
					$(video).get(0).pause();
					$(controlBtn).fadeToggle();
				});
				$(this).on('mousewheel DOMMouseScroll', function(){
					$(controlBtn).fadeIn();
					$(thumb).fadeIn();
					$(video).get(0).pause();
				});
			}else{
				$(video).get(0).play();
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
		
		sampleSwp3.on('reachBeginning', function(){
			setObj(function(){
				$('.scr-item.gall-chk').removeClass('gall');
			}, secVal[0]);
		});

		sampleSwp3.on('reachEnd', function(){
			setObj(function(){
				$('.scr-item.gall-chk').removeClass('gall');
			}, secVal[0]);
		});
	}
});