$(function () {
	const scrItem = $('.scr-item');
	const scrIdxLst = $('.scr-idx-list a');
	const ftrCnt = $('.hmj-footer');

	$('body').on('mousewheel DOMMouseScroll', scrItem, function (e) {
		let scrPos = $(window).scrollTop();
		let tScrIdx = $('.scr-item.active').index();
		if (!$('html, body').is(':animated')) {
			if (e.originalEvent.wheelDelta < 0) {
				$('html, body').stop().animate({'overflow':'visible'}, fadeVal);
				// if (tScrIdx <= scrItem.length) {
				if (tScrIdx !== $(this.length)) {
					scrItem.eq(tScrIdx + 1).addClass('active').siblings().removeClass('active');
					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
				} else {
					ftrCnt.addClass('active');
				}
				return false;
			} else {
				$('html, body').stop().animate({'overflow':'visible'}, fadeVal);
				if (!ftrCnt.hasClass('active')) {
					if (tScrIdx !== 0) {
						scrItem.eq(tScrIdx - 1).addClass('active').siblings().removeClass('active');
						scrIdxLst.parent().eq(tScrIdx - 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
					}
					return false;
				}
				ftrCnt.removeClass('active');
			}
		} else {
			e.stopPropagation();
			return false;
		}
	});

	scrIdxLst.click(function(e){
		e.preventDefault();
		let scrIdxNum = $(this).parent().index();
		let scrOffset = scrItem.eq(scrIdxNum).outerHeight();
		$('html, body').stop().animate({scrollTop:scrOffset * scrIdxNum}, fadeVal);
		scrIdxLst.removeClass('active').parent().eq(scrIdxNum).find('a').addClass('active');
		scrItem.removeClass('active').eq(scrIdxNum).addClass('active');
	});
});