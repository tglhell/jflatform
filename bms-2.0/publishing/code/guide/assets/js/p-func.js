// Popup
$('.popup').click((() => {
	var returnTar;
	return function (e) {
		var bodyWid = $('body').width();
		returnTar = $(e.target).closest('button'),
		wSize = $(window).width(),
		popIdx = $(this).attr('pop-idx');
		$('.layerPopupWrap' + '[pop-idx=' + popIdx + ']').fadeIn(500).css('display', 'table');
		$('.layerPopupCont').attr('tabindex', '0').fadeIn(500);
		setTimeout(() => {
			$('.layerPopupCont').focus().append('<a href="#" class="tarLoop"></a>');
			$('.tarLoop').focusin(() => {
				$('.layerPopupCont').focus();
			});
		}, 0);
		
		$('.popupClose, .layerPopupWrap').on('click', (e) => {
			var tarItem = $('.layerPopupCont > div, .layerTitle, .layerCont *');
			if (!$(e.target).is(tarItem)) {
				$('.layerPopupWrap').fadeOut(500);
				$('.layerPopupCont').removeAttr('tabindex').fadeOut(500);
				$('.tarLoop').remove();
				setTimeout(() => {
					returnTar.focus();
				}, 0);
			}
		});
	}
})());