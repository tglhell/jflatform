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
		tScrIdx = $('.scr-item.active-idx').index();
		scrIdxCnt = $('.scr-idx-list a.active').parent().index();
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
			tScrIdx = $('.scr-item.active-idx').index();
			scrIdxCnt = $('.scr-idx-list a.active').parent().index();
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
		$('html, body').stop().animate({'overflow':'visible'}, secVal[3]);
		if (tScrIdx !== $(this.length)) {
			if (!$('.gall').hasClass('active-idx')) {
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
		}
		return false;
	}
	function dirUp () { // down
		$('html, body').stop().animate({'overflow':'visible'}, secVal[3]);
		if (!ftrCnt.hasClass('active')) {
			if (tScrIdx !== 0) {
				if (!$('.gall').hasClass('active-idx')) {
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
});