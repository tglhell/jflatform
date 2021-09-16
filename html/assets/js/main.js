$(function () {
	const scrItem = $('.scr-item');
	const scrIdxLst = $('.scr-idx-list a');
	const ftrCnt = $('.hmj-footer');
	let startY, endY;

	if ($(window).width() > tbl) {
		scrItem.on('mousewheel DOMMouseScroll', function (e) {
			tScrIdx = $('.scr-item.active-idx').index();
			if (!$('html, body').is(':animated')) {
				if (e.originalEvent.wheelDelta < 0) {
					scrDown();
				} else {
					scrUp();
				}
			} else {
				e.stopPropagation();
				return false;
			}
		});
	} else {
		scrItem.on('touchstart',function (e) {
			startY = e.originalEvent.changedTouches[0].screenY;
		});
		scrItem.on('touchend',function (e) {
			endY = e.originalEvent.changedTouches[0].screenY;
			tScrIdx = $('.scr-item.active-idx').index();
			if (!$('html, body').is(':animated')) {
				if(startY - endY > 10){
					scrDown();
				} else if (endY - startY > 10){
					scrUp();
				}
			}
		});
	}

	scrIdxLst.on('click', function (e) {
		e.preventDefault();
		const scrIdxNum = $(this).parent().index();
		ftrCnt.removeClass('active');
		scrItem.removeClass('active');
		$('.scr-item:nth-child(-n + ' + (scrIdxNum + 1) + ')').addClass('active');
		scrItem.eq(scrIdxNum).addClass('active-idx').siblings().removeClass('active-idx');
		scrIdxLst.removeClass('active').parent().eq(scrIdxNum).find('a').addClass('active');
	});

	function scrDown () {
		$('html, body').stop().animate({'overflow':'visible'}, secVal[6]);
		if (tScrIdx !== $(this.length)) {
			scrItem.eq(tScrIdx + 1).addClass('active');
			scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
			scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
		}
		if ((tScrIdx + 1) == scrItem.length) {
			ftrCnt.addClass('active');
		}
		return false;
	}
	function scrUp () {
		$('html, body').stop().animate({'overflow':'visible'}, secVal[6]);
		if (!ftrCnt.hasClass('active')) {
			if (tScrIdx !== 0) {
				scrItem.eq(tScrIdx).removeClass('active');
				scrItem.eq(tScrIdx - 1).addClass('active-idx').siblings().removeClass('active-idx');
				scrIdxLst.parent().eq(tScrIdx - 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
			}
			return false;
		}
		ftrCnt.removeClass('active');
	}
});