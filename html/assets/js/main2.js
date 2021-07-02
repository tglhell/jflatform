$(function () {
	function videoAutoSize () {
		let winWid = $(window).width();
		if ($(window).width() < 1920) {
			$('.ie11 .main-top-cont video').css({'width':winWid + (winWid / 2)});
		} else {
			$('.main-top-cont video').css({'width':winWid});
		}
	}
	setTimeout(function(){
		videoAutoSize();
	}, 0);

	$(window).on('resize', function(){
		videoAutoSize();
	});
});