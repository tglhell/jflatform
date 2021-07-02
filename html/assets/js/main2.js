$(function () {
	function videoAutoSize () {
		let winWid = $(window).width();
		let winHgt = $(window).height();
		if ($('video').length >= 1) {
			$('.main-top-cont video').css({'width':winWid});
			if ($('html').hasClass('ie11')) {
				if (winWid < 1920 && winWid > 1200) {
					$('.ie11 .main-top-cont video').css({'width':winWid + (winWid / 2)});
				} else if (winWid < 1200) {
					$('.ie11 .main-top-cont video').css({'width':winWid + (winHgt * 2)});
				}
			}
		}
	}
	setTimeout(function(){
		videoAutoSize();
	}, 0);

	$(window).on('resize', function(){
		videoAutoSize();
	});
});