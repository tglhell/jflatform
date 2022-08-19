$(function(){
	let listTabWrap = $('.cp-download-center__model-list-wrap');
	let listTabOuter = $('.cp-download-center__model-list-outer');
	let listTabBtn = listTabWrap.find('.cp-download-center__list-btn');
	let listTabParent = $('.cp-download-center__model-list-item');
	let listTabParentLength = listTabParent.length;
	let moveSlideWid = 0; let num = 0; let minLength = 4;
	let listTabCont = $('.cp-download-center__list-tab .cp-download-center__list');
	let indicatorBtn = $('.cp-download-center__model-list-indicator span');
	
	listTabBtn.on('click', function(e){
		e.preventDefault();
		listTabCont.css({'height' : 'auto'});
		let wSize = $(window).width();
		let _this = $(this);
		let tabItemIdx = _this.closest(listTabParent).index();
		let listTabHgt = listTabCont.eq(tabItemIdx).height();
		let listTabOuterHgt = listTabCont.parent().height() - listTabHgt;
		let listTabOuterHgtSum = listTabCont.parent().height() - listTabOuterHgt + 172; // main.css line 309 : padding 86px, 8.6rem;
		listTabCont.removeAttr('style');
		_this.closest(listTabParent).addClass('is-active').siblings().removeClass('is-active');
		setTimeout(function(){
			if (wSize > 767) {
				listTabCont.parent().css('height', listTabOuterHgtSum);
			} else {
				listTabCont.parent().css('height', listTabOuterHgtSum - 42);
			}
			listTabCont.eq(tabItemIdx).css({'height' : listTabHgt}).addClass('is-active').siblings().removeAttr('style').removeClass('is-active');
			listTabCont.parent().addClass('is-active');
			indicatorBtn.eq(tabItemIdx).addClass('on').siblings().removeClass('on');
		}, 0);
		setTimeout(function(){
			listTabCont.eq(tabItemIdx).removeAttr('style');
		}, 500);
		
		$(window).on('resize', function(){
			if ($(window).width() < 768) {
				scrdlTabWid ();
			} else {
				listTabParent.closest(listTabWrap).animate({ scrollLeft: 0 }, 500);
			}
		});

		function scrdlTabWid () {
			let listTabItemWid = listTabParent.outerWidth();
			if ($(window).width() > 374) {
				listTabParent.closest(listTabWrap).animate({scrollLeft : (listTabItemWid * tabItemIdx) - 40}, 500);
			} else {
				listTabParent.closest(listTabWrap).animate({ scrollLeft: listTabItemWid * tabItemIdx}, 500);
			}
		}
		
		if (wSize < 768) {
			scrdlTabWid ();
		}
	});
	
	listTabWrap.on('scroll', function(){
		let _this = $(this);
		let scrPos = _this.scrollLeft();
		listTabWrap.parent().find('.x-scroll').css('left', scrPos / listTabWrapWid * listTabWrapSum);
	});
	
	$(window).on('resize', function(){
		slideAutoWid ();
		if ($(window).width() < 768) {
			listTabWrap.removeClass('x-swiper');
			xScroll ();
			scrAutoWid ();
		} else {
			if (listTabParentLength > minLength) {
				listTabWrap.addClass('x-swiper');
			}
			scrAutoWid ();
			moveSlideWid = -(swiperItemWid * num);
			listTabParent.parent().css({'transform' : 'translateX(' + moveSlideWid + 'px)'});
			$('.x-scroll').remove();
		}
	});

	if (listTabParentLength > minLength) {
		listTabWrap.addClass('x-swiper');
	}

	listTabOuter.addClass('col' + listTabParentLength);
	
	if (listTabParentLength > minLength) {
		listTabWrap.parent().append('<div class="btn-swiper-box"><button class="x-btn-prev">prev</button><button class="x-btn-next">next</button></div>');
	} else {
		$('.cp-download-center__model-list-wrap.x-swiper').css('width', '100%');
	}

	indicatorBtn.on('click', function(){
		let _this = $(this);
		let numIdx = _this.index();
		_this.addClass('on').siblings().removeAttr('class');
		listTabBtn.eq(numIdx).trigger('click');
	});

	$('.btn-swiper-box button').on('click', function(){
		slideAutoWid ();
		if (!listTabParent.parent().is(':animated')) {
			listTabParent.parent().animate({ 'overflow': 'visible' }, 500);
			if ($(this).hasClass('x-btn-prev')) {
				if (num > 0) {
					moveSlideWid += swiperItemWid;
					--num;
				}
			} else {
				if (num < listTabParentLength - minLength) {
					moveSlideWid += -swiperItemWid;
					++num;
				}
			}
			listTabParent.parent().css({'transform' : 'translateX(' + moveSlideWid + 'px)'});
		}
		numChk ();
	});

	function slideAutoWid () {
		swiperItemWid = parseInt(listTabParent.outerWidth(true));
	}

	function numChk () {
		if (num == 0) {
			$('.x-btn-prev').addClass('disabled');
		} else {
			$('.x-btn-prev').removeClass('disabled');
		}

		if (num == listTabParentLength - minLength) {
			$('.x-btn-next').addClass('disabled');
		} else {
			$('.x-btn-next').removeClass('disabled');
		}
	}
	numChk ();

	function xScroll () {
		if ($(window).width() < 768) {
			if ($('.x-scroll').length < 1) {
				listTabWrap.parent().prepend('<div class="x-scroll"></div>');
			}
		}
	}
	xScroll ();

	function scrAutoWid () {
		listTabWrapWid = listTabWrap.outerWidth(true);
		listTabWrapSum = listTabWrapWid * listTabWrapWid / listTabWrap[0].scrollWidth;
		listTabWrap.parent().find('.x-scroll').css('width', listTabWrapSum);
	}
	scrAutoWid ();
});