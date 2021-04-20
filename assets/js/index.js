$(function () {
	const posItem = $('.step-cont');
	const ftwVal = $('body').css('font-weight') / 4;
	let posArr = [];
	let ffHgt = $(window).height();
	let posItemLength = posItem.length;

	$(window).scroll(function () {
		let scrPos = $(this).scrollTop();
		for (let i = 0; i < posItemLength; i++) {
			let thisPos = posItem.eq(i).offset().top;
			posArr.push(thisPos);
			if (scrPos > posArr[i] - ffHgt + (ftwVal / 2)) {
				posItem.eq(i).removeAttr('ir').attr('ir-idx', i);
			} else {
				posItem.eq(i).removeAttr('ir-idx').attr('ir', '');
			}
		}
	});

	function irInsert() {
		$('[ir]').each(function (index) {
			const _this = $(this);
			if (!$(this).hasClass('on')) {
				_this.removeAttr('ir').attr('ir-idx', (index + 1));
			}
		});
	}

	setTimeout(function () {
		irInsert();
	}, 0);
});