$(function () {
	const showMainList = $('[ir] > li');
	const posItem = $('.wrap .step-pos');
	const posItemTxt = $('.step-cont');
	let posArr = [];
	let ffHgt = $(window).height();
	let posItemLength = posItemTxt.length;

	function irInsert() {
		$('[ir]').each(function (index) {
			const _this = $(this);
			let iNum = showMainList.length;
			if (_this.children().is('li')) {
				_this.removeAttr('ir').attr('ir-group-idx', (index + 1));
			} else {
				if (!$(this).hasClass('on')) {
					_this.removeAttr('ir').attr('ir-idx', (index + 1));
				}
			}
			setTimeout(function () {
				for (i = 0; i <= iNum; i++) {
					$(function (i) {
						setTimeout(function () {
							showMainList.eq(i).addClass('active');
						}, 300 * i);
					}(i));
				}
			}, 2000);
		});
	}

	setTimeout(function () {
		irInsert();
	}, 0);

	$(window).scroll(function () {
		let scrPos = $(this).scrollTop();
		for (var i = 0; i < posItemLength; i++) {
			let thisPos = posItemTxt.eq(i).offset().top;
			posArr.push(thisPos);
			if (scrPos > posArr[i] - ffHgt + 100) {
				posItemTxt.eq(i).removeAttr('ir').attr('ir-idx', (i + (posItemLength + 1)));
			} else {
				posItemTxt.eq(i).removeAttr('ir-idx').attr('ir', '');
			}
		}
	});
});