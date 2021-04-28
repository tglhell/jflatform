$(function () {
	$(window).scroll(function () {
		let scrPos = $(this).scrollTop();
		$('.prx-scr').css('background-position-y', scrPos / 5);
	});

	let typingBool = false;
	let typingIdx = 0;
	let typingTxt = $('h1').attr('data-text');
	typingTxt = typingTxt.split('');
	if (typingBool == false) {
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