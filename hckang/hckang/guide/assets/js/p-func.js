// Popup
$('.popup').click((function () {
	var returnTar;
	return function (e) {
		var bodyWid = $('body').width();
		returnTar = $(e.target).closest('button'),
		wSize = $(window).width(),
		popIdx = $(this).attr('pop-idx');
		$('.layerPopupWrap' + '[pop-idx=' + popIdx + ']').fadeIn(500).css('display', 'table');
		$('.layerPopupCont').attr('tabindex', '0').fadeIn(500);
		if (wSize > 1024) {
			$('body').css({ 'overflow': 'hidden', 'width': bodyWid });
		}
		setTimeout(function () {
			$('.layerPopupCont').focus().append('<a href="#" class="tarLoop"></a>');
			$('.tarLoop').focusin(function () {
				$('.layerPopupCont').focus();
			});
		}, 0);
		
		$('.popupClose, .layerPopupWrap').click(function (e) {
			var tarItem = $('.layerPopupCont > div, .layerTitle, .layerCont *');
			if (!$(e.target).is(tarItem)) {
				$('.layerPopupWrap').fadeOut(500);
				$('.layerPopupCont').removeAttr('tabindex').fadeOut(500);
				$('.tarLoop').remove();
				setTimeout(function () {
					returnTar.focus();
				}, 0);
				setTimeout(function(){
					if (wSize > 1024) {
						$('body').css({'overflow':'auto', 'width':'auto'});
					}
				}, 800);
			}
		});
	}
})());