$(function () {
	let numArr = [];
	let valChk = false;
	$(window).scroll(function () {
		let scrPos = $(this).scrollTop();
		const AniItem = $('.animate-num');
		$('.prx-scr').css('background-position-y', scrPos / 5);
		if (!valChk) {
			for (let i = 0; i < AniItem.length; i++ ) {
				let thisTxt = AniItem.eq(i).text();
				numArr.push(thisTxt);
				$({percent : 0}).animate({percent : numArr[i]}, {
					duration: 1000,
					progress: function() {
						let thisVal = this.percent;
						// AniItem.eq(i).text(Math.floor(Math.random() * thisVal));
						AniItem.eq(i).text(Math.floor(thisVal));
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
		var tyInt = setInterval(typing, 50);
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