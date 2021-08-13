$(function () {
	let numArr = [];
	let valChk = false;
	$(window).scroll(function () {
		let scrPos = $(this).scrollTop();
		const AniItem = $('.animate-num');
		const numberInit = new Intl.NumberFormat();
		$('.prx-scr').css('background-position-y', scrPos / 3);
		if (!valChk) {
			for (let i = 0; i < AniItem.length; i++ ) {
				let thisTxt = AniItem.eq(i).text();
				numArr.push(thisTxt);
				$({numStat : 0}).animate({numStat : numArr[i]}, {
					duration: 1000,
					progress: function() {
						let thisVal = this.numStat;
						AniItem.eq(i).text(numberInit.format(Math.ceil(Math.random() * thisVal)));
						// AniItem.eq(i).text(numberInit.format(Math.floor(thisVal)));
					}/* ,
					complete: function () {
						AniItem.eq(i).text(numArr[i]);
					} */
				});
			}
			valChk = true;
		}
	});

	let typingBool = false;
	let typingIdx = 0;
	let typingTxt = $('h1').attr('data-text');
	typingTxt = typingTxt.split('');
	if (!typingBool) {
		typingBool = true;
		var tyInt = setInterval(typing, 100);
	}

	function typing () {
		if(typingIdx < typingTxt.length) {
			$('h1').append(typingTxt[typingIdx]);
			typingIdx++;
		} else {
			clearInterval(tyInt);
		}
	}
});